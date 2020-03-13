import { Ingredient } from '../shared/ingredients.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShoppingService {
    ingredientsUpdated = new Subject<Ingredient[]>();
    private ingredients: Ingredient[] = [
        new Ingredient('Oranges', 15),
        new Ingredient('Broccoli', 5)
    ];

    ingredientEditing = new Subject<number>();

    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredientById(ingredientId: number) {
        return this.ingredients[ingredientId];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsUpdated.next(this.ingredients.slice());
    }

    addNewIngredients(ingredients: Ingredient[]) {
    //    this.ingredients = [];
        this.ingredients.push(...ingredients);
    }

    editIngredients(ingredientId: number) {
        this.ingredientEditing.next(ingredientId);
    }

    updateIngredients(index: number, ingredient: Ingredient) {
        this.ingredients[index] = ingredient;
        this.ingredientsUpdated.next(this.ingredients.slice());
    }

    deleteIngredients(ingredientId: number) {
        this.ingredients.splice(ingredientId, 1);
        this.ingredientsUpdated.next(this.ingredients.slice());
    }
}
