import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { HeaderService } from 'src/app/header/header.service';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;
  recipeId: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.recipeId = +params.id;
          this.recipe = this.recipeService.getSelectedRecipe(+params.id);
        }
      );
  }

  onEditRecipe() {
    this.router.navigate(
      ['edit'],
      {
        relativeTo: this.route,
        queryParamsHandling: 'preserve'
      }
    );
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.recipeId);
    this.router.navigate(['/recipes']);
  }

  toShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    // this.headerService.changeNavMenu('shopping-list');
    this.router.navigate(['/shopping-list']);
  }

}
