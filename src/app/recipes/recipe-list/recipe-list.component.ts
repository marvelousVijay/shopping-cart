import { Component, OnInit, OnDestroy } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  recipeSubscription: Subscription;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.recipeSubscription = this.recipeService.recipeChanged
    .subscribe((recipe: Recipe[]) => {
      this.recipes = recipe;
    });
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy() {
    this.recipeSubscription.unsubscribe();
  }

  onAddNewRecipe() {
    this.router.navigate(
      ['new'],
      {
        relativeTo: this.route,
        queryParamsHandling: 'preserve'
      }
    );
  }
}
