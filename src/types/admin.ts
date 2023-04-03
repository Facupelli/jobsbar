export type CreateConsumption = {
  name: string;
  categoryId: string;
  points: number;
};

export type CreateUser = {
  name: string;
};

export type CreateMembership = {
  name: string;
  minPoints: number;
  maxPoints: number;
};

export type Active = "Comida" | "Bebida" | "Juego";
