---
id: java-fizzbuzz
title: FizzBuzz
difficulty: easy
language: java
---

# Описание

Прочитай N. Выведи N строк: 3→Fizz, 5→Buzz, 15→FizzBuzz, иначе число.

# Стартовый код

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        StringBuilder out = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            // твой код
            out.append(i);
            if (i < n) out.append('\n');
        }
        System.out.println(out.toString());
    }
}
```

# Тесты

```json
[
  {"stdin": "5", "expected": "1\n2\nFizz\n4\nBuzz"},
  {"stdin": "3", "expected": "1\n2\nFizz"},
  {"stdin": "15", "expected": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz"}
]
```