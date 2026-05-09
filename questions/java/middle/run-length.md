---
id: java-mid-run-length
title: RLE-кодирование
difficulty: medium
language: java
---

# Описание

Выполните кодирование длин серий (Run-Length Encoding) для строки. Каждая группа подряд идущих одинаковых символов заменяется на символ и количество повторений. Например, "aaabbc" превращается в "a3b2c1". Вход: строка. Выход: закодированная строка.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static String runLengthEncode(String s) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(runLengthEncode(s));
    }
}
```

# Тесты

```json
[
  {"stdin": "aaabbc", "expected": "a3b2c1"},
  {"stdin": "a", "expected": "a1"},
  {"stdin": "aaa", "expected": "a3"},
  {"stdin": "abcd", "expected": "a1b1c1d1"},
  {"stdin": "aabbbcccc", "expected": "a2b3c4"}
]
```
