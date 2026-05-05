## 🟢 JUNIOR

### Лёгкие (5)

**1. Чётные и нечётные**
Реализуй функцию `split_even_odd(nums: list[int]) -> tuple[list[int], list[int]]`, возвращающую две списка: чётные и нечётные.

**2. Подсчёт гласных**
Функция `count_vowels(s: str) -> int`. Без учёта регистра, гласные: `a, e, i, o, u`.

**3. Поиск максимума**
Функция `find_max(nums: list[int]) -> int`. Для пустого списка — `ValueError`. Реализовать без `max()`.

**4. Сортировка словарей**
Имея `list[dict]` с ключом `age`, верни отсортированный по возрастанию возраста список.

**5. Суммирование цифр числа**
Функция `digit_sum(n: int) -> int`. Для отрицательных — берём модуль.

### Средние (5)

**6. Частотный словарь**
Функция `char_freq(s: str) -> dict[str, int]`. Реализуй через `collections.Counter` и через цикл — покажи оба.

**7. Ревёрс слов**
Функция `reverse_words(s: str) -> str`: `\"Hello World\"` → `\"World Hello\"`. Несколько пробелов свести к одному.

**8. Fibonacci через генератор**
Напиши генератор `def fib():` бесконечно выдающий числа Фибоначчи. Продемонстрируй `list(islice(fib(), 10))`.

**9. Чтение CSV**
Используя `csv.DictReader`, посчитай среднее значение столбца `price` в файле `products.csv`.

**10. Валидация пароля**
Функция `is_strong(pwd: str) -> bool`: длина ≥ 8, есть upper, lower, digit, spec-символ. Через регулярки.

### Сложные (5)

**11. Класс BankAccount**
Класс с `balance`, методами `deposit`, `withdraw` (нельзя уйти в минус — `ValueError`), `__repr__` и свойством `is_empty`.

**12. Контекстный менеджер**
Напиши класс `Timer`, замеряющий время выполнения блока через `with Timer() as t: ...; print(t.elapsed)`. Реализуй через `__enter__` / `__exit__`.

**13. Декоратор @retry**
`@retry(times=3, delay=0.5)` — повторяет функцию при любом исключении заданное число раз.

**14. Разница множеств**
Даны два `list[int]` с дубликатами. Верни: общие, только в первом, только во втором — используя `set`-операции.

**15. Парсер простого JSON-подобного формата**
Напиши функцию-парсер для строки `\"k1=v1;k2=v2;k3=v3\"` → `dict`. Учти пробелы, пустые значения, дубликаты ключей (последний побеждает).

---

## 🟡 MIDDLE

### Лёгкие (5)

**1. Декоратор с аргументами**
`@log(level='INFO')` — логирует имя функции, args, kwargs и результат.

**2. Namedtuple vs dataclass**
Создай `Point` через `NamedTuple` и `@dataclass(frozen=True, slots=True)`. Сравни по иммутабельности, памяти, синтаксису.

**3. Генератор-пайплайн**
Напиши три generator-функции: `read_lines(path)`, `parse(lines)`, `filter_errors(records)`. Соедини в пайплайн. Продемонстрируй lazy-обработку.

**4. itertools**
Используя `itertools.groupby`, сгруппируй подряд идущие одинаковые элементы. Пример: `[1,1,2,2,2,3,1,1]` → `[(1,2),(2,3),(3,1),(1,2)]`.

**5. Path pathlib**
С помощью `pathlib.Path` найди все `.py` файлы в каталоге рекурсивно, посчитай суммарное число строк.

### Средние (5)

**6. LRU-cache своими руками**
Напиши декоратор `@lru(maxsize=128)` без использования `functools.lru_cache`. Внутри — `OrderedDict`.

**7. Async HTTP через aiohttp**
Напиши `async def fetch_all(urls: list[str]) -> list[str]`, параллельно запрашивающую URL с лимитом 10 одновременных запросов через `asyncio.Semaphore`.

**8. FastAPI эндпоинт**
Напиши `POST /items` с Pydantic-моделью `ItemCreate` (name, price > 0) и `GET /items/{id}`, валидирующий `id > 0` через `Path(..., gt=0)`.

**9. Многопоточный загрузчик**
Используя `concurrent.futures.ThreadPoolExecutor`, скачай 20 URL параллельно и верни словарь `{url: status_code}`. Обработай исключения.

**10. Pytest + parametrize + fixture**
Напиши тесты для функции `calc_discount(price, code)` через `@pytest.mark.parametrize`. Добавь fixture, имитирующую базу кодов скидок.

### Сложные (5)

**11. Метакласс Singleton**
Реализуй метакласс `SingletonMeta`, превращающий любой класс в синглтон. Покажи пример и возможные проблемы в многопоточной среде (и фикс через `Lock`).

**12. Дескриптор Validated**
Напиши data descriptor `class Positive`, который проверяет, что присваиваемое значение > 0 (иначе `ValueError`). Примени к полям класса `Order`.

**13. AsyncIO-очередь worker pool**
Реализуй `worker_pool(n: int, queue: asyncio.Queue)` с n воркерами, обрабатывающими задачи, с graceful shutdown по sentinel.

**14. SQLAlchemy 2.0 ORM**
Опиши модели `User` и `Post` (1:M), напиши запрос с `selectinload` для избежания N+1, отсортируй по дате публикации.

**15. Celery workflow**
Напиши цепочку `chord(header=[task_a.s(), task_b.s()], body=task_c.s())`. Объясни broker'ы, serializer, acks_late и потерю задач.

---

## 🔴 SENIOR

### Лёгкие (5)

**1. Протоколы (PEP 544)**
Определи `Protocol` `SupportsClose` с методом `close()`. Напиши функцию, принимающую любой объект с этим интерфейсом (structural typing).

**2. Dataclass с `__post_init__`**
Создай `@dataclass class Rectangle` с валидацией в `__post_init__` и computed property `area`.

**3. Контекстный менеджер на contextlib**
Используй `@contextmanager` и `ExitStack` для открытия N файлов одновременно с гарантированным закрытием всех даже при ошибке.

**4. Типы Generic**
Напиши `class Stack(Generic[T])` с `push`, `pop`. Покажи, как mypy ловит ошибку типа.

**5. Walrus и match (3.10+)**
Перепиши цикл обработки токенов (`+`, `-`, числа) через `match-case` со structural pattern matching.

### Средние (5)

**6. Memory profiling**
Сравни потребление памяти `list` vs `generator` vs `array.array` для 10M интов. Используй `tracemalloc` и `sys.getsizeof`.

**7. GIL и CPU-bound**
Напиши бенчмарк: CPU-bound задача в `threading.Thread` × 4 vs `multiprocessing.Process` × 4. Объясни, почему thread'ы не ускоряют.

**8. Custom JSON encoder**
Напиши `class DomainEncoder(json.JSONEncoder)`, сериализующий `datetime`, `Decimal`, `UUID` и dataclasses. Парный `object_hook` для десериализации.

**9. Middleware Starlette/FastAPI**
Напиши ASGI middleware, измеряющий p50/p95/p99 latency и экспортирующий в Prometheus (через `prometheus_client`).

**10. Django ORM оптимизация**
Дан queryset с N+1 и denormalized подсчётом. Перепиши через `select_related`, `prefetch_related`, `annotate(Count(...))`.

### Сложные (5)

**11. Свой async await**
Реализуй минималистичный event loop с `Task`, `Future`, корутинами (без asyncio). Поддержи `sleep(seconds)` через `heapq`.

**12. Плагинная архитектура через entry_points**
Спроектируй приложение, подгружающее плагины через `importlib.metadata.entry_points`. Покажи `pyproject.toml` и интерфейс плагина.

**13. Cython / Mypyc ускорение**
Возьми горячую функцию (например, hot loop с арифметикой) и покажи три варианта оптимизации: NumPy-векторизация, Cython, Mypyc. Приведи цифры.

**14. Distributed lock на Redis**
Реализуй RedLock-подобный механизм: `acquire(key, ttl)`, `release(key, token)` через Lua-скрипт. Объясни проблемы с clock drift.

**15. Observability: OpenTelemetry**
Инструментируй FastAPI-приложение OpenTelemetry: traces (span'ы вокруг HTTP + DB), metrics (RPS, latency), logs-correlation через `trace_id`. Экспорт в OTLP.
"
Observation: Create successful: /app/output/live_coding_questions_PYTHON.md