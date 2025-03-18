import { Events, FormErrors, IAppState, IOrder, IOrderForm, IProduct } from "../types";
import { Model } from "./base/Model";

export class AppData extends Model<IAppState> {
    catalog: IProduct[] = [];
    basket: string[] = [];
    preview: string | null = null;
    order: IOrder | null = null;
    loading: boolean = false;
    formErrors: FormErrors = {};

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges(Events.CATALOG_CHANGED, this.catalog);
    }
}
