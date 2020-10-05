export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface PasswordRecoveryParams {
  password: string;
  token: string;
}
