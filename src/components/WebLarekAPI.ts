import { Api, ApiListResponse } from './base/Api';
import { IWebLarekAPI, IOrder, IOrderResponse, IProduct } from '../types';

export class WebLarekAPI extends Api implements IWebLarekAPI {
	constructor(private cdn: string, baseURL: string, options?: RequestInit) {
		super(baseURL, options);
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.withCdn(item.image),
			}))
		);
	}

	getProductById(id: number): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.withCdn(item.image),
		}));
	}

	order(order: IOrder): Promise<IOrderResponse> {
		return this.post('/order', order).then((data: IOrderResponse) => data);
	}

	private withCdn(image: string): string {
		return `${this.cdn}${image}`;
	}
}
