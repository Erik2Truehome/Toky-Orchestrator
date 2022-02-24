export interface GenerateTokenSuccessRes {
  success: boolean;
  data: GeneratedTokenData;
}

export interface GeneratedTokenData {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface GenerateTokenErrorRes {
  success: boolean;
  message: string;
  code: number;
  key: string;
}
