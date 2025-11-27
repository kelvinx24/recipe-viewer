export interface Recipe {
    get ingredients(): string[];

    get name(): string;

    get rating(): number;

    // ingredient in steps should display amount when hovered over
    get steps(): string[];

    addStepToEnd(text : string): void;

    copy(): Recipe;
}