import { Events, IPaymentPhoneAndEmailForm } from '../types';
import { IEvents } from './base/Events';
import { Form } from './common/Form';

export class Contacts extends Form<IPaymentPhoneAndEmailForm> {
	protected _button: HTMLButtonElement;
	protected _email: HTMLButtonElement;
	protected _phone: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._button = this.container.querySelector('button');
		this._email = this.container.querySelector('input[name="email"]');
		this._phone = this.container.querySelector('input[name="phone"]');

		[this._email, this._phone].forEach((input) =>
			input.addEventListener('input', this.toggleButtonState.bind(this))
		);

		container.addEventListener('submit', this.handleSubmit.bind(this));
	}

	set email(email: string) {
		this._email.value = email;
	}

	set phone(phone: string) {
		this._phone.value = phone;
	}

	private toggleButtonState(): void {
		this._button.disabled = !this.checkAvailabilityContacts();
	}

	private handleSubmit(e: Event): void {
		e.preventDefault();

		if (!this.checkEmail()) {
			this.errors = 'Заполните корректно email';
			return;
		}

		if (!this.checkPhone()) {
			this.errors = 'Заполните корректно номер телефона';
			return;
		}

		const data: IPaymentPhoneAndEmailForm = {
			email: this._email.value,
			phone: this._phone.value,
		};

		this.events.emit(Events.ORDER_SUBMIT, data);
	}

	private checkAvailabilityContacts() {
		return Boolean(this._phone.value.trim() && this._email.value.trim());
	}

	private checkPhone() {
		const phoneRegex = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
		return phoneRegex.test(this._phone.value);
	}

	private checkEmail() {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(this._email.value);
	}
}
