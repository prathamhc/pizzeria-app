import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { IngredientItem } from 'src/app/models/ingredient.model';

@Component({
  selector: 'app-build-pizza',
  templateUrl: './build-pizza.component.html',
  styleUrls: ['./build-pizza.component.css']
})
export class BuildPizzaComponent implements OnInit {
  toppings: IngredientItem[] = [];
  selectedToppings: IngredientItem[] = [];
  basePrice = 200;
  loading = true;
  error = '';
  adding = false;

  constructor(
    private ingredientService: IngredientService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadToppings();
  }

  loadToppings(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => {
        this.toppings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading toppings:', err);
        this.error = 'Failed to load toppings';
        this.loading = false;
      }
    });
  }

  toggleTopping(topping: IngredientItem, checked: boolean): void {
    if (checked) {
      this.selectedToppings.push(topping);
    } else {
      this.selectedToppings = this.selectedToppings.filter(t => t.id !== topping.id);
    }
  }

  isSelected(topping: IngredientItem): boolean {
    return this.selectedToppings.some(t => t.id === topping.id);
  }

  getTotalPrice(): number {
    const toppingsTotal = this.selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return this.basePrice + toppingsTotal;
  }

  addCustomPizza(): void {
    if (this.selectedToppings.length === 0) {
      alert('Please select at least one topping');
      return;
    }

    this.adding = true;

    const customPizza = {
      pizzaId: `custom-${Date.now()}`,
      name: 'Custom Pizza',
      basePrice: this.basePrice,
      qty: 1,
      selectedToppings: this.selectedToppings.map(t => ({
        id: t.id,
        tname: t.tname,
        price: t.price
      }))
    };

    console.log('Adding custom pizza:', customPizza);

    this.cartService.add(customPizza).subscribe({
      next: () => {
        this.adding = false;
        alert('Custom pizza added to cart!');
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Error adding custom pizza:', err);
        this.adding = false;
        alert('Failed to add custom pizza: ' + err.message);
      }
    });
  }
}