import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pizza } from '../models/pizza.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private apiUrl = `${environment.apiUrl}/pizzas`;

  constructor(private http: HttpClient) { }

  getPizzas(): Observable<Pizza[]> {
    return this.http.get<ApiResponse<Pizza[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  getPizzaById(id: string): Observable<Pizza> {
    return this.http.get<ApiResponse<Pizza>>(`${this.apiUrl}/${id}`).pipe(
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

    console.error('Pizza Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
