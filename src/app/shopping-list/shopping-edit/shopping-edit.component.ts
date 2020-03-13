import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredients.model';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  ingredientsForm: FormGroup;
  ingredientEditSubscription: Subscription;
  editMode = false;
  editItemIndex: number;


  constructor(private shoppingService: ShoppingService) { }

  ngOnInit() {
    this.onIngredientdFormCreate();
    this.onIngredientsFormEdit();
  }

  ngOnDestroy() {
    this.ingredientEditSubscription.unsubscribe();
  }

  onAddIngredient(newIngredient: Ingredient) {
    newIngredient.quantity = newIngredient.quantity === null ? 10 : newIngredient.quantity;
    this.shoppingService.addIngredient(newIngredient);
  }

  onUpdateIngredient(ingredient: Ingredient) {
    this.shoppingService.updateIngredients(this.editItemIndex, ingredient);
  }

  onIngredientdFormCreate() {
    this.ingredientsForm = new FormGroup({
      ingredientsData: new FormGroup({
        name: new FormControl('Strawberries', [Validators.required]),
        quantity: new FormControl(10)
      })
    });
  }

  onIngredientsFormEdit() {
    this.ingredientEditSubscription = this.shoppingService.ingredientEditing
    .subscribe((ingredientId: number) => {
      this.editMode = true;
      this.editItemIndex = ingredientId;
      const ingredient = this.shoppingService.getIngredientById(ingredientId);
      this.ingredientsForm.setValue({
        ingredientsData: {
          name: ingredient.name,
          quantity: ingredient.quantity
        }
      });
    });
  }

  onIngredientsFormSubmit() {
    const ingredient = {
      name: this.ingredientsForm.get('ingredientsData.name').value,
      quantity: this.ingredientsForm.get('ingredientsData.quantity').value
    };
    if (this.editMode) {
      this.onUpdateIngredient(ingredient);
    } else {
      this.onAddIngredient(ingredient);
    }
    this.clearIngredientsForm();
    console.log('Ingredients form: ', this.ingredientsForm, ingredient);
  }

  onIngredientsFormDelete() {
    this.shoppingService.deleteIngredients(this.editItemIndex);
    this.clearIngredientsForm();
  }

  onIngredientsFormClear() {
    this.clearIngredientsForm();
  }

  clearIngredientsForm() {
    this.editMode = false;
    this.ingredientsForm.reset();
  }
}
