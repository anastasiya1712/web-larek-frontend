import { EventEmitter } from './components/base/Events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Card } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Success } from './components/common/Success';
import { WebLarekAPI } from './components/WebLarekAPI';
import { Page } from './components/Page';
import { AppData } from './components/AppData';
import {
	Events,
	IPaymentAndAddressForm,
	IPaymentPhoneAndEmailForm,
	IProduct,
	PaymentMethod,
} from './types';
import { Contacts } from './components/Contacts';
import { BasketCard } from './components/BasketCard';

const Templates = {
	CATALOG: ensureElement<HTMLTemplateElement>('#card-catalog'),
	PREVIEW: ensureElement<HTMLTemplateElement>('#card-preview'),
	CONTACTS: ensureElement<HTMLTemplateElement>('#contacts'),
	SUCCESS: ensureElement<HTMLTemplateElement>('#success'),
	CARDBASKET: ensureElement<HTMLTemplateElement>('#card-basket'),
	ORDER: ensureElement<HTMLTemplateElement>('#order'),
	BASKET: ensureElement<HTMLTemplateElement>('#basket'),
};

const api = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppData({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(Templates.BASKET), events);
const order = new Order(cloneTemplate(Templates.ORDER), events);
const contacts = new Contacts(cloneTemplate(Templates.CONTACTS), events);

api.getProducts().then(appData.setProducts.bind(appData)).catch(alert);

events.on(Events.CATALOG_CHANGED, renderCatalog);
events.on(Events.CATALOG_SHOW, showProductPreview);
events.on(Events.CARD_ADD, handleCardAdd);
events.on(Events.CARD_DELETE, handleCardDelete);
events.on(Events.BASKET_OPEN, openBasket);
events.on(Events.ORDER_OPEN, openOrder);
events.on(Events.ORDER_SUBMIT, submitOrder);
events.on(Events.CONTACTS_OPEN, openContacts);
events.on(Events.MODAL_OPEN, () => (page.locked = true));
events.on(Events.MODAL_CLOSE, () => (page.locked = false));

function renderCatalog(): void {
	page.catalog = appData.products.map((product) =>
		new Card(cloneTemplate(Templates.CATALOG), {
			onClick: () => {
				events.emit(Events.CATALOG_SHOW, product);
			},
		}).render(product)
	);
}

function showProductPreview(product: IProduct): void {
	const card = new Card(cloneTemplate(Templates.PREVIEW), {
		onClick: () => {
			card.button = true;
			card.addButoonAction({
				onClick: () => {
					events.emit(Events.BASKET_OPEN, product);
				},
			});
			if (!appData.basket.includes(product.id)) {
				events.emit(Events.CARD_ADD, product);
			}
		},
	});

	appData.basket.includes(product.id)
		? card.addButoonAction({
				onClick: () => events.emit(Events.BASKET_OPEN, product),
		  })
		: (card.button = false);

	modal.render({
		content: card.render(product),
	});
	events.emit(Events.MODAL_OPEN, product);
}

function handleCardAdd(product: IProduct): void {
	appData.basket.push(product.id);
	appData.order.items.push(product.id);
	page.counter = appData.getCountOfItems();
}

function handleCardDelete(product: IProduct): void {
	appData.basket = appData.basket.filter(
		(basketItem) => basketItem !== product.id
	);
	appData.order.items = appData.order.items.filter(
		(orderItem) => orderItem !== product.id
	);
	events.emit(Events.BASKET_OPEN);
	page.counter = appData.getCountOfItems();
}

function openBasket(): void {
	modal.render({
		content: createElement<HTMLElement>('div', {}, basket.render()),
	});
	basket.total = appData.getTotal();
	basket.items = appData.getAddedProducts().map((product, i) => {
		const cardBasket = new BasketCard(cloneTemplate(Templates.CARDBASKET), {
			onClick: () => events.emit(Events.CARD_DELETE, product),
		});
		cardBasket.index = (i + 1).toString();
		return cardBasket.render({
			title: product.title,
			price: product.price,
		});
	});

	appData.getCountOfItems() == 0
		? basket.setButtonDisabled(true)
		: basket.setButtonDisabled(false);
}

function openOrder(): void {
	modal.render({
		content: order.render({
			valid: false,
			errors: [],
			address: '',
		}),
	});
}

function openContacts(data: IPaymentAndAddressForm): void {
	Object.assign(appData.order, {
		address: data.address,
		payment: data.paymentType,
	});
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
			email: '',
			phone: '',
		}),
	});
}

function submitOrder(data: IPaymentPhoneAndEmailForm): void {
	Object.assign(appData.order, { ...data, total: appData.getTotal() });

	api.order(appData.order).then(() => {
		appData.basket = [];
		appData.order.items = [];
		page.counter = 0;

		const success = new Success(cloneTemplate(Templates.SUCCESS), {
			onClick: () => {
				modal.close();
				events.emit(Events.CATALOG_CHANGED);
			},
		});

		modal.render({
			content: success.render({ total: appData.order.total }),
		});

		appData.order.total = 0;
	});
}
