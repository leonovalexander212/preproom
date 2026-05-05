## 🟢 JUNIOR

### Лёгкие (5)

**1. Чётные числа**
Напиши функцию `evens(array $arr): array`, возвращающую только чётные числа.

**2. Склейка строки**
Функция `joinWords(array $words, string $sep): string` — без использования `implode`. Реализуй через цикл.

**3. Поиск индекса**
Функция `findIndex(array $arr, $value): int` — возвращает индекс или `-1`.

**4. Подсчёт длины строки в байтах и символах**
Напиши `lengths(string $s): array` с ключами `bytes` и `chars` (через `strlen` и `mb_strlen`). Продемонстрируй на кириллице.

**5. Преобразование ассоциативного массива**
Функция `renameKey(array $arr, string $from, string $to): array` — возвращает новый массив с переименованным ключом.

### Средние (5)

**6. Рекурсивный факториал**
Функция `factorial(int $n): int` через рекурсию. Для `n < 0` — `InvalidArgumentException`.

**7. Slug из строки**
Функция `slugify(string $s): string`: lower-case, пробелы → `-`, убрать всё кроме `[a-z0-9-]`, trim тире.

**8. Группировка**
Функция `groupBy(array $items, string $key): array` для массива ассоц. массивов.

**9. Обход вложенного массива**
Функция `flatten(array $arr): array` — плоский массив из произвольно вложенного. Без SPL.

**10. Форматирование числа**
Функция `formatMoney(float $amount, string $currency = 'RUB'): string`, возвращающая `\"1 234,56 ₽\"` (через `number_format`).

### Сложные (5)

**11. Класс Cart**
Класс `Cart` с методами `add(Product $p, int $qty)`, `remove(int $productId)`, `total(): float`. Используй приватное поле `$items`.

**12. Валидация формы**
Напиши функцию `validate(array $data, array $rules): array`, возвращающую массив ошибок. Правила: `required`, `email`, `min:N`, `max:N`.

**13. Простой роутер**
Класс `Router` с `get($path, $handler)` и `dispatch($method, $uri)`. Поддержка параметра `/user/{id}`.

**14. Работа с PDO**
Напиши функцию `getUserById(PDO $db, int $id): ?array` с `prepare` и именованным параметром. Объясни, почему это безопаснее конкатенации.

**15. SPL SplStack**
Используй `SplStack` для проверки баланса скобок `()[]{}` в строке.

---

## 🟡 MIDDLE

### Лёгкие (5)

**1. Интерфейс + реализации**
Интерфейс `PaymentGateway` с `charge(float $amount): bool`. Две реализации: `StripeGateway`, `PayPalGateway`. Фабрика `create(string $type)`.

**2. Трейт Timestampable**
Трейт с полями `createdAt`, `updatedAt` и методом `touch()`. Подключи к двум классам.

**3. Enum (PHP 8.1+)**
`enum OrderStatus: string` с кейсами `Pending`, `Paid`, `Cancelled` и методом `isFinal(): bool`.

**4. Readonly class (PHP 8.2)**
Класс `Money` с `readonly` свойствами `amount` и `currency` и методом `add(Money $other): Money`.

**5. Named arguments и промоушен**
Класс `User` с конструкторным промоушеном свойств и использование именованных аргументов при создании.

### Средние (5)

**6. Генераторы**
Функция-генератор `function range_gen(int $start, int $end, int $step = 1)`. Продемонстрируй экономию памяти vs `range()` для 10M элементов.

**7. Dependency Injection**
Реализуй простой DI-контейнер с `bind($abstract, $concrete)` и `make($abstract)`, поддерживающий autowiring через Reflection.

**8. Middleware PSR-15**
Реализуй класс, соответствующий `MiddlewareInterface`, который логирует время обработки запроса.

**9. Репозиторий с Query Builder**
Абстрактный класс `Repository` с методами `where`, `orderBy`, `limit`, `get`, строящими SQL через массив-конфиг (без ORM).

**10. Laravel: Form Request**
Напиши `StoreUserRequest` с правилами валидации и кастомными сообщениями. Покажи использование в контроллере.

### Сложные (5)

**11. Event dispatcher PSR-14**
Реализуй `EventDispatcher` с подписками и `ListenerProvider`, поддерживающий `StoppableEventInterface`.

**12. CQRS command bus**
Реализуй `CommandBus` с регистрацией хэндлеров по имени команды и middleware-цепочкой (transaction, validation).

**13. Rate limiter на Redis**
Реализуй token-bucket rate limiter через Redis (`INCR` + `EXPIRE` или Lua-скрипт для атомарности).

**14. Очередь задач**
Используя Laravel Queues (или чистый PHP + Redis), реализуй job `SendWelcomeEmail`, retry-политику и dead-letter через `failed_jobs`.

**15. WebSocket чат**
С помощью `ratchet/pub-sub` или `openswoole` реализуй сервер WebSocket с комнатами и broadcast'ом сообщений.

---

## 🔴 SENIOR

### Лёгкие (5)

**1. Covariance / contravariance**
Покажи класс `AnimalShelter` с методом `getAnimal(): Animal`. В наследнике `DogShelter` сузь возврат до `Dog` (covariance). Объясни.

**2. Строгая типизация**
Напиши модуль с `declare(strict_types=1)` и функцией с union-типом параметра `int|string`. Продемонстрируй, когда PHP бросит `TypeError`.

**3. Attributes (PHP 8+)**
Создай атрибут `#[Route(string $path, string $method = 'GET')]` и прочитай его через Reflection у методов контроллера.

**4. Fiber (PHP 8.1+)**
Напиши простой пример `Fiber`, имитирующий cooperative multitasking для двух «задач».

**5. WeakMap кэш**
Используй `WeakMap` для кеша, привязанного к lifetime объекта-ключа.

### Средние (5)

**6. Optimistic locking**
Реализуй метод `updateProduct` с полем `version` в БД и `WHERE id = ? AND version = ?`. Обработай conflict через исключение.

**7. CQRS + Event Sourcing**
Реализуй агрегат `Account` с событиями `MoneyDeposited`, `MoneyWithdrawn`, `apply()`-методами и `recordThat()`. Репозиторий перечитывает события.

**8. Saga pattern**
Напиши скелет хореографической saga для процесса `OrderCreated -> PaymentProcessed -> OrderShipped` с компенсирующими действиями.

**9. Профилирование N+1**
Дан Eloquent-код с N+1. Покажи, как диагностировать (через `DB::listen`, `laravel-debugbar`) и пофиксить через `with()` / `load()`.

**10. Octane / Swoole lifecycle**
Напиши сервис, который корректно работает в Laravel Octane: избегает state leak, использует `Octane::tick()`, реагирует на `RequestReceived` / `RequestTerminated`.

### Сложные (5)

**11. Свой ORM-minimal**
Реализуй Active Record-подобный класс `Model` с автоматическим маппингом столбцов в свойства через Reflection, методами `find`, `save`, `delete`.

**12. Реализация PSR-7 Request/Response**
Реализуй упрощённо `RequestInterface` и `ResponseInterface` (иммутабельные with-* методы) и продемонстрируй их использование.

**13. Async runtime на ReactPHP**
Реализуй параллельные HTTP-запросы через `React\Http\Browser` с лимитом параллелизма и общим таймаутом. Объясни event loop.

**14. Сборщик метрик Prometheus**
Подключи `prom/prometheus-php` в PHP-FPM приложение и выставь `/metrics` endpoint с counter, histogram, gauge. Объясни проблемы metric persistence в FPM.

**15. Statically typed builder через Generics-подобие**
Используя PHPStan generics в аннотациях (`@template T`) и reflection, реализуй type-safe QueryBuilder, который выводит тип сущности в IDE.
"
Observation: Create successful: /app/output/live_coding_questions_PHP.md