---
id: cs-sr-lru-cache
title: LRU-кэш
difficulty: hard
language: csharp
---

# Описание

Реализуйте LRU-кэш (Least Recently Used) с операциями get и put. При превышении ёмкости кэша удаляется наименее недавно использованный элемент. Операция get возвращает значение по ключу или -1, если ключ отсутствует.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int capacity = int.Parse(Console.ReadLine());
        int n = int.Parse(Console.ReadLine());
        var cache = new Dictionary<int, LinkedListNode<(int key, int val)>>();
        var order = new LinkedList<(int key, int val)>();
        var results = new List<string>();

        for (int i = 0; i < n; i++) {
            var parts = Console.ReadLine().Split();
            if (parts[0] == "get") {
                int key = int.Parse(parts[1]);
                // ваш код
            } else {
                int key = int.Parse(parts[1]);
                int val = int.Parse(parts[2]);
                // ваш код
            }
        }

        Console.WriteLine(string.Join("\n", results));
    }
}
```

# Тесты

```json
[
  {"stdin": "2\n5\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2", "expected": "1\n-1"},
  {"stdin": "1\n4\nput 1 10\nget 1\nput 2 20\nget 1", "expected": "10\n-1"},
  {"stdin": "2\n6\nput 1 1\nput 2 2\nput 1 10\nget 1\nget 2\nget 3", "expected": "10\n2\n-1"},
  {"stdin": "3\n5\nput 1 1\nput 2 2\nput 3 3\nget 1\nget 2", "expected": "1\n2"}
]
```