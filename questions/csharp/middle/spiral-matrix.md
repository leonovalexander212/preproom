---
id: cs-mid-spiral-matrix
title: Спиральный обход матрицы
difficulty: medium
language: csharp
---

# Описание

Дана матрица размером R x C. Выведите все элементы матрицы в порядке спирального обхода (по часовой стрелке, начиная с левого верхнего угла).

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int[] dims = Console.ReadLine().Split(' ').Select(int.Parse).ToArray();
        int rows = dims[0], cols = dims[1];
        int[,] matrix = new int[rows, cols];
        for (int i = 0; i < rows; i++) {
            int[] row = Console.ReadLine().Split(' ').Select(int.Parse).ToArray();
            for (int j = 0; j < cols; j++)
                matrix[i, j] = row[j];
        }
        Console.WriteLine(string.Join(" ", SpiralOrder(matrix, rows, cols)));
    }

    static List<int> SpiralOrder(int[,] matrix, int rows, int cols) {
        // ваш код
    }
}
```

# Тесты

```json
[
  {"stdin": "2 3\n1 2 3\n4 5 6", "expected": "1 2 3 6 5 4"},
  {"stdin": "3 3\n1 2 3\n4 5 6\n7 8 9", "expected": "1 2 3 6 9 8 7 4 5"},
  {"stdin": "1 1\n42", "expected": "42"}
]
```