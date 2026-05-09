---
id: java-sr-word-break
title: Разбиение строки
difficulty: hard
language: java
---

# Описание

Определите, можно ли разбить строку на слова из заданного словаря. Каждое слово из словаря можно использовать многократно. Первая строка — строка для разбиения, вторая — слова словаря через пробел. Выведите "true" или "false".

# Стартовый код

```java
import java.util.*;

public class Main {
    public static boolean wordBreak(String s, Set<String> dict) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        String[] words = sc.nextLine().trim().split(" ");
        Set<String> dict = new HashSet<>(Arrays.asList(words));
        System.out.println(wordBreak(s, dict));
    }
}
```

# Тесты

```json
[
  {"stdin": "leetcode\nleet code", "expected": "true"},
  {"stdin": "applepenapple\napple pen", "expected": "true"},
  {"stdin": "catsandog\ncats dog sand and cat", "expected": "false"}
]
```
