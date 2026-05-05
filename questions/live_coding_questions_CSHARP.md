## 🟢 JUNIOR

### Лёгкие (5)

**1. Сумма цифр**
Напиши метод `int SumDigits(int n)`, возвращающий сумму цифр целого числа. Для отрицательных брать модуль.

**2. Проверка палиндрома**
Напиши метод `bool IsPalindrome(string s)` без учёта регистра и пробелов.

**3. Поиск минимума**
Напиши метод `int Min(int[] arr)`. Для пустого массива — `ArgumentException`.

**4. Конвертация температуры**
Напиши методы `double CToF(double c)` и `double FToC(double f)`.

**5. Таблица умножения**
Напиши метод `int[,] MultiplicationTable(int n)`, возвращающий двумерный массив `n x n`.

### Средние (5)

**6. Реверс массива LINQ vs цикл**
Напиши `int[] Reverse(int[] arr)` двумя способами: `Array.Reverse`-стиль in-place и LINQ `arr.Reverse().ToArray()`. Сравни.

**7. Подсчёт букв**
Метод `Dictionary<char,int> Count(string s)`, возвращающий частоту символов.

**8. Разница дат**
Метод `int DaysBetween(DateTime a, DateTime b)`, возвращающий модуль разницы в днях.

**9. Пользовательский класс Rectangle**
Создай класс `Rectangle` с авто-свойствами `Width`, `Height`, методом `Area()` и переопределённым `ToString`.

**10. Первое не повторяющееся**
Метод `char FirstUnique(string s)`, возвращающий первый символ без повторов или `''`.

### Сложные (5)

**11. Односвязный список**
Реализуй `LinkedList<T>` с `Add`, `Remove`, `Contains`, реализующий `IEnumerable<T>`.

**12. Стек на массиве**
Реализуй generic `ArrayStack<T>` с авторесайзом, `Push`, `Pop`, `Peek`, `Count`.

**13. Matrix transpose**
Метод `int[,] Transpose(int[,] m)` для прямоугольной матрицы.

**14. Валидация пароля**
Метод `bool IsStrongPassword(string p)`: не короче 8, есть заглавная, строчная, цифра, спецсимвол. Через регулярки.

**15. Римские → арабские**
Метод `int RomanToInt(string r)` с корректной обработкой субтрактивных форм (IV, IX, XL, XC, CD, CM).

---

## 🟡 MIDDLE

### Лёгкие (5)

**1. IEnumerable vs List**
Напиши два метода: один возвращает `IEnumerable<int> Evens(IEnumerable<int>)` через `yield return`, второй — `List<int>`. Объясни отличия в lazy vs eager.

**2. Record equality**
Создай `record Person(string Name, int Age)` и покажи, что `==` сравнивает по значениям. Сделай `init`-сеттеры.

**3. Extension method**
Напиши `public static bool IsNullOrWhitespace(this string? s)` и используй с null-безопасностью.

**4. Tuple deconstruction**
Метод возвращает `(int Min, int Max, double Avg)` для `IEnumerable<int>`. Продемонстрируй деконструкцию.

**5. Pattern matching**
Реализуй `string Describe(object o)` через `switch`-выражение для типов `int`, `string`, `null`, `IEnumerable<int>`, `_`.

### Средние (5)

**6. Async HTTP**
Напиши метод `Task<string> FetchAsync(string url)` через `HttpClient` с `CancellationToken` и таймаутом.

**7. Parallel.ForEach**
Обработай список файлов параллельно (`Parallel.ForEachAsync` .NET 6+) с ограничением параллелизма `MaxDegreeOfParallelism = 4`.

**8. Collection initializer + LINQ**
Группировка `List<Order>` по `CustomerId` с подсчётом `Sum(o => o.Amount)` — через LINQ method syntax и query syntax.

**9. IDisposable correctly**
Реализуй класс `FileLogger : IDisposable` с dispose pattern (защита от двойного dispose, `GC.SuppressFinalize`).

**10. Minimal API endpoint**
Напиши `Program.cs` для ASP.NET Core Minimal API с `POST /todos` и `GET /todos/{id}`, DI in-memory репозитория и DTO-валидацией.

### Сложные (5)

**11. Custom awaitable**
Реализуй простой awaitable-объект с `GetAwaiter()` и методом, имитирующим задержку. Покажи `await myThing`.

**12. EF Core миграция и запрос**
Создай `DbContext` с сущностями `Blog` и `Post` (1:M). Напиши LINQ-запрос, возвращающий блоги с количеством постов > 5 (без N+1, через `Include` / проекцию).

**13. Channels pipeline**
Реализуй пайплайн producer → processor → consumer на `System.Threading.Channels` с back-pressure.

**14. Middleware ASP.NET Core**
Реализуй кастомный middleware, логирующий время ответа и корреляционный `X-Request-Id` (генерировать если нет).

**15. IAsyncEnumerable streaming**
Напиши метод `async IAsyncEnumerable<int> StreamAsync([EnumeratorCancellation] CancellationToken ct)`, возвращающий числа раз в 100 мс. Потреби через `await foreach`.

---

## 🔴 SENIOR

### Лёгкие (5)

**1. Span/Memory базово**
Напиши метод `int SumSlice(ReadOnlySpan<int> data)` и объясни, зачем `Span`, и почему его нельзя хранить в поле класса.

**2. Nullable reference types**
Даны классы с `#nullable enable`. Напиши сервис, корректно обрабатывающий `null`-возвраты без `!`-операторов.

**3. Source generator (концепт)**
Опиши структуру `IIncrementalGenerator`, который генерирует `ToString` по атрибуту `[AutoToString]`. Скелет кода.

**4. BenchmarkDotNet setup**
Напиши бенчмарк, сравнивающий `string +` vs `StringBuilder` vs `string.Concat` на 1000 конкатенаций.

**5. Generic constraints**
Напиши `static T Clamp<T>(T value, T min, T max) where T : IComparable<T>`.

### Средние (5)

**6. CancellationToken пропагация**
Напиши метод `Task<IReadOnlyList<Result>> RunAllAsync(IEnumerable<Func<CancellationToken, Task<Result>>> jobs, CancellationToken ct)` с ограничением параллелизма 5 через `SemaphoreSlim`.

**7. Polly policies**
Собери политику Polly: retry с jitter, circuit breaker, timeout, bulkhead — и примени к `HttpClient`.

**8. CQRS хэндлер на MediatR**
Реализуй `CreateOrderCommand` и `CreateOrderCommandHandler` с валидацией через FluentValidation и публикацией `OrderCreated` события.

**9. gRPC сервис**
Напиши `.proto` и серверную реализацию streaming-метода `GetStockPrices(stream)`, отдающую цены тикера раз в секунду.

**10. Dapper + транзакция**
Реализуй репозиторий через Dapper с методом `Transfer(long from, long to, decimal amount)` в одной транзакции с `IsolationLevel.Serializable`.

### Сложные (5)

**11. ArrayPool и высокопроизводительный парсер**
Напиши парсер CSV-строки в `List<string[]>` с использованием `ArrayPool<char>` и `ReadOnlySpan<char>` для нулевых аллокаций на горячем пути.

**12. Reflection-ориентированный маппер**
Реализуй мини-аналог AutoMapper: `Mapper.Map<TSource, TDest>(source)` через кешированные скомпилированные выражения (`Expression.Compile`).

**13. Roslyn analyzer**
Напиши концепт `DiagnosticAnalyzer`, выдающий предупреждение при использовании `DateTime.Now` (требует `DateTime.UtcNow`).

**14. SignalR hub с группами**
Реализуй hub с методами `JoinRoom`, `LeaveRoom`, `SendMessage`, broadcast'ом только участникам комнаты и корректной очисткой при дисконнекте.

**15. Выделенный GC + Server GC**
Напиши микробенчмарк на BenchmarkDotNet, демонстрирующий разницу по latency между Workstation GC, Server GC и `GCSettings.LatencyMode = SustainedLowLatency` для allocation-heavy нагрузки.