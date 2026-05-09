---
id: java-mid-longest-unique-substr
title: Подстрока без повторов
difficulty: medium
language: java
---

# Описание

Найдите длину наибольшей подстроки без повторяющихся символов. Вход: строка. Выход: длина наибольшей подстроки без повторов.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(lengthOfLongestSubstring(s));
    }
}
```

# Тесты

```json
[
  {"stdin": "abcabcbb", "expected": "3"},
  {"stdin": "bbbbb", "expected": "1"},
  {"stdin": "pwwkew", "expected": "3"},
  {"stdin": "a", "expected": "1"},
  {"stdin": "abcdef", "expected": "6"}
]
```
