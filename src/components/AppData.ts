import { FormErrors, IOrder, IOrderForm, IProduct } from "../types";
import { Model } from "./base/Model";

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
    formErrors: FormErrors;
}

class AppData extends Model<IAppState> {
    catalog: IProduct[] = [];
    basket: string[] = [];
    preview: string | null = null;
    order: IOrder | null = null;
    loading: boolean = false;
    formErrors: FormErrors = {};
}