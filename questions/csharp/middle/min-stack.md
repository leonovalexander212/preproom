---
id: cs-mid-min-stack
title: Стек с минимумом
difficulty: medium
language: csharp
---

# Описание

Реализуйте стек, поддерживающий операции push, pop и min (получение текущего минимума) за O(1). Для каждой операции "min" выведите текущий минимальный элемент стека.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        var stack = new Stack<int>();
        var minStack = new Stack<int>();
        for (int i = 0; i < n; i++) {
            string line = Console.ReadLine();
            if (line.StartsWith("push")) {
                int val = int.Parse(line.Split(' ')[1]);
                // ваш код — push
            } else if (line == "pop") {
                // ваш код — pop
            } else if (line == "min") {
                // ваш код — min
            }
        }
    }
}
```

# Тесты

```json
[
  {"stdin": "5\npush 3\npush 5\nmin\npush 1\nmin", "expected": "3\n1"},
  {"stdin": "3\npush 10\npush 20\nmin", "expected": "10"},
  {"stdin": "6\npush 2\npush 1\nmin\npop\nmin\npop", "expected": "1\n2"}
]
```