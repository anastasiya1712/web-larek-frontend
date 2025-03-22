import { Events, IFormState, IPaymentAndAddressForm, PaymentMethod } from '../types';
import { ensureAllElements, ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';
import { Form } from './common/Form';

export class Order extends Form<IPaymentAndAddressForm> {
	protected _alts: HTMLButtonElement[];
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _next: HTMLButtonElement;
	protected _address: HTMLInputElement;

	private isChoosen = false;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._alts = ensureAllElements<HTMLButtonElement>('.button_alt', container);
		this._next = this.container.querySelector('button.order__button');
		this._card = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			container
		);
		this._cash = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			container
		);
		this._address = this.container.querySelector('input[name="address"]');

		this._alts.forEach((tab) => {
			tab.addEventListener('click', () => {
				this.isChoosen = true;
				this.checkAddress()
					? this._next.removeAttribute('disabled')
					: this._next.setAttribute('disabled', '');
				if (this._card == tab) {
					this._card.classList.add('button_alt-active');
					this._cash.classList.remove('button_alt-active');
				} else {
					this._cash.classList.add('button_alt-active');
					this._card.classList.remove('button_alt-active');
				}
			});
		});

		this._address.addEventListener('input', () => {
			this.checkAddress()
				? this._next.removeAttribute('disabled')
				: this._next.setAttribute('disabled', '');
		});

		this._next.addEventListener('click', () => {
			const order: IPaymentAndAddressForm = {
				address: this._address.value,
				paymentType: this._card.classList.contains('button_alt-active')
					? PaymentMethod.ONLINE
					: PaymentMethod.CARD,
			};
			events.emit(Events.CONTACTS_OPEN, order);
			this.clearForm();
		});
	}

	set address(address: string) {
		this._address.value = address;
	}
	
	private clearForm() {
		this._card.classList.remove('button_alt-active');
		this._cash.classList.remove('button_alt-active');
		this._next.setAttribute('disabled', '');
	}

	checkAddress() {
		return this._address.value != '' && this.isChoosen;
	}

	render(state: IPaymentAndAddressForm & IFormState) {
		this.clearForm();
		return super.render(state);
	}
}
