import type { Recipe } from "../interfaces/recipe.interface";
import { BasicRecipe } from "../models/basic-recipe.model";

describe('Basic Recipe Unit Tests', () => {
    const exampleName: string = "French Fries"; 

    let exampleRecipe: BasicRecipe;

    beforeEach(() =>{
        exampleRecipe = new BasicRecipe(exampleName);
    })

    it("should create a blank Basic Recipe object with input name", () => {
        let recipe: BasicRecipe = new BasicRecipe(exampleName);
        expect(recipe).toBeInstanceOf(BasicRecipe);

        expect(recipe.name).toBe(exampleName);
        expect(recipe.ingredients.length).toBe(0);
        expect(recipe.steps.length).toBe(0);
        expect(recipe.rating).toBe(0);
    })

    it("should add a valid step to the end of a recipe", () => {
        expect(exampleRecipe.steps.length).toBe(0);

        let someStep: string = "Turn on stove";
        exampleRecipe.addStepToEnd(someStep);

        expect(exampleRecipe.steps).toBe(someStep)
    })

    it.each([
        ["null", null],
        ["undefined", undefined],
        ["empty string", ""],
        ["whitespace-only string", "   "],
    ])("should ignore %s input", (_label, invalidInput) => {
        expect(() => exampleRecipe.addStepToEnd(invalidInput as any)).not.toThrow();
        expect(exampleRecipe.steps.length).toBe(0);
    });



    it("should create a deep copy of the existing recipe", () => {
        let emptyCopyRecipe = exampleRecipe.copy();
        
        expect(emptyCopyRecipe).toBeInstanceOf(BasicRecipe);
        expect(emptyCopyRecipe).not.toBe(exampleRecipe);  

        expect(emptyCopyRecipe.name).toBe(exampleRecipe.name);
        expect(emptyCopyRecipe.ingredientsText).toBe("");
        expect(emptyCopyRecipe.stepsText).toBe("");
        expect(emptyCopyRecipe.rating).toBe(0);

        exampleRecipe.addStepToEnd("Eat pie");
        expect(emptyCopyRecipe.stepsText).toBe("");

        let copyRecipe: Recipe = exampleRecipe.copy();
        expect(copyRecipe).not.toBe(exampleRecipe);
        expect(copyRecipe.name).toBe(exampleRecipe.name);
        expect(copyRecipe.ingredientsText).toBe("");
        expect(copyRecipe.stepsText).toBe("Eat pie");
        expect(copyRecipe.rating).toBe(0);
    })

})