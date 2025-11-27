import type { Recipe } from "../interfaces/recipe.interface";

export class BasicRecipe implements Recipe {
    private _name: string;
    private _ingredients: string[];
    private _steps: string[];
    private _rating: number;

    constructor(name: string);
    constructor(name: string, ingredients?: string[], steps?: string[], rating?: number) {
        this._name = name;
        this._ingredients = ingredients ?? [];
        this._steps = steps ?? [];
        this._rating = rating ?? 0;
    }

    get ingredients(): string[] {
        return this._ingredients;
    }
    get name(): string {
        return this._name;
    }
    get rating(): number {
        return this._rating;
    }
    get steps(): string[] {
        return this._steps;
    }

    addStepToEnd(text: string): void {
        if (text == null || text == undefined) {
            return;
        }

        let trimmed: string = text.trimStart().trimEnd();
        if (trimmed == '') {
            return;
        }

        this._steps.push(text);
    }

    copy(): Recipe {
        return new BasicRecipe(this._name, [...this._ingredients], [...this._steps], this._rating);
    }

    
}