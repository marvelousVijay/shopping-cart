import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    recipeUrl = 'https://recipe-shopping-course-project.firebaseio.com/recipes.json';

    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

    fetchRecipes() {
        return this.http
        .get<Recipe[]>(this.recipeUrl)
        .pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                });
            }),
            tap(
                recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }

    storeRecipes() {
        const recipes: Recipe[] = this.recipeService.getRecipes();
        this.http.put<Recipe[]>(this.recipeUrl, recipes)
        .subscribe(response => {
            console.log('recipes: ', response);
        });
    }

    storeRecipes1() {
        const recipes: Recipe[] = this.recipeService.getRecipes();
        this.authService.user.pipe(take(1), exhaustMap(user => {
           return this.http
            .put<Recipe[]>(
                this.recipeUrl,  
                recipes,
                {
                    params: new HttpParams().set('auth', user.token)
                })
            }), 
            tap(recipes => {
                console.log('recipes: ', recipes);
            })
        ).subscribe();
    }
}
