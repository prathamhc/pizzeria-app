import { CartItem } from './cart.model';

export interface Order {
    _id?: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    orderDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}