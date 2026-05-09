---
id: java-mid-anagram-check
title: Проверка анаграмм
difficulty: medium
language: java
---

# Описание

Даны две строки. Определите, являются ли они анаграммами друг друга (без учёта регистра). Первая строка — первое слово, вторая строка — второе слово. Выведите "true" или "false".

# Стартовый код

```java
import java.util.*;

public class Main {
    public static boolean isAnagram(String s1, String s2) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.nextLine();
        String s2 = sc.nextLine();
        System.out.println(isAnagram(s1, s2));
    }
}
```

# Тесты

```json
[
  {"stdin": "listen\nsilent", "expected": "true"},
  {"stdin": "Hello\nWorld", "expected": "false"},
  {"stdin": "abc\ncba", "expected": "true"},
  {"stdin": "a\na", "expected": "true"}
]
```
