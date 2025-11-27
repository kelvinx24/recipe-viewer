export interface SimplifiedFoodInfo {
  fdcId: number;
  description: string;
  servingSize: number;
  servingUnit: string;
  labelNutrients: Record<string, { value: number }>;
}

export interface SimplifiedSearchInfo {
  totalHits: number;
  currentPage: number;
  foods: SimplifiedSearchFood[];
}

export interface SimplifiedSearchFood {
  fdcId: number;
  description: string;
}