import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { IngredientService } from 'src/app/services/ingredient.service';

@Component({
  selector: 'app-build-pizza',
  templateUrl: './build-pizza.component.html',
  styleUrls: ['./build-pizza.component.css']
})
export class BuildPizzaComponent {

  toppings : any[] = [];
  selected: any[] = [];
  total = 0;

  constructor(private ingredientService: IngredientService, private cart : CartService){}

  ngOnInit(){
    this.ingredientService.getIngredients().subscribe(data=>{
      this.toppings = data
    })
  }

  toggle(topping:any, checked:boolean):void{
    if(checked){
      this.selected.push(topping);
      this.total += topping.price;
    }
    else{
      this.selected = this.selected.filter(t => t !== topping);
      this.total -= topping.price;
    }
  }
}
