export type ConsumptionActive = "Bebida" | "Comida" | "Juego" | "Promociones";

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
  maxPoints: number | null;
};

export type Active = "Comida" | "Bebida" | "Juego";

export type CreatePromotion = {
  name: string;
  membershipsIds: string[];
  juegoIds: string[];
  bebidaIds: string[];
  comidaIds: string[];
  points: number;
  discount: number;
};

export type AdminPromotion = {
  id: string;
  consumptions: {
    consumption: {
      consumptionCategory: {
        name: string;
      };
      name: string;
    };
  }[];
  name: string;
  points: number;
  memberships: {
    name: string;
  }[];
  discount: number;
};
