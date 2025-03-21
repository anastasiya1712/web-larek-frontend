import { ensureElement } from '../utils/utils';
import { Card, ICardActions } from './Card';

export interface IBasketCard {
	index: number;
}

export class BasketCard extends Card<IBasketCard> {
	protected _icon: HTMLElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._icon = ensureElement<HTMLElement>(`.basket__item-delete`, container);
	}

	set index(index: string) {
		this.setText(this._index, index);
	}
}
