import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  constructor(private cart: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cart.loadCart();
  }

  checkout(): void {
    if (this.cart.cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    this.http.post('http://localhost:5000/orders', {
      items: this.cart.cart.items,
      total: this.cart.cart.total
    }).subscribe(() => {
      alert('Order placed');
      this.cart.clear();
    });
  }

}
