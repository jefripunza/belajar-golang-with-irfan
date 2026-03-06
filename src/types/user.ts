export interface User {
  id?: string;
  name: string;
  username: string;
  role: string;
}

export interface JwtClaims {
  id: string;
  role: string;
}
