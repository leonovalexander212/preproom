---
id: java-sr-lis
title: Наибольшая возрастающая подпоследовательность
difficulty: hard
language: java
---

# Описание

Найдите длину наибольшей строго возрастающей подпоследовательности массива. Вход: массив целых чисел через пробел. Выход: длина LIS.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int lis(int[] nums) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        System.out.println(lis(nums));
    }
}
```

# Тесты

```json
[
  {"stdin": "10 9 2 5 3 7 101 18", "expected": "4"},
  {"stdin": "0 1 0 3 2 3", "expected": "4"},
  {"stdin": "7 7 7 7", "expected": "1"},
  {"stdin": "1 2 3 4 5", "expected": "5"}
]
```
