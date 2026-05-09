---
id: cs-sr-prefix-count
title: Поиск по префиксу
difficulty: hard
language: csharp
---

# Описание

Дан список слов и список запросов-префиксов. Для каждого префикса подсчитайте, сколько слов из списка начинаются с этого префикса. Реализуйте эффективное решение с использованием префиксного дерева (trie).

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        var words = new string[n];
        for (int i = 0; i < n; i++)
            words[i] = Console.ReadLine();

        int q = int.Parse(Console.ReadLine());
        var results = new List<int>();

        for (int i = 0; i < q; i++) {
            string prefix = Console.ReadLine();
            // ваш код
        }

        Console.WriteLine(string.Join("\n", results));
    }
}
```

# Тесты

```json
[
  {"stdin": "5\napple\napp\napricot\nbanana\nband\n3\nap\nban\nz", "expected": "3\n2\n0"},
  {"stdin": "2\nhello\nhelp\n1\nhel", "expected": "2"}
]
```