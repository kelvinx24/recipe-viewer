import { resolve } from "path";
import { USDA_API_KEY } from "../env";
import type { SimplifiedFoodInfo, SimplifiedSearchInfo } from "../interfaces/Types.interface";
import { HttpClient } from "./http-client.model";

export class UsdaNutritionFetcher {
    private readonly serverURL: string = "https://api.nal.usda.gov/fdc/v1/"
    private readonly apiHeader: string = "X-Api-Key"
    private _apiKey: string;
    private readonly _client: HttpClient;

    constructor();
    constructor(apiKey: string);
    constructor(apiKey?: string, client?: HttpClient) {
        this._apiKey = apiKey ?? USDA_API_KEY;
        this._client = client ?? new HttpClient(this.serverURL, {[this.apiHeader]: this._apiKey});
    }

    /** Get details for a single food item by FDC ID */
    public async getFoodById(fdcId: number, format?: string): Promise<SimplifiedFoodInfo> {
        const params = {
            format: format ?? 'full'
        };


        return await this._client.get<SimplifiedFoodInfo>(`food/${fdcId}`, params)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                throw new Error(`Failed to fetch food item with FDC ID ${fdcId}: ${error}`);
            });
    }

    public async search(query: string, pageSize: number = 1, pageNumber: number = 1): Promise<SimplifiedSearchInfo> {
        const body = {
            query: query,
            pageSize: pageSize,
            pageNumber: pageNumber,
        };

       try {
            return await this._client.post<SimplifiedSearchInfo>("foods/search", body);
       } catch (error) {
            throw new Error(`Search request failed: ${error}`);
       }
    }
    
}