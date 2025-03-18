import { EventEmitter } from './components/base/Events';
import { WebLarekAPI } from './components/WebLarekAPI';
import { AppData } from './components/AppData';
import './scss/styles.scss';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { Events } from './types';
import { Card } from './components/common/Card';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppData({}, events);

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

events.on(Events.CATALOG_CHANGED, () => {
	appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(catalogTemplate), {
			onClick: () => events.emit(Events.CARD_SELECT, item),
		});
		return card.render(item);
	});
});

api
	.getProducts()
	.then((data) => appData.setCatalog(data))
	.catch((error) => {
		console.error(error);
	});
