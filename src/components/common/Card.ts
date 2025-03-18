import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected description: HTMLElement;
	protected image: HTMLImageElement;
	protected title: HTMLElement;
	protected category: HTMLElement;
	protected price: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.description = ensureElement<HTMLElement>('card__text', container);
		this.image = ensureElement<HTMLImageElement>('card__image', container);
		this.title = ensureElement<HTMLElement>('card__title', container);
		this.category = ensureElement<HTMLElement>('card__category', container);
		this.price = ensureElement<HTMLElement>('card__price', container);
		this.button = ensureElement<HTMLButtonElement>('card__button', container);

		if (actions?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
}
