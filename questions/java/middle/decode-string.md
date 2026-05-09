---
id: java-mid-decode-string
title: Декодирование строки
difficulty: medium
language: java
---

# Описание

Декодируйте строку по правилу: число перед квадратными скобками означает количество повторений содержимого скобок. Поддерживается вложенность: "2[a3[b]]" превращается в "abbbabbb". Вход: закодированная строка. Выход: декодированная строка.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static String decodeString(String s) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(decodeString(s));
    }
}
```

# Тесты

```json
[
  {"stdin": "3[a]2[bc]", "expected": "aaabcbc"},
  {"stdin": "3[a2[c]]", "expected": "accaccacc"},
  {"stdin": "abc", "expected": "abc"},
  {"stdin": "2[abc]3[cd]ef", "expected": "abcabccdcdcdef"}
]
```
