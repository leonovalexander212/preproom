---
id: cs-sr-shortest-path
title: Кратчайший путь в графе
difficulty: hard
language: csharp
---

# Описание

Найдите кратчайший путь между двумя вершинами в невзвешенном неориентированном графе с помощью BFS. Выведите длину кратчайшего пути или -1, если путь не существует.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var nm = Console.ReadLine().Split().Select(int.Parse).ToArray();
        int n = nm[0], m = nm[1];
        var adj = new List<List<int>>();
        for (int i = 0; i <= n; i++) adj.Add(new List<int>());

        for (int i = 0; i < m; i++) {
            var e = Console.ReadLine().Split().Select(int.Parse).ToArray();
            adj[e[0]].Add(e[1]);
            adj[e[1]].Add(e[0]);
        }

        var se = Console.ReadLine().Split().Select(int.Parse).ToArray();
        int start = se[0], end = se[1];
        // ваш код
        Console.WriteLine(result);
    }
}
```

# Тесты

```json
[
  {"stdin": "4 4\n1 2\n2 3\n3 4\n1 3\n1 4", "expected": "2"},
  {"stdin": "3 1\n1 2\n1 3", "expected": "-1"},
  {"stdin": "2 1\n1 2\n1 2", "expected": "1"}
]
```