export type User = {
  id: number;
  username: string;
  email: string;
  fullname: string;
  disabled: boolean;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
  picture: string;
};

export type UserMiniDto = {
  id: number;
  fullname: string;
  username: string;
  picture: string;
};
