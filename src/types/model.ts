export type Role = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;

  roles: Role[];
};

export type Membership = {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
};
