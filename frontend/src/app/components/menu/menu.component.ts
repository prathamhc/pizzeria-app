import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { PizzaService } from 'src/app/services/pizza.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  pizzas: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private pizzaService: PizzaService,
    private cart: CartService
  ) { }

  ngOnInit(): void {
    this.cart.loadCart();
    this.pizzaService.getPizza().subscribe(data => this.pizzas = data);
  }



  isInCart(pizza: any): boolean {
    if (!this.cart.cart || !this.cart.cart.items) return false;

    return this.cart.cart.items.some(
      (item: any) => item.pizzaId === pizza.pizzaId
    );
  }


  removeFromCart(pizza: any): void {
    this.cart.decrease({
      pizzaId: pizza.pizzaId,
      qty: 1
    });
  }



  loadPizzas(): void {
    this.pizzaService.getPizza().subscribe({
      next: (data: any[]) => {
        this.pizzas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load menu';
        this.loading = false;
      }
    });
  }

  addToCart(pizza: any): void {
    this.cart.add({
      pizzaId: pizza.pizzaId,
      name: pizza.name,
      basePrice: Number(pizza.price)

      
    });
    console.log('Cart items:', this.cart.cart.items);
console.log('Pizza ID:', pizza.pizzaId);

  }


}
