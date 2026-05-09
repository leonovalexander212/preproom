---
id: java-mid-rotate-array
title: Ротация массива
difficulty: medium
language: java
---

# Описание

Выполните циклический сдвиг массива вправо на K позиций. Первая строка — массив целых чисел через пробел, вторая — число K. Выведите массив после ротации через пробел.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int[] rotateArray(int[] arr, int k) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            arr[i] = Integer.parseInt(parts[i]);
        }
        int k = Integer.parseInt(sc.nextLine().trim());
        int[] result = rotateArray(arr, k);
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
  {"stdin": "1 2 3 4 5\n2", "expected": "4 5 1 2 3"},
  {"stdin": "1 2 3\n1", "expected": "3 1 2"},
  {"stdin": "1\n5", "expected": "1"},
  {"stdin": "1 2 3 4\n4", "expected": "1 2 3 4"}
]
```
