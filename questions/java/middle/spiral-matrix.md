---
id: java-mid-spiral-matrix
title: Спиральный обход матрицы
difficulty: medium
language: java
---

# Описание

Выведите элементы матрицы в спиральном порядке (по часовой стрелке, начиная с верхнего левого угла). Первая строка ввода — "R C" (число строк и столбцов), затем R строк матрицы. Выведите элементы через пробел.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static List<Integer> spiralOrder(int[][] matrix) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] dims = sc.nextLine().trim().split(" ");
        int R = Integer.parseInt(dims[0]);
        int C = Integer.parseInt(dims[1]);
        int[][] matrix = new int[R][C];
        for (int i = 0; i < R; i++) {
            String[] row = sc.nextLine().trim().split(" ");
            for (int j = 0; j < C; j++) {
                matrix[i][j] = Integer.parseInt(row[j]);
            }
        }
        List<Integer> result = spiralOrder(matrix);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(result.get(i));
        }
        System.out.println(sb.toString());
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
