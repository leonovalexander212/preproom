---
id: cs-sr-coin-change
title: Размен монет
difficulty: hard
language: csharp
---

# Описание

Дан набор номиналов монет и целевая сумма. Найдите минимальное количество монет, необходимое для набора данной суммы. Каждый номинал можно использовать неограниченное число раз. Если сумму набрать невозможно, выведите -1.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var coins = Console.ReadLine().Split().Select(int.Parse).ToArray();
        int amount = int.Parse(Console.ReadLine());
        // ваш код
        Console.WriteLine(result);
    }
}
```

# Тесты

```json
[
  {"stdin": "1 5 10\n11", "expected": "2"},
  {"stdin": "2\n3", "expected": "-1"},
  {"stdin": "1\n0", "expected": "0"},
  {"stdin": "1 2 5\n11", "expected": "3"}
]
```