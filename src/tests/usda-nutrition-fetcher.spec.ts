import { UsdaNutritionFetcher } from "../models/usda-nutrition-fetcher.model.js";
import type { SimplifiedFoodInfo, SimplifiedSearchFood, SimplifiedSearchInfo } from "../interfaces/Types.interface.js";

describe("UsdaNutritionFetcher", () => {
    let realFetcher: UsdaNutritionFetcher;

    beforeAll(() => {
        realFetcher = new UsdaNutritionFetcher();
    });

    it("should get food by valid FDC ID with default format", async () => {
        const fdcId: number = 2057648; // Cheddar Cheese
        const expectedFood: SimplifiedFoodInfo = {
            fdcId: fdcId,
            description: "CHEDDAR CHEESE",
            servingSize: 28,
            servingSizeUnit: "g",
            labelNutrients: {
                fat: { value: 8 },
                protein: { value: 6 },
                carbohydrates: { value: 1 },
            }
        }

        await realFetcher.getFoodById(fdcId).then((data) => {
            expect(data.fdcId).toBe(expectedFood.fdcId);
            expect(data.description).toBe(expectedFood.description);
            expect(data).toHaveProperty("servingSize");
            expect(data.servingSize).toBeTypeOf("number");
            expect(data).toHaveProperty("servingSizeUnit");
            expect(data.servingSizeUnit).toBeTypeOf("string");
            expect(data).toHaveProperty("labelNutrients");
            expect(data.labelNutrients).toHaveProperty("fat");
            expect(data.labelNutrients).toHaveProperty("protein");
            expect(data.labelNutrients).toHaveProperty("carbohydrates");
        });

    });

    it("should throw an error for invalid FDC ID", async () => {
       const invalidId = 1;
       
       await expect(realFetcher.getFoodById(invalidId)).rejects.toThrow();

       const invalidNegativeId = -5;
       await expect(realFetcher.getFoodById(invalidNegativeId)).rejects.toThrow();
    });

    it("should throw an error for large FDC ID", async () => {
        const largeFdcId: number = 999999999999;
        await expect(realFetcher.getFoodById(largeFdcId)).rejects.toThrow();
    });

    it("should search for a valid food", async () => {
        const searchQuery: string = "Cheddar Cheese";
        const expectedFood: SimplifiedSearchFood = {
        fdcId: 2095236,
        description: searchQuery.toUpperCase()
        };
        const expectedResponse: SimplifiedSearchInfo = {
            totalHits: 64501,
            currentPage: 1,
            foods: [
                expectedFood
            ]
        };
        
        await realFetcher.search(searchQuery).then((data) => {
            expect(data.currentPage).toBe(expectedResponse.currentPage);
            expect(data.totalHits).toBeGreaterThan(0);
            expect(data.foods.length).toBeGreaterThan(0);
            expect(data.foods[0].fdcId).toEqual(expectedFood.fdcId);
            expect(data.foods[0].description).toEqual(expectedFood.description);
        }).catch((error) => {
            throw new Error(`Search failed: ${error}`);
        });

    }, 10000);

    it("should return 0 results for an invalid food", async () => {
        const searchQuery: string = "asldkfjalskdfjcheese";

        await realFetcher.search(searchQuery).then((data) => {
            expect(data.totalHits).toBe(0);
            expect(data.foods.length).toBe(0);
        }).catch((error) => {
            throw new Error(`Search failed: ${error}`);
        });
    }, 10000);

    it("should disallow empty search queries", async () => {
        const searchQuery: string = "";
        await expect(realFetcher.search(searchQuery)).rejects.toThrow();
    });

    it("should not allow large search queries", async () => {
        const searchQuery: string = "a".repeat(100000);
        await expect(realFetcher.search(searchQuery)).rejects.toThrow();
    }); 

    it("should get 2nd result for query", async () => {
        const searchQuery: string = "Cheddar Cheese";
        const result: number = 2;
        await realFetcher.search(searchQuery, 1, result).then((data) => {
            expect(data.currentPage).toBe(result);
            expect(data.totalHits).toBeGreaterThan(1);
            expect(data.foods.length).toBe(1);

            expect(data.foods[0].fdcId).toBe(2057648);
            expect(data.foods[0].description).toBe("CHEDDAR CHEESE");
        });
    }, 10000);

    it("should show two results per page", async () => {
        const searchQuery: string = "Cheddar Cheese";
        const pageSize: number = 2;

        await realFetcher.search(searchQuery, pageSize).then((data) => {
            expect(data.currentPage).toBe(1);
            expect(data.totalHits).toBeGreaterThan(1);
            expect(data.foods.length).toBe(pageSize);

            expect(data.foods[0].fdcId).toBe(2095236);
            expect(data.foods[0].description).toBe("CHEDDAR CHEESE");
            expect(data.foods[1].fdcId).toBe(2057648);
            expect(data.foods[1].description).toBe("CHEDDAR CHEESE");
        })
    }, 10000);

    it("should throw an error if page size is less than 1", async () => {
        const searchQuery: string = "Cheddar Cheese";
        const pageSize: number = 0;

        await expect(realFetcher.search(searchQuery, pageSize)).rejects.toThrow();

        const pageSizeNegative: number = -5;
        await expect(realFetcher.search(searchQuery, pageSizeNegative)).rejects.toThrow();
    });

    it("should throw an error if page number is less than 0", async () => {
        const searchQuery: string = "Cheddar Cheese";
        const pageNumber: number = -1;

        await expect(realFetcher.search(searchQuery, 1, pageNumber)).rejects.toThrow();
    });

    it("should throw an error for too large page size", async () => {   
        const searchQuery: string = "Cheddar Cheese";
        const pageSize: number = 201;

        await expect(realFetcher.search(searchQuery, pageSize)).rejects.toThrow();
    });

    it("should throw an error for too large page size even with valid page number", async () => {   
        const searchQuery: string = "Cheddar Cheese";
        const pageSize: number = 200;
        const pageNumber: number = 99999;

        await expect(realFetcher.search(searchQuery, pageSize, pageNumber)).rejects.toThrow();
    }, 10000);
});
