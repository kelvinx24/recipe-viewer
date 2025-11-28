export interface Recipe {
    get ingredientsText(): string;

    get name(): string;

    get rating(): number;

    get stepsText(): string;

    addStepToEnd(text : string): void;

    copy(): Recipe;
}