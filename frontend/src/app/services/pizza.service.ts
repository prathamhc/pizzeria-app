import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  private url = 'http://localhost:5000/pizzas';

  constructor(private http: HttpClient) {}

    getPizza(){
      return this.http.get<any[]>(this.url);
    }
}
