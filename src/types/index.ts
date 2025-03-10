export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export type PaymentMethod = 'online'| 'card';

export interface IOrderForm {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IOrderForm {
    total: number;
    items: IBasketItem[]
}


export interface IOrderResponse {
    id: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export enum Events {
    CATALOG_CHANGED = "catalog:changed",
    BASKET_UPDATE = "basket:update",
    BASKET_CLEARED = "basket:cleared",
    BASKET_OPEN = "basket:open",
    BASKET_CLOSE = "basket:close",
    ORDER_CHANGED = "order:changed",
    ORDER_SUBMIT = "order:submit",
    MODAL_OPEN = "modal:open",
    MODAL_CLOSE = "modal:close",
    FORM_ERRORS = "formErrors:changed"
}
