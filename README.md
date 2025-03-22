# Проектная работа "Веб-ларек" - интернет-магазин с товарами для веб-разработчиков

## Описание проекта
"Веб-ларек" - это интернет-магазин с товарами для веб-разработчиков. В проекте реализован каталог товаров, корзина и оформление заказа. Пользователь может выбирать товары, добавлять их в корзину и совершать покупку, указав способ оплаты, email, номер телефона и адрес доставки.

Проект реализован на TypeScript и представляет собой SPA (Single Page Application), взаимодействующее с API для получения данных о товарах и оформления заказов. В интерфейсе присутствуют модальные окна для карточки товара, корзины и оформления заказа.

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды
```shell
npm install
npm run start
```
или
```shell
yarn
yarn start
```
## Сборка
```shell
npm run build
```
или
```shell
yarn build
```
Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Архитектура проекта (MVP)
Проект реализует паттерн MVP, который разделяет приложение на три части: Model, View, Presenter.

MVP выбран для удобства тестирования и расширения проекта. Он помогает переиспользовать компоненты, поскольку классы слоя View и Model не связаны друг с другом напрямую, а работают через Presenter. Это облегчает поддержку и модификацию проекта.

Взаимодействие между компонентами происходит через механизм событий (EventEmitter). Это позволяет View и Model общаться без жестких связей.

# Model (Модель)
Модель отвечает за работу с данными, хранение и предоставление методов для их изменения. В проекте модель представлена классом `Model<T>`, который:

- является базовым классом для класса `AppData`

# View (Представление)
View отвечает за отображение интерфейса и обновление данных из модели. Классы представления в проекте:

- `Component<T>` — базовый класс для всех компонентов
- `Modal` —  управление модальными окнами
- `Basket` — отображение корзины
- `Form` — форма заказа
- `Page` — главная страница приложения
- `Success`, `Card`, `Order`, `Contacts` — классы для отдельных частей приложения

# Presenter (Презентер)
Презентер связывает модель и представление, управляет логикой приложения. В проекте роль презентера выполняет index.ts, который:

- инициализирует приложение
- подписывается на события
- обрабатывает действия пользователя

# Базовые классы

## class `EventEmitter`
Брокер событий, обеспечивает работу событий, его методы позволяют устанавливать и снимать обработчики на определеныые события, вызывать обработчиков при возникновении события.


Свойства:
```
_events: Map<EventName, Set<Subscriber>>; // список событий и их обработчики
```

Конструктор:
```
constructor() // конструктор инициализирует пустым списком new Map<EventName, Set<Subscriber>>()
```

Методы:
```
on(eventName: EventName, callback: (event: T) => void) // подписка на событие
off(eventName: EventName, callback: Subscriber) // отписка от события
emit(eventName: string, data?: T) // уведомление подписчиков о наступлении события
onAll(callback: (event: EmitterEvent) => void) // подписка на все события
offAll() // сброс всех подписчиков
trigger(eventName: string, context?: Partial<T>) // создает коллбек триггер, генерация события с заданными аргументами
```

## abstract class `Component<T>`
Абстрактный класс, от которого наследуются все компоненты слоя View.
Дженерик принимает тип, описывающий данные, которые будут передаваться в метод `render` для отображения этих данных в дочернем компоненте через сеттеры.

Свойства:
```
container: HTMLElement // Корневой DOM-элемент
```

Конструктор:
```
protected constructor(protected readonly container: HTMLElement) // принимает параметр HTMLElement. Конструктор имеет уровень защиты protected, это значит, что он может быть вызван только дочерними элементами
```

Методы:
```
toggleClass(element: HTMLElement, className: string, force?: boolean) // переключает класс в element
protected setText(element: HTMLElement, value: unknown) // устанавливает текстовое содержимое элемента
setDisabled(element: HTMLElement, state: boolean) // меняет статус блокировки
protected setHidden(element: HTMLElement) // скрывает элемент
protected setVisible(element: HTMLElement) // показывает элемент
protected setImage(element: HTMLImageElement, src: string, alt?: string) // устанавливает src и alt для element
render(data?: Partial<T>): HTMLElement // возвращает корневой DOM-элемент 
```

## abstract class `Model<T>`
Абстрактный класс, от которого наследуются все компоненты слоя Model. 
Дженерик принимает тип, описывающий начальные данные, они записываются в экземпляр модели.

Свойства:
```
events: IEvents // механизм управления событиями
```

Конструктор:
```
constructor(data Partial<T>, protected events: IEvents) // данные из data копируются в экземпляр класса, events инициализирует механизм управления событиями
```

Методы:
```
emitChanges(event: string, payload?: object) // генерирует событие с указанным именем и дополнительными данными, сообщает подписчикам, что модель поменялась.
```

Функция `isModel`
Проверяет, является ли объект экземпляром класса Model.

## class `Api`
Базовый класс для взаимодействия с API.

Свойства:
```
readonly baseUrl: string // базовый URL для API
protected options: RequestInit; // настройки для запросов к API
```

Конструктор:
```
constructor(baseUrl: string, options: RequestInit = {}) // инициализация своств baseUrl и options, по умолчанию определяет для options заголовок 'Content-Type': 'application/json'
```

Методы:
```
protected handleResponse(response: Response): Promise<object> // обрабатывает ответ API
get(uri: string) // get-запрос к API
post(uri: string, data: object, method: ApiPostMethods = 'POST') // отправляет к API запрос с data в качестве body параметра запроса
```

# Основные компоненты

## class `WebLarekAPI`
Класс для работы с API. Наследуется от класа Api

Свойства:
```
baseUrl: string // базовый url сервера
options: RequestInit // options запроса
```
Конструктор:
```
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```

Методы:
```
getProducts() // получение всего списка товаров с сервера
getProductsById(id: string) // получение товара по id с сервера
order(order: IOrder) // отправляет запрос на сервер с информацией о заказе и получает ответ
```

## class `AppData`
Класс `AppData` наследник базового класса `Model<T>`, отвечает за хранение и управление данными, необходимыми для функционирования приложения. Он обрабатывает данные каталога, корзины, оформления заказа и управляет состоянием загрузки.

Свойства:
```
basket: string[] - массив идентификаторов товаров, добавленных в корзину
products: IProduct[] - массив товаров
order: IOrder - объект с данными заказа
```

Конструктор:
```
constructor(events: IEvents); // принимает экземпляр обработчика событий
```

Методы: 
```
setProducts(products: IProduct[]): void - устанавливает каталог товаров и генерирует событие
getAddedProducts(): IProduct[] - возвращает массив товаров, добавленных в корзину, на основе идентификаторов из basket
getTotal(): number - рассчитывает и возвращает общую стоимость товаров в корзине
getCountOfItems(): number - возвращает количество товаров в корзине
```

## class `Modal`
Класс, является наследником класса `Component`. Предоставляет методы для создания и работы с модальным окном.

Свойства:
```
protected closeButton: HTMLButtonElement // элемент кнопки для закрытия модального окна
protected content: HTMLElement // контент модального окна
```

Конструктор:
```
constructor(container: HTMLElement, protected events: IEvents)
```

Методы:
```
open() // открывает модальное окно
close() // закрывает модальное окно
render(data: IModelData) // возращает DOM-элемент модального окна
```

## class `Basket`
Класс, является наследником класса `Component`. Предостевляет методы для добавления элементов в корзину.

Свойства:
```   
protected list: HTMLElement // DOM-элемент списка товаров
protected total: HTMLElement // DOM-элемент количества товаров
protected button: HTMLElement // DOM-элемент кнопки совершения заказа
```

Конструктор:
```
constructor(container: HTMLElement, protected events: EventEmitter)
```

Методы:
```    
set items(items: HTMLElement[]) // добавление элементов в корзину
set total(total: number) // устанавливает общую стоимость оформления в корзине
setButtonDisabled(state: boolean) // меняет состояние кнопки
```

## class `Form`
Класс, наследуемый от `Component`, представляет форму ввода данных. Позволяет управлять состоянием формы, валидацией и отправкой данных.


Свойства:
```
protected _submit: HTMLButtonElement // кнопка отправки формы
protected _errors: HTMLElement // элемент для отображения ошибок
```

Конструктор:
```    
constructor(container: HTMLFormElement, protected events: IEvents)
```

Методы:
```
set errors(value: string) // устанавливает текст ошибок в форме
render(state: Partial<T> & IFormState): HTMLElement // обновляет состояние формы и возвращает ее DOM-элемент
```

## class `Page`
Класс, наследуемый от `Component`, представляет страницу и управляет ее отрисовкой.

Свойства:
```
protected _counter: HTMLElement; // DOM-элемент счётчика товаров в корзине
protected _catalog: HTMLElement; // DOM-элемент списка товаров
protected _wrapper: HTMLElement; // DOM-элемент обертки корзины
protected _basket: HTMLElement; // DOM-элемент корзины

protected header: HTMLElement // DOM-элемент шапки страницы
protected content: HTMLElement // DOM-элемент контента страницы
```

Конструктор:
```
constructor(container: HTMLElement, protected events: IEvents)
```

Методы:
```    
set counter(value: number) // установить значение счетчика
set catalog(items: HTMLElement[]) // установить список товаров
set locked(value: boolean) // установить блокировку обертки
render(data?: Partial<T>): HTMLElement // отрисовывает содержимое страницы
```

## class `Success`
Класс, наследуемый от `Component`, представляет экран успешного завершения заказа или действия.

Свойства:
```
protected _close: HTMLElement // кнопка закрытия
protected _total: HTMLElement // элемент количества синапсов к списанию
```

Конструктор:
```
constructor(container: HTMLElement, actions: ISuccessActions)
```

Методы:
```
set total(total: number) // установить количество синапсов к списанию
```

## class `Card`
Класс, наследуемый от Component, представляет карточку товара в каталоге.

Свойства:
```
protected image: HTMLImageElement // элемент изображения товара
protected title: HTMLElement // элемент заголовка товара
protected description: HTMLElement // элемент описания товара
protected price: HTMLElement // элемент цены товара
protected category: HTMLButtonElement // элемент категории товара
protected button: HTMLButtonElement // кнопка добавления в корзину
```

Конструктор:
```
constructor(container: HTMLElement, actions?: ICardActions)
```

Методы:
```
set price(price: number | null) // установить цену
set category(value: string) // установить категорию
set id(value: string) // установить идентификатор
set title(value: string) // установить название
set image(value: string) // установить картинку
set description(value: string) // установить описание
set button(isAddOpiration: boolean) // установить кнопку
addButoonAction(actions?: ICardActions): void // добавить слушатель нажатия на кнопку
```

## class `BasketCard`
Класс BasketCard наследник базового класса Card<IBasketCard>, представляет собой карточку товара в корзине. Он отображает индекс товара и предоставляет функционал для удаления товара.

Свойства:
```
index: HTMLElement - элемент, отображающий порядковый номер товара в корзине
icon: HTMLElement - элемент, представляющий иконку удаления товара
```

Конструктор:
```
constructor(container: HTMLElement, actions?: ICardActions) - принимает контейнер с элементами карточки и опционально объект с действиями для карточки
```

Методы:
```
set index(index: string): void - устанавливает и отображает порядковый номер товара в элементе index.
```

## class `Order`
Класс, наследуемый от `Component`, представляет форму оформления заказа.

Свойства:
```
protected _alts: HTMLButtonElement[] // массив кнопок для выбора метода оплаты
protected _card: HTMLButtonElement // кнопка выбора оплаты картой
protected _cash: HTMLButtonElement // кнопка выбора оплаты наличными
protected _next: HTMLButtonElement // кнопка перехода к следующему этапу оформления заказа
protected _address: HTMLInputElement // поле ввода адреса доставки
private isChoosen: boolean // флаг, определяющий, выбран ли метод оплаты
```

Конструктор:
```
constructor(container: HTMLElement, protected events: IEvents)
```

Методы:
```
set address(address: string) // установить адрес
checkAddress(): boolean // проверяет, заполнен ли адрес и выбран ли метод оплаты
```

## class `Contacts`
Класс, наследуемый от `Component`, представляет блок с контактной информацией.

Свойства:
```
protected phone: HTMLElement // DOM-элемент с номером телефона
protected email: HTMLElement // DOM-элемент с email
protected button: HTMLButtonElement;
```

Конструктор:
```
constructor(container: HTMLElement)
```

Методы:
```
set phone(value: string) // устанавливает номер телефона
set email(value: string) // устанавливает email
```

# Типы данных
```ts
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IBasket {
	items: IProduct[];
	totalPrice: number;
	addItem(item: IProduct): void;
	removeItem(itemId: IProduct): void;
	calculateTotalPrice(): number;
}

export enum PaymentMethod {
	ONLINE = 'Онлайн',
	CARD = 'При получении',
}

export interface IOrder {
	phone: string;
	email: string;
	address: string;
	payment: PaymentMethod;
	items: string[];
	total: number;
}

export interface IPaymentAndAddressForm {
	address: string;
	paymentType: PaymentMethod;
}

export interface IPaymentPhoneAndEmailForm {
	phone: string;
	email: string;
}

export interface IWebLarekAPI {
	getProducts(): Promise<IProduct[]>;
	getProductById(id: number): Promise<IProduct>;
	order(order: IOrder): Promise<IOrderResponse>;
}

export interface IAppState {
	products: IProduct[];
	basket: string[];
	order: IOrder | null;
}

export interface IOrderResponse {
	status: string;
	totalPrice: number;
}

export enum Events {
	CATALOG_CHANGED = 'catalog:changed',
	CATALOG_SHOW = 'catalog:show',
	CARD_ADD = 'card:add',
	CARD_DELETE = 'card:delete',
	BASKET_OPEN = 'basket:open',
	ORDER_OPEN = 'order:open',
	ORDER_SUBMIT = 'order:submit',
	CONTACTS_OPEN = 'contacts:open',
	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close'
}
```

# Список событий
- catalog:changed - изменились элементы каталога
- catalog:show - показ деталей товара
- card:add - добавление товара в корзину
- card:delete - удаление товара из корзины
- basket:open - открытие корзины
- order:open - открытие формы заказа
- order:submit - отправить форму заказа
- contacts:open - открытие формы контактов
- modal:open - блокирует прокрутку страницы если открыто модальное окно
- modal:close - разблокирует прокрутку страницы, когда модальное окно закрывается
