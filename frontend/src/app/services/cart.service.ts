import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CartService {

  private url = 'http://localhost:5000/cart';
  cart: any = { items: [], total: 0 };

  constructor(private http: HttpClient) {}

  loadCart() {
    return this.http.get<any>(this.url).subscribe(c => this.cart = c);
  }

  add(item: any) {
    return this.http.post<any>(`${this.url}/add`, item)
      .subscribe(c => this.cart = c);
  }

  increase(item: any) {
    return this.http.put<any>(`${this.url}/update`, {
      pizzaId: item.pizzaId,
      qty: item.qty + 1
    }).subscribe(c => this.cart = c);
  }

  decrease(item: any) {
    return this.http.put<any>(`${this.url}/update`, {
      pizzaId: item.pizzaId,
      qty: item.qty - 1
    }).subscribe(c => this.cart = c);
  }

  clear() {
    return this.http.delete(`${this.url}/clear`)
      .subscribe(() => this.cart = { items: [], total: 0 });
  }
}
