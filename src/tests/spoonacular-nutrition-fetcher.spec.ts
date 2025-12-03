import { HttpClient } from "../models/http-client.model";
import { SpoonacularNutritionFetcher } from "../models/spoonacular-nutrition-fetcher.model";

const searchMock = vi.fn();

// Mock HttpClient module
vi.mock("../models/http-client.model", () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ( {
      post: searchMock,
    })),
  };
});


describe("Spoonacular Nutrition Fetcher", () => {
    const fakeApiKey = "FAKE_API";
    let fetcher: SpoonacularNutritionFetcher;

    beforeEach(() => {
      vi.clearAllMocks();
      fetcher = new SpoonacularNutritionFetcher();
    }); 

    it("should call HttpClient.post with correct parameters", async () => {
        const fakeFetcher = new SpoonacularNutritionFetcher(fakeApiKey);
        expect(HttpClient).toHaveBeenCalledWith("https://api.spoonacular.com/", {
            "x-api-key": fakeApiKey,
        });
    });

    it("should call HTTPClient.post with correct parameteres", async () => {
        const searchBody = {
            "title": "Spaghetti Carbonara",
            "servings": 2,
            "ingredients": [
                "1 lb spaghetti",
                "3.5 oz pancetta",
                "2 Tbsps olive oil",
                "1  egg",
                "0.5 cup parmesan cheese"
            ],
            "instructions": "Bring a large pot of water to a boil and season generously with salt. Add the pasta to the water once boiling and cook until al dente. Reserve 2 cups of cooking water and drain the pasta. "
        };

        searchMock.mockResolvedValue(Promise.resolve({nutrition: {}}));
        const params = {
            language: "en",
            includeNutrition: true
        }

        expect(await fetcher.fetch(searchBody, {includeNutrition: true})).toEqual({nutrition: {}});
        expect(searchMock).toHaveBeenCalledWith("recipes/analyze", searchBody, params);
        
    });

    it("should propagate errors from HttpClient", async () => {
        const errorMessage: string = "Uh oh, something went wrong!";
        const error: Error = new Error(errorMessage);
        searchMock.mockRejectedValue(error);

        await expect(fetcher.fetch("nothing")).rejects.toThrow(`Failed to fetch recipe information: ${errorMessage}`);
    });
});