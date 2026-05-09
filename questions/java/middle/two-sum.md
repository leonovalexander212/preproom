---
id: java-mid-two-sum
title: Два слагаемых
difficulty: medium
language: java
---

# Описание

Дан массив целых чисел и целевая сумма. Найдите два индекса (0-based), значения по которым дают в сумме целевое число. Выведите два индекса через пробел (меньший первым). Гарантируется, что решение существует. Первая строка — массив через пробел, вторая — целевая сумма.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i]);
        }
        int target = Integer.parseInt(sc.nextLine().trim());
        int[] result = twoSum(nums, target);
        System.out.println(result[0] + " " + result[1]);
    }
}
```

# Тесты

```json
[
  {"stdin": "2 7 11 15\n9", "expected": "0 1"},
  {"stdin": "3 2 4\n6", "expected": "1 2"},
  {"stdin": "1 5 3 7\n8", "expected": "1 3"}
]
```
