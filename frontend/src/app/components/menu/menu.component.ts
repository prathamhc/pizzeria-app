import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { PizzaService } from 'src/app/services/pizza.service';
import { Pizza } from 'src/app/models/pizza.model';
import { Cart } from 'src/app/models/cart.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  pizzas: Pizza[] = [];
  filteredPizzas: Pizza[] = [];
  loading: boolean = true;
  error: string = '';

  currentCart: Cart = { items: [], total: 0 };
  private destroy$ = new Subject<void>();

  constructor(
    private pizzaService: PizzaService,
    public cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadPizzas();

    this.cartService.cart$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (cart) => {
        console.log('Menu component - Cart updated:', cart);
        this.currentCart = cart;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPizzas(): void {
    this.loading = true;
    this.error = '';

    this.pizzaService.getPizzas().subscribe({
      next: (data: Pizza[]) => {
        console.log('Pizzas loaded:', data);
        this.pizzas = data;
        this.filteredPizzas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pizzas:', err);
        this.error = 'Failed to load menu. Please try again.';
        this.loading = false;
      }
    });
  }


  isInCart(pizza: Pizza): boolean {
    const pizzaId = pizza.pizzaId || pizza._id || '';
    return this.currentCart.items.some(item => item.pizzaId === pizzaId);
  }

  addToCart(pizza: Pizza): void {
    const pizzaId = pizza.pizzaId || pizza._id || '';
    console.log('Adding pizza to cart:', pizza.name, 'ID:', pizzaId);

    if (!pizzaId) {
      alert('Error: Pizza ID is missing');
      return;
    }

    this.cartService.add({
      pizzaId: pizzaId,
      name: pizza.name,
      basePrice: pizza.price,
      qty: 1
    }).subscribe({
      next: (updatedCart) => {
        console.log('Successfully added to cart');
        this.currentCart = updatedCart;
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        alert('Failed to add item to cart: ' + err.message);
      }
    });
  }

  removeFromCart(pizza: Pizza): void {
    const pizzaId = pizza.pizzaId || pizza._id || '';

    this.cartService.remove(pizzaId).subscribe({
      next: (updatedCart) => {
        console.log('Successfully removed from cart');
        this.currentCart = updatedCart;
      },
      error: (err) => {
        console.error('Error removing from cart:', err);
        alert('Failed to remove item from cart: ' + err.message);
      }
    });
  }
}