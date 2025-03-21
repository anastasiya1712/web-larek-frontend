import { Component } from '../base/Component';
import { createElement, ensureElement, formatNumber } from '../../utils/utils';
import { EventEmitter } from '../base/Events';
import { Events } from '../../types';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLElement>(
			'.basket__button',
			this.container
		);

		this._button.addEventListener('click', () => {
			events.emit(Events.ORDER_OPEN);
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		items.length
			? this._list.replaceChildren(...items)
			: this._list.replaceChildren(
					createElement<HTMLParagraphElement>('p', {
						textContent: 'Корзина пуста',
					})
			  );
	}

	set total(total: number) {
		this.setText(this._total, formatNumber(total) + ' синапсов');
	}

	setButtonDisabled(state: boolean) {
		this.setDisabled(this._button, state);
	}
}
