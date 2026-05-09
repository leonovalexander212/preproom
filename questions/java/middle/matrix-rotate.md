---
id: java-mid-matrix-rotate
title: Поворот матрицы
difficulty: medium
language: java
---

# Описание

Дана квадратная матрица NxN. Поверните её на 90 градусов по часовой стрелке. Вход: N строк, каждая содержит N целых чисел через пробел. Выход: повёрнутая матрица в том же формате.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int[][] rotate(int[][] matrix) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<int[]> rows = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) break;
            rows.add(Arrays.stream(line.split(" ")).mapToInt(Integer::parseInt).toArray());
        }
        int[][] matrix = rows.toArray(new int[0][]);
        int[][] result = rotate(matrix);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append("\n");
            for (int j = 0; j < result[i].length; j++) {
                if (j > 0) sb.append(" ");
                sb.append(result[i][j]);
            }
        }
        System.out.println(sb.toString());
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
