export type UsersRanking = {
  user: {
    id: string;
    fullName: string | null;
  };
  id: string;
  winner: boolean | null;
  quantity: number;
};
