export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "development" | "production";
      PORT?: string;

      APP_DB_URL: string;
      KAKAO_API_KEY: string;
      GWANGCHA_JWT_SECRET: string;
      GWANGCHA_MAILER_PASSWORD: string;
      GWANGCHA_AUTH_REDIS_URL: string;
    }
  }

  declare namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}
