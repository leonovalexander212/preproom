---
id: java-sr-merge-intervals
title: Слияние интервалов
difficulty: hard
language: java
---

# Описание

Дан набор интервалов. Объедините все пересекающиеся интервалы и выведите результат. Первая строка — количество интервалов N, затем N строк "start end". Выведите объединённые интервалы отсортированными, по одному на строку.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int[][] mergeIntervals(int[][] intervals) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            intervals[i][0] = Integer.parseInt(parts[0]);
            intervals[i][1] = Integer.parseInt(parts[1]);
        }
        int[][] result = mergeIntervals(intervals);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append("\n");
            sb.append(result[i][0] + " " + result[i][1]);
        }
        System.out.println(sb.toString());
    }
}
```

# Тесты

```json
[
  {"stdin": "3\n1 3\n2 6\n8 10", "expected": "1 6\n8 10"},
  {"stdin": "2\n1 4\n4 5", "expected": "1 5"},
  {"stdin": "1\n1 1", "expected": "1 1"},
  {"stdin": "3\n1 4\n0 4\n3 5", "expected": "0 5"}
]
```
