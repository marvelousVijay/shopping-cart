import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredients.model';
import { ShoppingService } from '../shopping-list/shopping.service';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    recipeChanged = new Subject<Recipe[]>();
    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Mousse cake',
    //         'https://images-gmi-pmc.edge-generalmills.com/1e24b5e7-e3e3-43ce-b737-a2215397f006.jpg',
    //         'Buttery mousse cake with chocolate crisps!!',
    //         [
    //             new Ingredient('vanilla essense', 1),
    //             new Ingredient('chocolates', 2),
    //             new Ingredient('choco chips', 20)
    //         ]),
    //     new Recipe(
    //         'Mattar panner',
    //         'https://www.maggi.in/sites/default/files/2019-09/matar-paneer-desktop-banner.jpg',
    //         'Spicy & yummy matter panner!!',
    //         [
    //             new Ingredient('green peas', 20),
    //             new Ingredient('panner cubes', 10)
    //         ])
    //   ];

    private recipes: Recipe[] = [];

    constructor(private shoppingService: ShoppingService) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getSelectedRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients) {
        this.shoppingService.addNewIngredients(ingredients);
    }

    addNewRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(recipeIndex: number, updatedRecipe: Recipe) {
        this.recipes[recipeIndex] = updatedRecipe;
        this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(recipeIndex: number) {
        this.recipes.splice(recipeIndex, 1);
        this.recipeChanged.next(this.recipes.slice());
    }

}
