export interface LoginInput {
  email: string
  password: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

/** What useAuth depends on — AuthApiClient implements this. */
export interface IAuthApiClient {
  login(input: LoginInput): Promise<AuthTokens>
}
