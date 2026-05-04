// Банк вопросов для AI Mock Interview. Заглушка — позже можно
// мигрировать в БД через Prisma (models MockQuestion, MockCodingTask).
//
// Структура: 5 направлений × 3 грейда. На каждый грейд — 5 поведенческо-
// технических вопросов + 1-2 задачи на лайв-кодинг. Этого хватает,
// чтобы собесание длилось ~20 минут и давало осмысленный балл.

export type Direction = 'frontend' | 'java' | 'python' | 'php' | 'csharp';
export type Grade = 'JUNIOR' | 'MIDDLE' | 'SENIOR';

export type QuestionKind = 'soft' | 'theory' | 'practice';

export interface MockQuestion {
  id: string;
  text: string;
  kind: QuestionKind;
  topic: string; // тэг для радара скиллов: "JS", "React", "TS", "Архитектура"...
}

export interface CodingTask {
  id: string;
  title: string;
  description: string;
  starterCode: string; // язык берём дефолтный для направления
  language: 'javascript' | 'java' | 'python' | 'php' | 'csharp';
  hints: string[]; // используются ИИ как подсказка, если пользователь спросит
}

interface DirectionBank {
  label: string;
  grades: Record<Grade, { questions: MockQuestion[]; coding: CodingTask[] }>;
}

const q = (id: string, text: string, kind: QuestionKind, topic: string): MockQuestion => ({
  id, text, kind, topic,
});

export const MOCK_BANK: Record<Direction, DirectionBank> = {
  frontend: {
    label: 'Frontend',
    grades: {
      JUNIOR: {
        questions: [
          q('fe-j-1', 'Расскажи о себе и опыте работы с фронтендом.', 'soft', 'Soft'),
          q('fe-j-2', 'Чем отличается let от var? Что такое hoisting?', 'theory', 'JS'),
          q('fe-j-3', 'Что такое box-model в CSS? Как box-sizing влияет на размеры?', 'theory', 'CSS'),
          q('fe-j-4', 'Объясни, что делает useState в React и почему он возвращает массив.', 'theory', 'React'),
          q('fe-j-5', 'Что такое event bubbling и как его остановить?', 'theory', 'JS'),
        ],
        coding: [
          {
            id: 'fe-j-c1',
            title: 'Сумма чисел массива',
            description: 'Реализуй функцию sum(arr), которая вернёт сумму всех чисел в массиве. Если массив пустой — вернуть 0.',
            starterCode: 'function sum(arr) {\n  // твой код\n}\n',
            language: 'javascript',
            hints: ['Подумай про reduce или обычный for-of', 'Не забудь про пустой массив'],
          },
        ],
      },
      MIDDLE: {
        questions: [
          q('fe-m-1', 'Расскажи о себе и проекте, которым гордишься.', 'soft', 'Soft'),
          q('fe-m-2', 'Объясни разницу между useMemo и useCallback. В каких случаях каждый реально оправдан?', 'theory', 'React'),
          q('fe-m-3', 'Что такое event loop? Чем отличаются микротаски от макротасок?', 'theory', 'JS'),
          q('fe-m-4', 'Почему generic в TypeScript нельзя сузить через typeof? Что делать вместо этого?', 'theory', 'TS'),
          q('fe-m-5', 'Как бы ты спроектировал чат-приложение: протокол, синхронизация, оптимистичные апдейты?', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'fe-m-c1',
            title: 'Flatten вложенного массива',
            description: 'Дан массив с произвольной вложенностью. Реализуй flatten(arr), который вернёт одномерный массив, сохраняя порядок. Без использования Array.prototype.flat.',
            starterCode: 'function flatten(arr) {\n  // твой код\n}\n// flatten([1, [2, [3, [4]]], 5]) → [1,2,3,4,5]\n',
            language: 'javascript',
            hints: ['Рекурсия или стек через итерацию', 'Пустые массивы — тоже корректный вход'],
          },
        ],
      },
      SENIOR: {
        questions: [
          q('fe-s-1', 'Расскажи о самом сложном техническом вызове из твоего опыта.', 'soft', 'Soft'),
          q('fe-s-2', 'Как работает React Fiber? Что такое reconciliation и как это связано с приоритезацией апдейтов?', 'theory', 'React'),
          q('fe-s-3', 'Объясни, как устроен CRDT и когда его стоит выбрать вместо OT для collaborative-редактора.', 'theory', 'Архитектура'),
          q('fe-s-4', 'Какие метрики Web Vitals ты мониторишь и как оптимизируешь LCP?', 'practice', 'Performance'),
          q('fe-s-5', 'Расскажи про подход к построению дизайн-системы в большой компании: токены, версионирование, миграции.', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'fe-s-c1',
            title: 'LRU-кэш',
            description: 'Реализуй класс LRUCache(capacity) с методами get(key) и put(key, value). Операции должны работать за O(1).',
            starterCode: 'class LRUCache {\n  constructor(capacity) {\n    // твой код\n  }\n  get(key) {}\n  put(key, value) {}\n}\n',
            language: 'javascript',
            hints: ['Map в JS сохраняет порядок вставки', 'Для O(1) нужен двусвязный список + хешмэп'],
          },
        ],
      },
    },
  },

  java: {
    label: 'Java',
    grades: {
      JUNIOR: {
        questions: [
          q('j-j-1', 'Расскажи о себе и опыте с Java.', 'soft', 'Soft'),
          q('j-j-2', 'В чём разница между == и equals() для объектов?', 'theory', 'Core'),
          q('j-j-3', 'Что такое JVM, JRE и JDK? Чем они отличаются?', 'theory', 'Core'),
          q('j-j-4', 'Объясни, что такое ArrayList и LinkedList. Когда что использовать?', 'theory', 'Коллекции'),
          q('j-j-5', 'Что такое checked и unchecked исключения?', 'theory', 'Core'),
        ],
        coding: [
          {
            id: 'j-j-c1',
            title: 'Реверс строки',
            description: 'Реализуй метод reverse(String s), возвращающий строку в обратном порядке. Без использования StringBuilder.reverse().',
            starterCode: 'public class Solution {\n  public String reverse(String s) {\n    // твой код\n    return s;\n  }\n}\n',
            language: 'java',
            hints: ['char[] и два указателя', 'Учитывай пустую строку'],
          },
        ],
      },
      MIDDLE: {
        questions: [
          q('j-m-1', 'Расскажи про проект, в котором ты отвечал за архитектуру.', 'soft', 'Soft'),
          q('j-m-2', 'Как работает HashMap внутри? Что происходит при коллизиях и ресайзе?', 'theory', 'Коллекции'),
          q('j-m-3', 'Что такое volatile, synchronized и atomic? В чём разница?', 'theory', 'Многопоточность'),
          q('j-m-4', 'Объясни разницу между @Transactional propagation REQUIRED и REQUIRES_NEW.', 'theory', 'Spring'),
          q('j-m-5', 'Как бы ты спроектировал систему уведомлений для 10M пользователей?', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'j-m-c1',
            title: 'Найти дубликат в массиве',
            description: 'Дан массив целых чисел длины n+1 со значениями от 1 до n. Ровно одно число повторяется. Найди его за O(n) времени и O(1) памяти.',
            starterCode: 'public class Solution {\n  public int findDuplicate(int[] nums) {\n    // твой код\n    return -1;\n  }\n}\n',
            language: 'java',
            hints: ['Алгоритм Флойда (tortoise & hare)', 'Массив можно трактовать как связный список индексов'],
          },
        ],
      },
      SENIOR: {
        questions: [
          q('j-s-1', 'Расскажи о системе, которую ты спроектировал с нуля.', 'soft', 'Soft'),
          q('j-s-2', 'Объясни модель памяти Java (JMM): happens-before, видимость, reordering.', 'theory', 'Многопоточность'),
          q('j-s-3', 'Как работает G1 GC? В чём отличия от ZGC и когда выбирать что?', 'theory', 'JVM'),
          q('j-s-4', 'Spring Boot vs. Quarkus vs. Micronaut — когда что выбрать под микросервисы?', 'practice', 'Архитектура'),
          q('j-s-5', 'Расскажи про event sourcing и CQRS: плюсы, минусы, когда применять.', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'j-s-c1',
            title: 'Ограничитель частоты запросов',
            description: 'Реализуй thread-safe класс RateLimiter(maxRequests, windowMillis) с методом boolean allow(String userId). Sliding window, O(1) амортизированно.',
            starterCode: 'public class RateLimiter {\n  public RateLimiter(int maxRequests, long windowMillis) {}\n  public boolean allow(String userId) { return true; }\n}\n',
            language: 'java',
            hints: ['ConcurrentHashMap + Deque<Long>', 'Подумай про lock striping'],
          },
        ],
      },
    },
  },

  python: {
    label: 'Python',
    grades: {
      JUNIOR: {
        questions: [
          q('p-j-1', 'Расскажи о себе и опыте с Python.', 'soft', 'Soft'),
          q('p-j-2', 'В чём разница между list, tuple и set?', 'theory', 'Core'),
          q('p-j-3', 'Что такое list comprehension? Приведи пример.', 'theory', 'Core'),
          q('p-j-4', 'Объясни разницу между is и ==.', 'theory', 'Core'),
          q('p-j-5', 'Что такое виртуальное окружение и зачем оно нужно?', 'theory', 'Tooling'),
        ],
        coding: [
          {
            id: 'p-j-c1',
            title: 'FizzBuzz',
            description: 'Функция fizzbuzz(n) возвращает список строк от 1 до n: кратные 3 → "Fizz", 5 → "Buzz", 15 → "FizzBuzz", иначе число строкой.',
            starterCode: 'def fizzbuzz(n):\n    # твой код\n    pass\n',
            language: 'python',
            hints: ['Проверяй кратность 15 первым', 'Используй list comprehension для элегантности'],
          },
        ],
      },
      MIDDLE: {
        questions: [
          q('p-m-1', 'Расскажи о проекте, которым гордишься.', 'soft', 'Soft'),
          q('p-m-2', 'Что такое GIL и как он влияет на многопоточность?', 'theory', 'Core'),
          q('p-m-3', 'Чем отличается asyncio от threading? Когда что использовать?', 'theory', 'Async'),
          q('p-m-4', 'Объясни декораторы. Напиши декоратор @timeit.', 'theory', 'Core'),
          q('p-m-5', 'Как бы ты спроектировал pipeline ETL для 100GB/день?', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'p-m-c1',
            title: 'Группировка анаграмм',
            description: 'Дан список строк. Сгруппируй анаграммы: ["eat","tea","tan","ate","nat","bat"] → [["eat","tea","ate"],["tan","nat"],["bat"]].',
            starterCode: 'def group_anagrams(words):\n    # твой код\n    pass\n',
            language: 'python',
            hints: ['Ключ словаря — отсортированная строка', 'defaultdict(list) упрощает код'],
          },
        ],
      },
      SENIOR: {
        questions: [
          q('p-s-1', 'Расскажи о самой сложной задаче в твоей карьере.', 'soft', 'Soft'),
          q('p-s-2', 'Как работает CPython под капотом: ref counting, GC, arena allocator?', 'theory', 'Internals'),
          q('p-s-3', 'Объясни дескрипторы и метаклассы. Приведи реальный кейс.', 'theory', 'Core'),
          q('p-s-4', 'Как ты отлаживаешь утечку памяти в долгоживущем Python-процессе?', 'practice', 'Performance'),
          q('p-s-5', 'Монолит на Django мигрируешь в микросервисы — с чего начнёшь?', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'p-s-c1',
            title: 'Топ-K частых элементов',
            description: 'Реализуй top_k_frequent(nums, k): вернуть k наиболее частых элементов. Лучше, чем O(n log n).',
            starterCode: 'def top_k_frequent(nums, k):\n    # твой код\n    pass\n',
            language: 'python',
            hints: ['Counter + heapq.nlargest', 'Bucket sort даёт O(n)'],
          },
        ],
      },
    },
  },

  php: {
    label: 'PHP',
    grades: {
      JUNIOR: {
        questions: [
          q('ph-j-1', 'Расскажи о себе и опыте с PHP.', 'soft', 'Soft'),
          q('ph-j-2', 'В чём разница между == и === в PHP?', 'theory', 'Core'),
          q('ph-j-3', 'Что такое Composer и autoload?', 'theory', 'Tooling'),
          q('ph-j-4', 'Объясни разницу между include и require.', 'theory', 'Core'),
          q('ph-j-5', 'Что такое суперглобалы ($_GET, $_POST, $_SESSION)?', 'theory', 'Core'),
        ],
        coding: [
          {
            id: 'ph-j-c1',
            title: 'Палиндром',
            description: 'Функция isPalindrome(string $s): bool — true, если строка читается одинаково в обе стороны. Игнорируй регистр и не-буквенные символы.',
            starterCode: '<?php\nfunction isPalindrome(string $s): bool {\n    // твой код\n    return false;\n}\n',
            language: 'php',
            hints: ['preg_replace для очистки', 'strtolower + strrev'],
          },
        ],
      },
      MIDDLE: {
        questions: [
          q('ph-m-1', 'Расскажи про проект на Laravel/Symfony, которым гордишься.', 'soft', 'Soft'),
          q('ph-m-2', 'Объясни, как работает service container в Laravel.', 'theory', 'Laravel'),
          q('ph-m-3', 'Чем отличаются late static binding и self::?', 'theory', 'Core'),
          q('ph-m-4', 'Как бороться с N+1 проблемой в Eloquent/Doctrine?', 'theory', 'ORM'),
          q('ph-m-5', 'Как спроектировать очередь задач для 1M задач в день?', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'ph-m-c1',
            title: 'Подсчёт встречаемости слов',
            description: 'Функция wordCount(string $text): array — вернуть ассоциативный массив слово => количество, отсортированный по убыванию частоты.',
            starterCode: '<?php\nfunction wordCount(string $text): array {\n    // твой код\n    return [];\n}\n',
            language: 'php',
            hints: ['preg_split по \\s+', 'array_count_values + arsort'],
          },
        ],
      },
      SENIOR: {
        questions: [
          q('ph-s-1', 'Расскажи про систему, которую ты масштабировал.', 'soft', 'Soft'),
          q('ph-s-2', 'Как работает OPcache и JIT в PHP 8+?', 'theory', 'Internals'),
          q('ph-s-3', 'Сравни Swoole и RoadRunner. Когда что выбрать?', 'theory', 'Performance'),
          q('ph-s-4', 'Как ты строишь DDD в Laravel-проекте: bounded contexts, слои, CQRS?', 'practice', 'Архитектура'),
          q('ph-s-5', 'Миграция legacy PHP 5.6 → PHP 8.3: стратегия, риски, метрики.', 'practice', 'Рефакторинг'),
        ],
        coding: [
          {
            id: 'ph-s-c1',
            title: 'Rate limiter (token bucket)',
            description: 'Реализуй class TokenBucket с методом public function consume(int $tokens = 1): bool. Параметры: $capacity, $refillPerSecond.',
            starterCode: '<?php\nclass TokenBucket {\n    public function __construct(int $capacity, float $refillPerSecond) {}\n    public function consume(int $tokens = 1): bool { return true; }\n}\n',
            language: 'php',
            hints: ['microtime(true) для дельты', 'Пересчитывай tokens ленивых на consume'],
          },
        ],
      },
    },
  },

  csharp: {
    label: 'C#',
    grades: {
      JUNIOR: {
        questions: [
          q('cs-j-1', 'Расскажи о себе и опыте с C#.', 'soft', 'Soft'),
          q('cs-j-2', 'В чём разница между class и struct?', 'theory', 'Core'),
          q('cs-j-3', 'Что такое boxing/unboxing?', 'theory', 'Core'),
          q('cs-j-4', 'Объясни разницу между IEnumerable и IQueryable.', 'theory', 'LINQ'),
          q('cs-j-5', 'Что такое nullable reference types (C# 8+)?', 'theory', 'Core'),
        ],
        coding: [
          {
            id: 'cs-j-c1',
            title: 'Факториал',
            description: 'Метод long Factorial(int n). Вернуть n! Обработать n < 0 и n = 0.',
            starterCode: 'public class Solution {\n    public long Factorial(int n) {\n        // твой код\n        return 0;\n    }\n}\n',
            language: 'csharp',
            hints: ['Проверка границ', 'Учти переполнение для n > 20'],
          },
        ],
      },
      MIDDLE: {
        questions: [
          q('cs-m-1', 'Расскажи про проект на .NET, которым гордишься.', 'soft', 'Soft'),
          q('cs-m-2', 'Async/await под капотом — state machine, SynchronizationContext, ConfigureAwait(false).', 'theory', 'Async'),
          q('cs-m-3', 'Что такое DI контейнер в ASP.NET Core? Разница Transient/Scoped/Singleton.', 'theory', 'ASP.NET'),
          q('cs-m-4', 'EF Core: lazy vs eager vs explicit loading.', 'theory', 'EF'),
          q('cs-m-5', 'Как ты бы спроектировал gRPC-сервис для high-throughput.', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'cs-m-c1',
            title: 'Первый уникальный символ в строке',
            description: 'Метод int FirstUniqChar(string s) — индекс первого неповторяющегося символа, или -1.',
            starterCode: 'public class Solution {\n    public int FirstUniqChar(string s) {\n        // твой код\n        return -1;\n    }\n}\n',
            language: 'csharp',
            hints: ['Dictionary<char,int> в два прохода', 'Для ASCII можно int[26]'],
          },
        ],
      },
      SENIOR: {
        questions: [
          q('cs-s-1', 'Расскажи про сложную систему, которую ты проектировал.', 'soft', 'Soft'),
          q('cs-s-2', 'Как работает GC в .NET: поколения, LOH, Server vs Workstation.', 'theory', 'Runtime'),
          q('cs-s-3', 'Span<T>, Memory<T>, ref struct — зачем и когда.', 'theory', 'Performance'),
          q('cs-s-4', 'Minimal APIs vs Controllers vs gRPC — trade-offs в крупных монолитах.', 'practice', 'ASP.NET'),
          q('cs-s-5', 'Event-driven архитектура на .NET: MassTransit, Kafka, outbox pattern.', 'practice', 'Архитектура'),
        ],
        coding: [
          {
            id: 'cs-s-c1',
            title: 'Consistent hash ring',
            description: 'Класс ConsistentHashRing с методами Add(string node), Remove(string node), string GetNode(string key). Поддержка виртуальных узлов.',
            starterCode: 'public class ConsistentHashRing {\n    public ConsistentHashRing(int virtualNodes = 100) {}\n    public void Add(string node) {}\n    public void Remove(string node) {}\n    public string GetNode(string key) => "";\n}\n',
            language: 'csharp',
            hints: ['SortedDictionary<uint,string>', 'MurmurHash или хотя бы MD5 как основа'],
          },
        ],
      },
    },
  },
};

export function getDirectionList() {
  return (Object.keys(MOCK_BANK) as Direction[]).map((slug) => ({
    slug,
    label: MOCK_BANK[slug].label,
  }));
}

export function pickSessionContent(direction: Direction, grade: Grade) {
  const bank = MOCK_BANK[direction]?.grades[grade];
  if (!bank) throw new Error(`No bank for ${direction}/${grade}`);
  return { questions: bank.questions, coding: bank.coding };
}