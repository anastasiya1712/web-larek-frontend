import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResponse, IProduct, IWebLarekAPI} from "../types";

export class WebLarekAPI extends Api implements IWebLarekAPI {
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item
            }))
        );
    }

    getProductById(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item
            })
        );
    }

    order(order: IOrder): Promise<IOrderResponse> {
        return this.post('/order', order).then(
            (data: IOrderResponse) => data
        );
    }
}
