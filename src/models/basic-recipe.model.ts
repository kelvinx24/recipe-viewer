import type { Recipe } from "../interfaces/recipe.interface";

export class BasicRecipe implements Recipe {
    private _name: string;
    private _ingredientsText: string;
    private _stepsText: string;
    private _rating: number;

    constructor(name: string);
    constructor(name: string, ingredientsText?: string, stepsText?: string, rating?: number) {
        this._name = name;
        this._ingredientsText = ingredientsText ?? "";
        this._stepsText = stepsText ?? "";
        this._rating = rating ?? 0;
    }

    get ingredients(): string {
        return this._ingredientsText;
    }
    get name(): string {
        return this._name;
    }
    get rating(): number {
        return this._rating;
    }
    get steps(): string {
        return this._stepsText;
    }

    get ingredientsText(): string {
        return this._ingredientsText;
    }

    get stepsText(): string {
        return this._stepsText;
    }

    addStepToEnd(text: string): void {
        if (text == null || text == undefined) {
            return;
        }

        let trimmed: string = text.trimStart().trimEnd();
        if (trimmed == '') {
            return;
        }

        this._stepsText += text;
    }

    copy(): Recipe {
        return new BasicRecipe(this._name, this._ingredientsText, this._stepsText, this._rating);
    }

    
} 