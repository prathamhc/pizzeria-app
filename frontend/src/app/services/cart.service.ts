import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cart, CartItem } from '../models/cart.model';
import { ApiResponse } from '../models/api-response.model';  // ← CHANGED THIS LINE

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  get cart(): Cart {
    return this.cartSubject.value;
  }

  loadCart(): void {
    this.http.get<ApiResponse<Cart>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    ).subscribe({
      next: (cart) => {
        console.log('Cart loaded:', cart);
        this.cartSubject.next(cart);
      },
      error: (err) => console.error('Failed to load cart:', err)
    });
  }

  add(item: CartItem): Observable<Cart> {
    console.log('Adding to cart:', item);
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/add`, item).pipe(
      map(response => {
        console.log('Add response:', response);
        return response.data;
      }),
      tap(cart => {
        console.log('Cart updated:', cart);
        this.cartSubject.next(cart);
      }),
      catchError((error) => {
        console.error('Error adding to cart:', error);
        return this.handleError(error);
      })
    );
  }

  updateQuantity(pizzaId: string, qty: number): Observable<Cart> {
    return this.http.put<ApiResponse<Cart>>(`${this.apiUrl}/update`, {
      pizzaId,
      qty
    }).pipe(
      map(response => response.data),
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  increase(item: CartItem): Observable<Cart> {
    return this.updateQuantity(item.pizzaId, item.qty + 1);
  }

  decrease(item: CartItem): Observable<Cart> {
    return this.updateQuantity(item.pizzaId, item.qty - 1);
  }

  remove(pizzaId: string): Observable<Cart> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/remove/${pizzaId}`).pipe(
      map(response => response.data),
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  clear(): Observable<Cart> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/clear`).pipe(
      map(response => response.data),
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError)
    );
  }

  getItemCount(): number {
    return this.cart.items.reduce((count, item) => count + item.qty, 0);
  }

  isInCart(pizzaId: string): boolean {
    const inCart = this.cart.items.some(item => item.pizzaId === pizzaId);
    console.log(`Is ${pizzaId} in cart?`, inCart);
    return inCart;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('Cart Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}