---
id: cs-fizzbuzz
title: FizzBuzz
difficulty: easy
language: csharp
---

# Описание

Для заданного числа N выведите N строк: для кратных 3 — "Fizz", для кратных 5 — "Buzz", для кратных 15 — "FizzBuzz", иначе — само число.

# Стартовый код

```csharp
using System;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        for (int i = 1; i <= n; i++) {
            Console.WriteLine(FizzBuzz(i));
        }
    }

    static string FizzBuzz(int number) {
        // ваш код
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
