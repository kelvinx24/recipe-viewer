import {SPOONACULAR_API_KEY} from "../env.js";
import type { SpoonacularRecipeInformation } from "../interfaces/Types.interface.js";
import { HttpClient } from "./http-client.model";

interface FetchOptions {
    language?: string;
    includeNutrition?: boolean;
    includeTaste?: boolean;
}


export class SpoonacularNutritionFetcher {
    private readonly serverURL = "https://api.spoonacular.com/";
    private readonly apiKey: string;
    private readonly client: HttpClient;
;

    constructor(apiKey: string = SPOONACULAR_API_KEY, client?: HttpClient) {
        this.apiKey = apiKey;
        this.client = client ?? new HttpClient(this.serverURL, {
            "x-api-key": this.apiKey,
        });
    }

    async fetch(
        searchBody: any,
        {
            language = "en",
            includeNutrition = false,
            includeTaste = false,
        }: FetchOptions = {}
        ): Promise<SpoonacularRecipeInformation> {  
            const params: Record<string, any> = {}

            if (language) {
                params.language = language;
            }

            if (includeNutrition) {
                params.includeNutrition = includeNutrition;
            }

            if (includeTaste) {
                params.includeTaste = includeTaste;
            }


            try {
                // if await is removed, the error handling test fails since the original promise is never waited on
                // and thus the error is not caught within this try-catch block instead propagating to the caller
                return await this.client.post<SpoonacularRecipeInformation>(
                    "recipes/analyze",
                    searchBody,
                    params
                );
            } 
            catch (error: any) {
                throw new Error(`Failed to fetch recipe information: ${error?.message ?? error}`);
            }

        }

}