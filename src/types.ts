export type SigningStrategy = "email" | "google" | "kakao" | "naver";

export type EmailSignInRequest = {
  email: string;
  password: string;
};
export type OAuthSignInRequest = {
  accessToken: string;
};

export type SignInRequest =
  | ({ type: "email" } & EmailSignInRequest)
  | ({ type: "google" | "kakao" | "naver" } & OAuthSignInRequest);

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
  type: SigningStrategy;
  authCode: string;
};

export interface KakaoUserResponse {
  data: {
    id: number;
    kakao_account: {
      email: string;
      name: string;
      phone_number: string;
    };
  };
}

export interface NaverUserResponse {
  data: {
    resultcode: string;
    message: string;
    response: {
      id: string;
      profile_image: string;
      email: string;
      mobile: string;
      mobile_e164: string;
      name: string;
    };
  };
}
