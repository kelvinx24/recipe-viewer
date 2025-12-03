import { describe, it, expect, vi, beforeEach, type MockedObject } from "vitest";
import { UsdaNutritionFetcher } from "../models/usda-nutrition-fetcher.model";
import { HttpClient } from "../models/http-client.model";
import type { SimplifiedFoodInfo, SimplifiedSearchFood, SimplifiedSearchInfo } from "../interfaces/Types.interface";

const getMock = vi.fn();
const searchMock = vi.fn();

// Mock HttpClient module
vi.mock("../models/http-client.model", () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ( {
      get: getMock,
      post: searchMock,
    })),
  };
});

// vi.spyOn(HttpClient.prototype, "post").mockResolvedValue({flaming: "yes"});


describe("UsdaNutritionFetcher", () => {
  const fakeApiKey = "FAKE_API_KEY";
  let fetcher: UsdaNutritionFetcher;

  beforeEach(() => {
    vi.clearAllMocks();
    fetcher = new UsdaNutritionFetcher(fakeApiKey);
    // Access the internal mock client instance
  });

  it("should initialize HttpClient with correct base URL and headers", () => {
    expect(HttpClient).toHaveBeenCalledWith("https://api.nal.usda.gov/fdc/v1/", {
      "X-Api-Key": fakeApiKey,
    });
  });

  it("should call HttpClient.get with correct parameters when format is omitted", async () => {
    const fakeResponse: SimplifiedFoodInfo = {
      fdcId: 20576,
      description: "Cheddar Cheese",
      servingSize: 28,
      servingSizeUnit: "g",
      labelNutrients: {
        fat: { value: 8 },
        protein: { value: 6 },
        carbohydrates: { value: 1 }
      },
    };

    const promiseFakeResponse = Promise.resolve(fakeResponse);

    getMock.mockResolvedValue(promiseFakeResponse);

    await expect(fetcher.getFoodById(2057648)).resolves.toEqual(fakeResponse);

    expect(getMock).toHaveBeenCalledWith("food/2057648", { format: "full" });
  });

  it("should use provided format parameter when specified", async () => {
    const fakeResponse: SimplifiedFoodInfo = {
      fdcId: 30,
      description: "Mozzarella",
      servingSize: 30,
      servingSizeUnit : "g",
      labelNutrients: {
        fat: { value: 7 },
        protein: { value: 6 },
        carbohydrates: { value: 1 }
      },
    };

    getMock.mockResolvedValue(fakeResponse);

    await expect(fetcher.getFoodById(12345, true)).resolves.toEqual(fakeResponse);

    expect(getMock).toHaveBeenCalledWith("food/12345", { format: "abridged" });
  });

  it("should propagate errors from HttpClient", async () => {
    getMock.mockRejectedValue(new Error("Not found"));

    await expect(fetcher.getFoodById(999)).rejects.toThrow("Failed to fetch food item with FDC ID 999: Error: Not found");
  });

  it("should search for a food by its name and return the id of the first food that matches", async () => {
    const fakeFood: SimplifiedSearchFood  = {
      fdcId: 30,
      description: "French Fries"
    }
    const fakeSearchResponse: SimplifiedSearchInfo = {
        totalHits: 1,
        currentPage: 3,
        foods: [fakeFood]
    }

    searchMock.mockResolvedValue(fakeSearchResponse);

    const testQuery: string = "French Fries";
    const firstArg = "foods/search";
    const secondArg = {
      query: testQuery,
      pageSize: 1,
      pageNumber: 1
    }

    await expect(fetcher.search(testQuery)).resolves.toBe(fakeSearchResponse);
    expect(searchMock).toHaveBeenCalledWith(firstArg, secondArg);
  });

  it("search queries with no results should throw an error", () => {
    searchMock.mockRejectedValue(new Error("Not found"));

    return expect(fetcher.search("something"))
        .rejects
        .toThrow("Search request failed: Error: Not found");
  });


  

});
