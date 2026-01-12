import { Topping } from './pizza.model';

export interface CartItem {
    pizzaId: string;
    name: string;
    basePrice: number;
    qty: number;
    selectedToppings?: Topping[];
    itemTotal?: number;
}

export interface Cart {
    _id?: string;
    items: CartItem[];
    total: number;
}