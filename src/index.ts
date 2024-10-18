/* eslint-disable @typescript-eslint/no-explicit-any */
// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import argon2 from "argon2";
import cookieParser from "cookie-parser";
import { PrismaClient, User } from "@prisma/client";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import axios from "axios";
import { createClient } from "redis";
import * as DTO from "./dto";
import * as Validator from "./validator";
import * as ServerError from "./serverError";
import {
  SignUpRequest,
  SignInRequest,
  KakaoUserResponse,
  NaverUserResponse
} from "types";
import generateRandomString from "./generateRandomString";
import { transporter, useEmailVerificationMailOptions } from "./mail";

const tokenGuard = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });

  try {
    const verified = jwt.verify(token, process.env.GWANGCHA_JWT_SECRET);
    if (
      typeof verified === "object" &&
      verified.expiresAt &&
      verified.expiresAt > Date.now()
    ) {
      req.userId = verified.userId;
      next();
    } else {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
  } catch {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
};

dotenv.config();

enum Cookies {
  GWANGCHA_USER_TOKEN = "GWANGCHA_USER_TOKEN"
}

const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

const redis = createClient({
  url: process.env.GWANGCHA_AUTH_REDIS_URL
});

const createToken = (user: User) => {
  const token = jwt.sign(
    {
      userId: user.id,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
    },
    process.env.GWANGCHA_JWT_SECRET
  );

  return token;
};

// const setAuthTokenToCookie = (res: Response, user: User) => {
//   res.cookie(Cookies.GWANGCHA_USER_TOKEN, createToken(user), {
//     httpOnly: process.env.NODE_ENV === "production",
//     secure: process.env.NODE_ENV === "production",
//     domain: process.env.NODE_ENV === "production" ? "silotek.co.kr" : undefined
//   });
// };

const app: Express = express()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(cookieParser())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    next();
  });

app.post(
  "/signup",
  [Validator.name, Validator.email, Validator.password],
  async (req: Request<any, any, SignUpRequest>, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json(result.array());
    }

    try {
      const { name, email, password } = req.body;
      const existingUser = await prisma.user.findFirst({
        where: { email }
      });
      if (existingUser) {
        return res.status(400).json([ServerError.existingEmail]);
      }
      const authCode = await redis.get(email);
      if (req.body.authCode !== authCode) {
        return res.status(400).json([ServerError.invalidAuthCode]);
      }
      const user = await prisma.user.create({
        data: { name, email, password: await argon2.hash(password) }
      });
      redis.del(email);

      res.json({
        ...DTO.user(user),
        accessToken: createToken(user)
      });
    } catch {
      return res.status(500).json({ message: "서버 오류입니다." });
    }
  }
);

const getUserFromRequest = async (req: Request<any, any, SignInRequest>) => {
  try {
    if (req.body.type === "email") {
      Validator.email.run(req);
      Validator.password.run(req);
      const result = validationResult(req);
      if (!result.isEmpty()) return result.array();

      const { email, password } = req.body;
      const user = await prisma.user.findFirst({
        where: { email }
      });
      if (!user) return [ServerError.invalidCredential];
      if (!user.password) return [ServerError.socialLoginRequired];

      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) return [ServerError.invalidCredential];

      return user;
    }

    if (req.body.type === "kakao") {
      const kakaoUser = await axios.get<unknown, KakaoUserResponse>(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${req.body.accessToken}`
          }
        }
      );
      if (!kakaoUser.data.kakao_account.email)
        return [ServerError.invalidCredential];
      const user = await prisma.user.findFirst({
        where: { email: kakaoUser.data.kakao_account.email }
      });
      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            email: kakaoUser.data.kakao_account.email,
            name: kakaoUser.data.kakao_account.name,
            phone: kakaoUser.data.kakao_account.phone_number
          }
        });
        return newUser;
      }
      return user;
    }

    if (req.body.type === "naver") {
      const naverApi = await axios.get<unknown, NaverUserResponse>(
        "https://openapi.naver.com/v1/nid/me",
        {
          headers: {
            Authorization: `Bearer ${req.body.accessToken}`
          }
        }
      );
      if (naverApi.data.resultcode !== "00") {
        return [ServerError.invalidCredential];
      }

      const naverUser = naverApi.data.response;
      const user = await prisma.user.findFirst({
        where: { email: naverUser.email }
      });
      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            email: naverUser.email,
            name: naverUser.name,
            phone: naverUser.mobile_e164
          }
        });
        return newUser;
      }
      return user;
    }
  } catch (e) {
    console.error(e);
    return [ServerError.unknown];
  }
  // if (req.body.type === 'google') {
  //   const googleUser = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
  //     headers: {
  //       Authorization: `Bearer ${req.body.accessToken}`
  //     }
  //   })
  //   if (!googleUser.data.email) return [ServerError.invalidCredential]
  //   const user = await prisma.user.findFirst({
  //     where: { email: googleUser.data.email }
  //   })
  //   if (!user) {
  //     const newUser = await prisma.user.create({
  //       data: {
  //         email: googleUser.data.email,
  //         name: googleUser.data.name,
  //         phone: googleUser.data.phone,
  //       }
  //     })
  //     return newUser
  //   }
  // }

  return [ServerError.unSupportedLoginType];
};

app.post(
  "/signin",
  async (req: Request<any, any, SignInRequest>, res: Response) => {
    const userOrError = await getUserFromRequest(req);
    // Error handling
    if (Array.isArray(userOrError)) return res.status(400).json(userOrError);
    // type guard & aliasing
    const user = userOrError;
    // set httpsOnly cookie
    // setAuthTokenToCookie(res, user);
    return res.json({
      ...DTO.user(user),
      accessToken: createToken(user)
    });
  }
);

app.post("/signout", (req: Request, res: Response) => {
  res.clearCookie(Cookies.GWANGCHA_USER_TOKEN);
  res.json({ message: "로그아웃 되었습니다." });
});

app.post(
  "/email-verification",
  [Validator.email],
  async (req: Request, res: Response) => {
    const { email, authCode } = req.body;

    const storedAuthCode = await redis.get(email);

    if (authCode !== storedAuthCode) {
      return res.status(400).json([ServerError.invalidAuthCode]);
    }

    return res.json({ message: "이메일 인증이 완료되었습니다." });
  }
);

app.post(
  "/email-verification/send",
  [Validator.email],
  async (req: Request<any, any, { email: string }>, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json(result.array());
    }

    try {
      const user = await prisma.user.findFirst({
        where: { email: req.body.email }
      });
      if (user) return res.status(400).json([ServerError.existingEmail]);
      // generate randomized auth code
      const authCode = generateRandomString(6);
      // set auth code to redis
      await redis.set(req.body.email, authCode, {
        EX: 60 * 10
      });

      const mailResult = await new Promise((resolve, reject) => {
        transporter.sendMail(
          useEmailVerificationMailOptions({
            authCode,
            email: req.body.email
          }),
          function (error, info) {
            if (error) {
              reject(error);
            } else {
              resolve(info);
            }
          }
        );
      });
      console.log(mailResult);
      res.json({ message: "이메일을 발송했습니다." });
    } catch {
      return res.status(500).json({ message: "서버 오류입니다." });
    }
  }
);

app.post("/signout", (req: Request, res: Response) => {
  res.clearCookie(Cookies.GWANGCHA_USER_TOKEN);
  res.json({ message: "로그아웃 되었습니다." });
});

app.get("/me", tokenGuard, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    if (!user) return res.status(401).json({ message: "로그인이 필요합니다." });

    res.json(DTO.user(user));
  } catch {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Auth Server");
});

redis
  .connect()
  .then(() => {
    console.log("redis connected");
  })
  .catch(error => {
    console.error(error);
  });
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
