import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  loading: boolean = false;
  error: string = '';

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  increaseQty(item: CartItem): void {
    this.cartService.increase(item).subscribe({
      error: (err) => {
        console.error('Error increasing quantity:', err);
        this.error = 'Failed to update quantity';
      }
    });
  }

  decreaseQty(item: CartItem): void {
    this.cartService.decrease(item).subscribe({
      error: (err) => {
        console.error('Error decreasing quantity:', err);
        this.error = 'Failed to update quantity';
      }
    });
  }

  removeItem(pizzaId: string): void {
    if (confirm('Remove this item from cart?')) {
      this.cartService.remove(pizzaId).subscribe({
        error: (err) => {
          console.error('Error removing item:', err);
          this.error = 'Failed to remove item';
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Clear entire cart?')) {
      this.cartService.clear().subscribe({
        next: () => {
          console.log('Cart cleared');
        },
        error: (err) => {
          console.error('Error clearing cart:', err);
          this.error = 'Failed to clear cart';
        }
      });
    }
  }

  checkout(): void {
    if (this.cartService.cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    this.loading = true;
    this.error = '';

    this.orderService.createOrder({
      items: this.cartService.cart.items,
      total: this.cartService.cart.total
    }).subscribe({
      next: (order) => {
        alert(`Order placed successfully! Order ID: ${order._id}`);
        this.cartService.clear().subscribe(() => {
          this.router.navigate(['/']);
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error placing order:', err);
        this.error = 'Failed to place order. Please try again.';
        this.loading = false;
      }
    });
  }
}