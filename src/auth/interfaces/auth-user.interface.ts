export enum AuthUserType {
  USER = 'user',
  ADMIN = 'admin',
}

export interface AuthUser {
  id: number;
  identifier: string;
  type: AuthUserType;
}
