---
id: java-mid-merge-sorted
title: Слияние отсортированных массивов
difficulty: medium
language: java
---

# Описание

Даны два отсортированных массива целых чисел. Объедините их в один отсортированный массив. Первая строка — первый массив через пробел (может быть пустой), вторая — второй массив. Выведите результат через пробел.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int[] mergeSorted(int[] a, int[] b) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line1 = sc.nextLine().trim();
        String line2 = sc.nextLine().trim();
        int[] a = line1.isEmpty() ? new int[0] : Arrays.stream(line1.split(" ")).mapToInt(Integer::parseInt).toArray();
        int[] b = line2.isEmpty() ? new int[0] : Arrays.stream(line2.split(" ")).mapToInt(Integer::parseInt).toArray();
        int[] result = mergeSorted(a, b);
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
  {"stdin": "1 3 5\n2 4 6", "expected": "1 2 3 4 5 6"},
  {"stdin": "1\n2", "expected": "1 2"},
  {"stdin": "1 2 3\n", "expected": "1 2 3"},
  {"stdin": "\n4 5 6", "expected": "4 5 6"}
]
```
