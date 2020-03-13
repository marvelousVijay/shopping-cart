import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeId: number;
  editMode = false;
  recipeName: string;

  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService) { }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.recipeId = +params.id;
        if (params.id !== undefined) {
          this.editMode = true;
          // this.recipe = this.recipeService.getSelectedRecipe(this.recipeId);
        }
        this.initRecipeForm();
      }
    );
  }

  initRecipeForm() {
    let recipeName = '';
    let imagePath = '';
    let description = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode === true) {
      const recipe = this.recipeService.getSelectedRecipe(this.recipeId);
      recipeName = recipe.name;
      imagePath = recipe.imagePath;
      description = recipe.description;
      if (recipe.ingredients) {
        recipe.ingredients.forEach((ingredient) => {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              quantity: new FormControl(ingredient.quantity, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        });
      }
      this.recipeName = recipeName;
    }

    this.recipeForm = new FormGroup({
      recipeData: new FormGroup({
        name: new FormControl(recipeName, Validators.required),
        imagePath: new FormControl(imagePath, Validators.required),
        description: new FormControl(description, Validators.required),
        ingredients: recipeIngredients
      })
    });
  }

  onRecipeFormSubmit() {
    console.log('recipe form: ', this.recipeForm);

    /* Use the below individual value assignment in case,
    the form's -> 'structure' naming convention does not match with the model's 'type'
    (In this scenario, recipeForm's -> 'controls/keys' & Recipe model's -> 'keys/type' pair's naming) */

    // const newRecipe = new Recipe(
    //   this.recipeForm.value['recipeData.recipeName'],
    //   this.recipeForm.value['recipeData.imagePath'],
    //   this.recipeForm.value['recipeData.description'],
    //   this.recipeForm.value['recipeData.ingredients']
    // );
    if (this.editMode) {
      this.recipeService.updateRecipe(this.recipeId, this.recipeForm.get('recipeData').value);
    } else {
      this.recipeService.addNewRecipe(this.recipeForm.get('recipeData').value);
    }
    this.navigateToRecipesDetail();
  }

  get ingredientsControlGroup() {
    return (this.recipeForm.get('recipeData.ingredients') as FormArray).controls;
  }

  onAddNewIngredient() {
    (this.recipeForm.get('recipeData.ingredients') as FormArray).push(new FormGroup({
      name: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onCancelRecipeForm() {
    this.navigateToRecipesDetail();
  }

  navigateToRecipesDetail() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('recipeData.ingredients') as FormArray).removeAt(index);
  }

  onDeleteAllIngredients() {
    (this.recipeForm.get('recipeData.ingredients') as FormArray).clear();
  }
}
