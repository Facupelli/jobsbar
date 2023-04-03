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

  totalPoints: number;
  totalPointsSpent: number;
  roles?: Role[];
};

export type ConsumptionCategory = {
  id: string;
  name: string;
  consumptions?: Consumption[];
};

export type Consumption = {
  id: string;
  name: string;
  consumptionCategory?: ConsumptionCategory;
  consumptionCategoryId: string;
  points: number;
  users?: ConsumptionOnUser[];
  promotions?: ConsumptionOnPromotion[];
};

export type SortedConsumption = {
  id: string;
  name: string;
  type: ConsumptionCategory;
  points: number;
  users: ConsumptionOnUser[];
  promotions: ConsumptionOnPromotion[];
  total: number;
};

export type ConsumptionOnUser = {
  id: string;
  user?: User;
  userId: string;
  consumption?: Consumption;
  consumptionId: string;
  quantity: number;
  winner: boolean | null;
  createdAt: Date;
};

export type Membership = {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number | null;
  users?: User[];
  promotions?: Promotion[];
};

export type Promotion = {
  id: string;
  name: string;
  memberships: Membership[];
  consumptions: ConsumptionOnPromotion[];
  users: PromotionOnUser[];
  points: number;
  discount: number;
};

export type SortedPromotion = {
  id: string;
  name: string;
  memberships: Membership[];
  consumptions: ConsumptionOnPromotion[];
  users: PromotionOnUser[];
  points: number;
  total: number;
};

export type ConsumptionOnPromotion = {
  consumption: Consumption;
  consumptionId: string;
  promotion: Promotion;
  promotionId: string;
  quantity: number;
  createdAt: Date;
};

export type PromotionOnUser = {
  id: string;
  promotion: Promotion;
  promotionId: string;
  user: User;
  userId: string;
  quantity: number;
  createdAt: Date;
};
