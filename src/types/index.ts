export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export type PaymentMethod = 'Онлайн'| 'При получении';

export interface IOrderForm {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IOrderForm {
    total: number;
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
}