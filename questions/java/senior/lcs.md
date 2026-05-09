---
id: java-sr-lcs
title: Наибольшая общая подпоследовательность
difficulty: hard
language: java
---

# Описание

Найдите длину наибольшей общей подпоследовательности (LCS) двух строк. Подпоследовательность — это последовательность символов, полученная удалением некоторых (возможно нуля) символов без изменения порядка оставшихся. Первая строка — s1, вторая — s2. Выведите длину LCS.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int lcs(String s1, String s2) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.nextLine();
        String s2 = sc.nextLine();
        System.out.println(lcs(s1, s2));
    }
}
```

# Тесты

```json
[
  {"stdin": "abcde\nace", "expected": "3"},
  {"stdin": "abc\nabc", "expected": "3"},
  {"stdin": "abc\ndef", "expected": "0"},
  {"stdin": "abcd\naecbd", "expected": "3"}
]
```
