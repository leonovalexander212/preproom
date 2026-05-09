---
id: java-sr-top-k-frequent
title: Top-K частых элементов
difficulty: hard
language: java
---

# Описание

Найдите K самых частых элементов в массиве. Выведите их в порядке убывания частоты. При одинаковой частоте меньший элемент идёт первым. Первая строка — массив через пробел, вторая — число K. Выведите K элементов через пробел.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static List<Integer> topKFrequent(int[] nums, int k) {
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
        List<Integer> result = topKFrequent(nums, k);
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
  {"stdin": "1 1 1 2 2 3\n2", "expected": "1 2"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "4 4 4 1 1 2 2 2\n2", "expected": "4 2"}
]
```
