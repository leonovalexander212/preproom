---
id: cs-sr-top-k-frequent
title: Top-K частых элементов
difficulty: hard
language: csharp
---

# Описание

Найдите K наиболее часто встречающихся элементов в массиве целых чисел. Результат выведите в порядке убывания частоты; при одинаковой частоте меньший элемент идёт первым.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var nums = Console.ReadLine().Split().Select(int.Parse).ToArray();
        int k = int.Parse(Console.ReadLine());
        // ваш код
        Console.WriteLine(string.Join(" ", result));
    }
}
```

# Тесты

```json
[
  {"stdin": "1 1 1 2 2 3\n2", "expected": "1 2"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "4 4 4 1 1 2 2 2\n2", "expected": "4 2"}
]
```