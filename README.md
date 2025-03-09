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
Проект реализует паттерн MVP, который разделяет приложение на три части:

# Model (Модель)
Модель отвечает за работу с данными, хранение и предоставление методов для их изменения. В проекте модель представлена классом AppData, который:

- загружает данные с сервера
- хранит список товаров и текущие данные заказа
- обрабатывает добавление и удаление товаров из корзины
- управляет состоянием формы заказа

# View (Представление)
View отвечает за отображение интерфейса и обновление данных из модели. Классы представления в проекте:

- `Component<T>` — базовый класс для всех компонентов
- `Modal` —  управление модальными окнами
- `Basket` — отображение корзины
- `Form` — форма заказа
- `Success` — страница успешного оформления заказа
- `Page`, `Card`, `Order`, `Contacts` — классы для отдельных частей приложения

# Presenter (Презентер)
Презентер связывает модель и представление, управляет логикой приложения. В проекте роль презентера выполняет index.ts, который:

- инициализирует приложение
- подписывается на события
- обрабатывает действия пользователя

# Классы проекта

## Базовый класс `Component<T>`
Абстрактный класс, от которого наследуются все компоненты
```ts
abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) { }

    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
```

## Базовый класс `Model`
Абстрактный класс, от которого наследуются все модели, в данном случае класс AppData
```ts
abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }
}
```

## Класс `AppData`
Класс AppData отвечает за хранение и управление данными, необходимыми для функционирования приложения. Он обрабатывает данные каталога, корзины, оформления заказа и управляет состоянием загрузки.
```ts
class AppData extends Model<IAppState> {
    catalog: IProduct[] = [];
    basket: string[] = [];
    preview: string | null = null;
    order: IOrder | null = null;
    loading: boolean = false;
    formErrors: FormErrors = {};
}
```

## Класс `WebLarekAPI`
Класс для работы с API
```ts
class WebLarekAPI extends Api implements IWebLarekAPI {
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item
            }))
        );
    }

    getProductById(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item
            })
        );
    }

    order(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}
```


## Типы данных
```ts
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface IOrderForm {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
}

interface IOrder extends IOrderForm {
    total: number;
    items: string[]
}
```

# Список событий

- catalog:changed - изменились элементы каталога
- basket:update - изменения в корзине (добавление или удаление)
- basket:cleared - очистка корзины
- basket:open - открытие корзины
- basket:close - закрытие корзины
- order:changed - изменилось одно из полей формы заказа
- order:submit - отправить форму заказа
- modal:open - блокирует прокрутку страницы если открыто модальное окно
- modal:close - разблокирует прокрутку страницы, когда модальное окно закрывается
- formErrors:changed - имзенилось состояние валидации формы
