import { check } from "express-validator";

export const email = check("email")
  .exists()
  .isEmail()
  .withMessage("올바른 이메일 주소를 입력해주세요.");
export const password = check("password")
  .exists()
  .isStrongPassword({ minLength: 12 })
  .withMessage(
    "비밀번호는 12글자 이상, 대소문자와 특수문자를 포함해야 합니다."
  );
export const phone = check("phone")
  .exists()
  .isMobilePhone("ko-KR")
  .withMessage("올바른 휴대전화 번호를 입력해주세요.");
export const name = check("name")
  .exists()
  .isString()
  .withMessage("이름을 입력해주세요.");
export const socialLoginType = check("type")
  .isIn(["email", "google", "kakao", "naver", "apple"])
  .withMessage("지원하지 않는 인증 방식입니다.");
