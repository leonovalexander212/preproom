---
id: java-mid-binary-search
title: Бинарный поиск
difficulty: medium
language: java
---

# Описание

Дан отсортированный массив целых чисел и целевое значение. Найдите индекс целевого значения в массиве (0-based). Если элемент не найден, верните -1. Первая строка ввода — массив через пробел, вторая — целевое значение.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int binarySearch(int[] arr, int target) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            arr[i] = Integer.parseInt(parts[i]);
        }
        int target = Integer.parseInt(sc.nextLine().trim());
        System.out.println(binarySearch(arr, target));
    }
}
```

# Тесты

```json
[
  {"stdin": "1 3 5 7 9\n5", "expected": "2"},
  {"stdin": "1 3 5 7 9\n6", "expected": "-1"},
  {"stdin": "10\n10", "expected": "0"},
  {"stdin": "1 2 3 4 5 6 7 8 9 10\n1", "expected": "0"}
]
```
