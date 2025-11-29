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

export interface SpoonacularIngredient {
  id: number;
  aisle: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  measures: {
    us: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
    metric: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
  }
}

export interface SpoonacularNutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface SpoonacularNutritionInfo {
  nutrients: SpoonacularNutrient[];
  properties: {
    nutritionScore: number;
  };

  ingredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
    nutrients: SpoonacularNutrient[];
  }[];

  caloricBreakdown: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
  weightPerServing: {
    amount: number;
    unit: string;
  };
}

export interface SpoonacularRecipeInformation {
  title: string;
  healthScore: number;
  servings: number;
  instructions: string;

  extendedIngredients: SpoonacularIngredient[];
  nutrition: SpoonacularNutritionInfo;
}