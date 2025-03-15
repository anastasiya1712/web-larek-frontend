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

```
Свойства:
    baseUrl: string // базовый url сервера
    options: RequestInit // options запроса

Конструктор:
    constructor(cdn: string, baseUrl: string, options?: RequestInit)

Методы:
    getProducts() // получение всего списка товаров с сервера
    getProductById(id: string) // получение товара по id с сервера
    order(order: IOrder) // отправляет запрос на сервер с информацией о заказе и получает ответ
```

## class `Modal`
Класс, является наследником класса `Component`. Предоставляет методы для создания и работы с модальным окном.

```
Свойства:
    protected closeButton: HTMLButtonElement // Элемент кнопки для закрытия модального окна
    protected content: HTMLElement // Контент модального окна

Конструктор:
    constructor(container: HTMLElement, protected events: IEvents)

Методы:
    open() // Открывает модальное окно
    close() // Закрывает модальное окно
    render(data: IModelData) // Возращает DOM-элемент модального окна
```

## class `Basket`
Класс, является наследником класса `Component`. Предостевляет методы для добавления элементов в корзину.

```
Свойства:
    protected list: HTMLElement // DOM-элемент списка товаров
    protected total: HTMLElement // DOM-элемент количества товаров
    protected button: HTMLElement // DOM-элемент кнопки совершения заказа

Конструктор:
    constructor(container: HTMLElement, protected events: EventEmitter)

Методы:
    set items(items: HTMLElement[]) // Добавление элементов в корзину
    set selected(items: string[]) 
    set total(total: number)
```

## class `Form`
Класс, наследуемый от `Component`, представляет форму ввода данных. Позволяет управлять состоянием формы, валидацией и отправкой данных.

```
Свойства:
    protected _submit: HTMLButtonElement // Кнопка отправки формы
    protected _errors: HTMLElement // Элемент для отображения ошибок

Конструктор:
    constructor(container: HTMLFormElement, protected events: IEvents)

Методы:
    protected onInputChange(field: keyof T, value: string) // Вызывает событие изменения поля формы
    set valid(value: boolean) // Устанавливает статус валидности формы
    set errors(value: string) // Устанавливает текст ошибок в форме
    render(state: Partial<T> & IFormState): HTMLElement // Обновляет состояние формы и возвращает ее DOM-элемент
```

## class `Page`
Класс, наследуемый от `Component`, представляет страницу и управляет ее отрисовкой.

```
Свойства:
    protected header: HTMLElement // DOM-элемент шапки страницы
    protected content: HTMLElement // DOM-элемент контента страницы

Конструктор:
    constructor(container: HTMLElement, protected events: IEvents)

Методы:
    render(data?: Partial<T>): HTMLElement // Отрисовывает содержимое страницы
```

## class `Success`
Класс, наследуемый от `Component`, представляет экран успешного завершения заказа или действия.

```
Свойства:
    protected _close: HTMLElement // Кнопка закрытия

Конструктор:
    constructor(container: HTMLElement, actions: ISuccessActions)

Методы:
    // Нет дополнительных методов, взаимодействие происходит через переданный обработчик на закрытие
```

## class `Card`
Класс, наследуемый от Component, представляет карточку товара в каталоге.

```
Свойства:
    protected image: HTMLImageElement // Элемент изображения товара
    protected title: HTMLElement // Элемент заголовка товара
    protected price: HTMLElement // Элемент цены товара
    protected button: HTMLButtonElement // Кнопка добавления в корзину

Конструктор:
    constructor(container: HTMLElement, protected events: IEvents)

Методы:
    set product(data: IProduct) // Устанавливает данные товара 
```


## class `Order`
Класс, наследуемый от `Component`, представляет форму оформления заказа.

```
Свойства:
    protected form: HTMLFormElement // Форма оформления заказа
    protected submitButton: HTMLButtonElement // Кнопка подтверждения заказа

Конструктор:
    constructor(container: HTMLElement, protected events: IEvents)

Методы:
    set valid(value: boolean) // Устанавливает статус валидации формы
    set errors(value: string) // Отображает ошибки формы
    render(data?: Partial<T>): HTMLElement // Обновляет состояние формы и возвращает DOM-элемент

```

## class `Contacts`
Класс, наследуемый от `Component`, представляет блок с контактной информацией.

```
Свойства:
    protected phone: HTMLElement // DOM-элемент с номером телефона
    protected email: HTMLElement // DOM-элемент с email

Конструктор:
    constructor(container: HTMLElement)

Методы:
    set phone(value: string) // Устанавливает номер телефона
    set email(value: string) // Устанавливает email
```


## class `AppData`
Класс `AppData` наследник базового класса `Model<T>`, отвечает за хранение и управление данными, необходимыми для функционирования приложения. Он обрабатывает данные каталога, корзины, оформления заказа и управляет состоянием загрузки.

# Типы данных
```ts
interface IProduct
```
```ts
interface IOrder  
```

# Список событий
- catalog:changed - изменились элементы каталога
- basket:update - изменения в корзине (добавление или удаление)
- basket:cleared - очистка корзины
- basket:open - открытие корзины
- basket:close - закрытие корзины
- order:changed - изменилось одно из полей формы заказа
- order:submited - отправить форму заказа
- modal:open - блокирует прокрутку страницы если открыто модальное окно
- modal:close - разблокирует прокрутку страницы, когда модальное окно закрывается
- formErrors:changed - имзенилось состояние валидации формы
