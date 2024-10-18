import { ValidationError } from "express-validator";

type ServerError = Pick<ValidationError, "msg"> & {
  type: string;
  path?: string;
  location?: string;
};

export const existingEmail: ServerError = {
  type: "existingEmail",
  msg: "이미 가입된 이메일 주소입니다.",
  path: "email",
  location: "body"
};
export const invalidCredential: ServerError = {
  type: "invalidCredential",
  msg: "메일 주소 또는 비밀번호가 일치하지 않습니다.",
  path: "any",
  location: "body"
};
export const unSupportedLoginType: ServerError = {
  type: "unSupportedLoginType",
  msg: "지원하지 않는 인증 방식입니다.",
  path: "any",
  location: "body"
};
export const redirectRequired: ServerError = {
  type: "redirectRequired",
  msg: "새로운 메일 주소로 회원 가입을 진행합니다"
};
export const socialLoginRequired: ServerError = {
  type: "socialLoginRequired",
  msg: "소셜 계정으로 로그인해주세요."
};
export const invalidAuthCode: ServerError = {
  type: "invalidAuthCode",
  msg: "인증 코드가 올바르지 않습니다."
};
export const unknown: ServerError = {
  type: "unknownError",
  msg: "특정되지 않은 오류입니다."
};
