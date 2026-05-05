---
id: java-reverse-string
title: Реверс строки
difficulty: easy
language: java
---

# Описание

Прочитай одну строку и выведи её перевёрнутой. Без `StringBuilder.reverse()`.

# Стартовый код

```java
import java.util.Scanner;

public class Main {
    public static String reverse(String s) {
        // твой код
        return s;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(reverse(line));
    }
}
```

# Тесты

```json
[
  {"stdin": "hello", "expected": "olleh"},
  {"stdin": "a", "expected": "a"},
  {"stdin": "Java", "expected": "avaJ"},
  {"stdin": "12345", "expected": "54321"}
]
```