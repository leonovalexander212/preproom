---
id: cs-mid-matrix-rotate
title: Поворот матрицы
difficulty: medium
language: csharp
---

# Описание

Дана квадратная матрица NxN. Поверните её на 90 градусов по часовой стрелке и выведите результат.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var lines = new List<string>();
        string s;
        while ((s = Console.ReadLine()) != null) lines.Add(s);
        int n = lines.Count;
        int[,] matrix = new int[n, n];
        for (int i = 0; i < n; i++) {
            int[] row = lines[i].Split(' ').Select(int.Parse).ToArray();
            for (int j = 0; j < n; j++) matrix[i, j] = row[j];
        }
        int[,] rotated = Rotate90(matrix, n);
        for (int i = 0; i < n; i++) {
            var row = new List<string>();
            for (int j = 0; j < n; j++) row.Add(rotated[i, j].ToString());
            Console.WriteLine(string.Join(" ", row));
        }
    }

    static int[,] Rotate90(int[,] matrix, int n) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "1 2\n3 4", "expected": "3 1\n4 2"},
  {"stdin": "1 2 3\n4 5 6\n7 8 9", "expected": "7 4 1\n8 5 2\n9 6 3"},
  {"stdin": "1", "expected": "1"}
]
```
