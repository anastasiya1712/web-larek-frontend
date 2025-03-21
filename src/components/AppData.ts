import { Events, IAppState, IOrder, IProduct, PaymentMethod } from '../types';
import { Model } from './base/Model';

export class AppData extends Model<IAppState> {
	private _basket: string[] = [];
	private _catalog: IProduct[];
	private _order: IOrder = {
		phone: '',
		address: '',
		email: '',
		payment: PaymentMethod.ONLINE,
		items: [],
		total: 0,
	};

	get basket(): string[] {
		return this._basket;
	}

	set basket(value: string[]) {
		this._basket = value;
	}

	get products(): IProduct[] {
		return this._catalog;
	}

	set products(value: IProduct[]) {
		this._catalog = value;
	}

	get order(): IOrder {
		return this._order;
	}

	set order(value: IOrder) {
		this._order = value;
	}

	setProducts(products: IProduct[]) {
		this.products = products;
		this.emitChanges(Events.CATALOG_CHANGED, { catalog: this._catalog });
	}

	getAddedProducts(): IProduct[] {
		return this._catalog.filter((item) => this.basket.includes(item.id));
	}

	getTotal(): number {
		return this.getAddedProducts().reduce((sum, item) => sum + item.price, 0);
	}

	getCountOfItems(): number {
		return this.basket.length;
	}
}
