## 🟢 JUNIOR

### Лёгкие (5)

**1. Факториал**
Напиши метод `long factorial(int n)`. Для `n == 0` вернуть 1, для отрицательных — бросить `IllegalArgumentException`.

**2. Проверка простого числа**
Напиши метод `boolean isPrime(int n)`. Используй проверку до `sqrt(n)`.

**3. Среднее арифметическое**
Напиши метод `double average(int[] arr)`. Для пустого массива — бросить `IllegalArgumentException`.

**4. Счётчик символа**
Напиши метод `int countChar(String s, char c)`, возвращающий количество вхождений символа.

**5. Подсчёт слов**
Напиши метод `int wordCount(String s)`, считающий слова, разделённые любым количеством пробелов.

### Средние (5)

**6. Разворот массива**
Напиши метод `void reverse(int[] arr)`, разворачивающий массив **in-place**. Без создания нового массива.

**7. Fibonacci итеративно**
Напиши метод `long fib(int n)` итеративно за O(n) памяти O(1).

**8. Второе максимальное**
Напиши метод `int secondMax(int[] arr)`, возвращающий второе по величине уникальное значение. Если нет — бросить исключение.

**9. Сортировка пузырьком**
Реализуй `bubbleSort(int[] arr)` с флагом ранней остановки.

**10. Валидация e-mail**
Напиши метод `boolean isValidEmail(String s)` через регулярное выражение (упрощённый шаблон).

### Сложные (5)

**11. Односвязный список: разворот**
Реализуй класс `Node { int val; Node next; }` и метод `Node reverse(Node head)` за O(n) / O(1).

**12. Стек через две очереди**
Реализуй класс `MyStack` с `push`, `pop`, `top`, `empty`, используя только `Queue<Integer>`.

**13. Баланс скобок**
Напиши метод `boolean isBalanced(String s)` для скобок `()[]{}`. Используй `Deque`.

**14. Удаление дубликатов из отсортированного массива**
Метод `int removeDuplicates(int[] arr)` **in-place**: вернуть новую длину, значащие элементы — в начале.

**15. Anagram groups**
Метод `List<List<String>> groupAnagrams(String[] words)` — сгруппируй строки-анаграммы.

---

## 🟡 MIDDLE

### Лёгкие (5)

**1. Immutable Point**
Создай неизменяемый класс `Point` с `final` полями, `equals`, `hashCode`, `toString`. Объясни, почему нельзя использовать `record` в Java 8.

**2. Enum со стратегией**
Создай `enum Operation { ADD, SUB, MUL, DIV }` с абстрактным методом `double apply(double a, double b)` и реализацией в каждой константе.

**3. Generics Pair**
Реализуй `class Pair<K, V>` с `final` полями и `equals/hashCode`.

**4. Stream: сумма квадратов**
С помощью Stream API: из `List<Integer>` получи сумму квадратов чётных чисел.

**5. Optional-цепочка**
Имея цепочку `Order.getUser().getAddress().getCity()`, перепиши через `Optional`, чтобы не было NPE.

### Средние (5)

**6. LRU-кэш через LinkedHashMap**
Реализуй `class LRUCache<K,V> extends LinkedHashMap<K,V>` с `removeEldestEntry`.

**7. Собственный Iterable**
Реализуй `class Range implements Iterable<Integer>` для диапазона `[start, end)` с шагом.

**8. Параллельная сумма через ForkJoinPool**
Реализуй `long parallelSum(long[] arr)` через `RecursiveTask<Long>` и `ForkJoinPool`.

**9. Thread-safe счётчик**
Покажи 3 реализации потокобезопасного счётчика: через `synchronized`, `AtomicLong`, `LongAdder`. Объясни разницу.

**10. Spring Boot REST endpoint**
Напиши `@RestController` с `GET /users/{id}` и `POST /users`. Используй `@Valid` DTO с полями `name` (NotBlank) и `age` (Min 0).

### Сложные (5)

**11. Producer-Consumer на BlockingQueue**
Реализуй пару классов `Producer` и `Consumer` на `ArrayBlockingQueue<Integer>` с корректным завершением.

**12. Кастомный ThreadPoolExecutor**
Сконфигурируй `ThreadPoolExecutor` с именованными потоками (через `ThreadFactory`), `LinkedBlockingQueue` на 100 задач и политикой `CallerRunsPolicy`.

**13. CompletableFuture пайплайн**
Имея два async-вызова `getUser(id)` и `getOrders(userId)`, объедини их через `thenCompose`/`thenCombine` с таймаутом и обработкой исключений.

**14. JDBC с транзакцией**
Напиши метод `void transfer(long from, long to, BigDecimal amount)` через JDBC с явной транзакцией, `PreparedStatement` и откатом при ошибке.

**15. Красно-чёрное дерево? Нет — реализуй Trie**
Реализуй `class Trie` с методами `insert(String)`, `search(String)`, `startsWith(String)`.

---

## 🔴 SENIOR

### Лёгкие (5)

**1. Equals-hashCode инвариант**
Покажи класс с полями `id: long`, `email: String`. Реализуй `equals/hashCode` только по `email`. Объясни контракт и последствия неверной реализации для `HashMap`.

**2. Generic bounded method**
Напиши `public static <T extends Comparable<? super T>> T max(List<? extends T> list)`. Объясни PECS.

**3. try-with-resources и AutoCloseable**
Реализуй класс `ResourceHolder implements AutoCloseable`, напиши корректный пример с подавлением исключений (`addSuppressed`).

**4. Stream collector**
Реализуй кастомный `Collector<Employee, ?, Map<Department, BigDecimal>>`, суммирующий зарплаты по отделам.

**5. Volatile / happens-before**
Напиши корректный double-checked locking для синглтона на `volatile` и объясни, зачем нужен `volatile`.

### Средние (5)

**6. Rate limiter Token Bucket**
Реализуй `class RateLimiter { boolean tryAcquire(); }` по алгоритму Token Bucket, потокобезопасно.

**7. Копирование-при-записи List**
Реализуй свой `CopyOnWriteList<T>` с `add`, `remove`, итератором. Объясни, где это применяется.

**8. Реализация ReadWriteLock на AQS**
Напиши свой `SimpleReadWriteLock` (упрощённый) на базе `AbstractQueuedSynchronizer` с fairness.

**9. Микросервис: идемпотентный POST**
Спроектируй ручку `POST /payments` с `Idempotency-Key`. Покажи схему таблицы, pseudo-код сервиса и обработку конкурентных запросов.

**10. JPA N+1**
Дан `@Entity Author` с `@OneToMany List<Book>`. Покажи, как воспроизводится N+1, и исправь через `JOIN FETCH` / `@EntityGraph`. Сравни подходы.

### Сложные (5)

**11. Свой DI-контейнер**
Реализуй мини-контейнер: сканирует пакет, находит классы с `@Component`, разрешает зависимости через конструктор с `@Inject`, поддерживает singleton.

**12. Event Sourcing агрегат**
Реализуй `class Account` как агрегат с событиями `Deposited`, `Withdrawn`. Методы `apply(Event)` и `replay(List<Event>)`.

**13. Consumer Kafka с exactly-once**
Напиши скелет Kafka consumer'а, гарантирующего exactly-once обработку через transactional producer + read_committed + ручной commit.

**14. Нереблокирующий HTTP-клиент**
Используя `java.net.http.HttpClient` и `CompletableFuture`, сделай параллельные GET к 10 URL с лимитом параллелизма 3 и общим таймаутом 5 секунд.

**15. JMH-бенчмарк**
Напиши JMH-бенчмарк, сравнивающий `StringBuilder.append` в цикле vs `String.join` vs `Collectors.joining` на 10k строк. Объясни warmup и blackhole.
"
Observation: Create successful: /app/output/live_coding_questions_JAVA.md