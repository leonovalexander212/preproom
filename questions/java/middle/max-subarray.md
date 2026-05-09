---
id: java-mid-max-subarray
title: Максимальный подмассив
difficulty: medium
language: java
---

# Описание

Найдите максимальную сумму непрерывного подмассива (алгоритм Кадане). Вход: массив целых чисел через пробел. Выход: максимальная сумма подмассива.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        System.out.println(maxSubArray(nums));
    }
}
```

# Тесты

```json
[
  {"stdin": "-2 1 -3 4 -1 2 1 -5 4", "expected": "6"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "-1 -2 -3", "expected": "-1"},
  {"stdin": "5 -3 5", "expected": "7"}
]
```
