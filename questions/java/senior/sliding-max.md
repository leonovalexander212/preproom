---
id: java-sr-sliding-max
title: Максимум в скользящем окне
difficulty: hard
language: java
---

# Описание

Дан массив целых чисел и размер окна K. Для каждой позиции скользящего окна найдите максимальный элемент. Первая строка — массив через пробел, вторая — размер окна K. Выведите максимумы через пробел.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int[] slidingMax(int[] nums, int k) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        int k = Integer.parseInt(sc.nextLine().trim());
        int[] result = slidingMax(nums, k);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(result[i]);
        }
        System.out.println(sb.toString());
    }
}
```

# Тесты

```json
[
  {"stdin": "1 3 -1 -3 5 3 6 7\n3", "expected": "3 3 5 5 6 7"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "1 -1\n1", "expected": "1 -1"},
  {"stdin": "9 8 7 6 5\n2", "expected": "9 8 7 6"}
]
```
