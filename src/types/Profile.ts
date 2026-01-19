export interface Profile {
  id: string;
  userId: string;
  email: string;
  name: string;
  nickname: string;
  mobile: string;
  roleId: string | null;
  roleName?: string;
  createdAt: Date;
  updatedAt: Date;
}
