---
id: cs-sr-topo-sort
title: Топологическая сортировка
difficulty: hard
language: csharp
---

# Описание

Выполните топологическую сортировку направленного графа алгоритмом Кана. Для детерминированного порядка используйте SortedSet, чтобы вершины с меньшим номером шли первыми. Если граф содержит цикл, выведите "CYCLE".

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
        var indegree = new int[n + 1];
        for (int i = 0; i <= n; i++) adj.Add(new List<int>());

        for (int i = 0; i < m; i++) {
            var e = Console.ReadLine().Split().Select(int.Parse).ToArray();
            adj[e[0]].Add(e[1]);
            indegree[e[1]]++;
        }

        // ваш код
        Console.WriteLine(result);
    }
}
```

# Тесты

```json
[
  {"stdin": "4 3\n1 2\n1 3\n3 4", "expected": "1 2 3 4"},
  {"stdin": "3 2\n3 1\n3 2", "expected": "3 1 2"},
  {"stdin": "2 2\n1 2\n2 1", "expected": "CYCLE"}
]
```