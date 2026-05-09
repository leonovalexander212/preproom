---
id: cs-sr-lis
title: Наибольшая возрастающая подпоследовательность
difficulty: hard
language: csharp
---

# Описание

Найдите длину наибольшей строго возрастающей подпоследовательности в массиве целых чисел. Подпоследовательность сохраняет порядок элементов, но элементы не обязаны идти подряд.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var nums = Console.ReadLine().Split().Select(int.Parse).ToArray();
        // ваш код
        Console.WriteLine(result);
    }
}
```

# Тесты

```json
[
  {"stdin": "10 9 2 5 3 7 101 18", "expected": "4"},
  {"stdin": "0 1 0 3 2 3", "expected": "4"},
  {"stdin": "7 7 7 7", "expected": "1"},
  {"stdin": "1 2 3 4 5", "expected": "5"}
]
```