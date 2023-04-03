export type ConsumptionsGrouped = {
  consumptions: { name: string; points: number; id: string }[];
  id: string;
  name: string;
};

export type UserConsumptionsGrouped = {
  consumptions: { name: string; users: { userId: String }[] }[];
  id: string;
  name: string;
};
