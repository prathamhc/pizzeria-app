export interface Ingredient {
    id: number;
    iname: string;
}

export interface Topping {
    id: number;
    tname: string;
    price: number;
}

export interface Pizza {
    _id?: string;
    pizzaId: string;
    name: string;
    type: 'veg' | 'nonveg';
    price: number;
    image: string;
    description: string;
    ingredients: Ingredient[];
    topping: Topping[];
}