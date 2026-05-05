---
id: java-palindrome
title: Палиндром
difficulty: medium
language: java
---

# Описание

На вход — строка. Выведи "true" если она палиндром (без учёта регистра), иначе "false".

# Стартовый код

```java
import java.util.Scanner;

public class Main {
    public static boolean isPalindrome(String s) {
        // твой код
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(isPalindrome(line) ? "true" : "false");
    }
}
```

# Тесты

```json
[
  {"stdin": "level", "expected": "true"},
  {"stdin": "Java", "expected": "false"},
  {"stdin": "AbBa", "expected": "true"},
  {"stdin": "x", "expected": "true"},
  {"stdin": "preproom", "expected": "false"}
]
```