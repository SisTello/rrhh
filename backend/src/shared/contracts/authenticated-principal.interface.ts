export interface AuthenticatedPrincipal {
  userId: string;
  permissions: readonly string[];
}

export interface Authenticator {
  authenticate(authorization: string | undefined): Promise<AuthenticatedPrincipal>;
}
