import type { SimplifiedFoodInfo } from "../interfaces/Types.interface";
import { HttpClient } from "./http-client.model";

export class UsdaNutritionFetcher {
    private readonly serverURL: string = "https://api.nal.usda.gov/fdc/v1/"
    private readonly apiHeader: string = "X-Api-Key"
    private _apiKey: string;
    private readonly _client: HttpClient;

    constructor(apiKey:string);
    constructor(apiKey: string, client?: HttpClient) {
        this._apiKey = apiKey;
        this._client = client ?? new HttpClient(this.serverURL, {[this.apiHeader]: apiKey});
    }

    /** Get details for a single food item by FDC ID */
    public async getFoodById(fdcId: number, format?: string): Promise<SimplifiedFoodInfo> {
        const params = {
            format: format ?? 'full'
        };


        return this._client.get<SimplifiedFoodInfo>(`food/${fdcId}`, params);
    }
    
}