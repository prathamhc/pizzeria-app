import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IngredientItem } from '../models/ingredient.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = `${environment.apiUrl}/ingredients`;

  constructor(private http: HttpClient) { }

  getIngredients(): Observable<IngredientItem[]> {
    return this.http.get<ApiResponse<IngredientItem[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  getIngredientById(id: number): Observable<IngredientItem> {
    return this.http.get<ApiResponse<IngredientItem>>(`${this.apiUrl}/${id}`).pipe(
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

    console.error('Ingredient Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}