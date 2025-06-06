import { UserPurpose, UserType } from './enums';

export type JWTPayloadType = {
  id: number;
  userType: UserType;
};

export interface User {
  username: string;
  email: string;
  password: string;
  role: UserType;
  purpose: UserPurpose;
}
