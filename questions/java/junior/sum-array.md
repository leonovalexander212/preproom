---
id: java-sum-array
title: Сумма чисел
difficulty: easy
language: java
---

# Описание

На первой строке — N. На второй — N целых чисел через пробел. Выведи их сумму.

# Стартовый код

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        // твой код
        System.out.println(sum);
    }
}
```

# Тесты

```json
[
  {"stdin": "3\n1 2 3", "expected": "6"},
  {"stdin": "1\n42", "expected": "42"},
  {"stdin": "4\n10 20 30 40", "expected": "100"},
  {"stdin": "5\n-1 -2 -3 -4 -5", "expected": "-15"}
]
```