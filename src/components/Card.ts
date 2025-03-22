import { IProduct } from '../types';
import { CATEGORY_CLASS_MAP } from '../utils/constants';
import { bem, ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> extends IProduct {
	button: boolean;
	onClick: () => void;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = container.querySelector('.card__category');

		if (actions.onClick) {
			this._button
				? this._button.addEventListener('click', actions.onClick)
				: container.addEventListener('click', actions.onClick);
		}
	}

	set price(price: number | null) {
		if (price) {
			const value =
				price >= 10000 ? new Intl.NumberFormat('ru').format(price) : price;
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'бесценно');
			this.setDisabled(this._button, true);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		const className = CATEGORY_CLASS_MAP[value] ?? 'default';
		this._category.className = `card__category ${
			bem('card', 'category', className).name
		}`;
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(isAddOpiration: boolean) {
		isAddOpiration
			? this.setText(this._button, 'В корзину')
			: this.setText(this._button, 'Купить');
	}

	addButoonAction(actions?: ICardActions): void {
		this._button.addEventListener('click', actions.onClick);
	}
}
