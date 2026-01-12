import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';
import { ApiResponse } from '../models/api-response.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  createOrder(order: Partial<Order>): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, order).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  updateOrderStatus(id: string, status: Order['status']): Observable<Order> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('Order Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}