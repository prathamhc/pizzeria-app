import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private url = "http://localhost:5000/ingredients"

  constructor(private http: HttpClient) { }

  getIngredients(){
    return this.http.get<any[]>(this.url);
  }

}
