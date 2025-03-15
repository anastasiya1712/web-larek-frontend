import { FormErrors, IAppState, IOrder, IOrderForm, IProduct } from "../types";
import { Model } from "./base/Model";

class AppData extends Model<IAppState> {
    catalog: IProduct[] = [];
    basket: string[] = [];
    preview: string | null = null;
    order: IOrder | null = null;
    loading: boolean = false;
    formErrors: FormErrors = {};
}
