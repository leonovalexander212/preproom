---
id: py-fizzbuzz
title: FizzBuzz
difficulty: easy
language: python
---

# Описание

Прочитай число N. Выведи N строк: для кратных 3 → "Fizz", 5 → "Buzz", 15 → "FizzBuzz", иначе само число.

# Стартовый код

```python
def fizzbuzz(n: int):
    # твой код
    for i in range(1, n + 1):
        print(i)

fizzbuzz(int(input()))
```

# Тесты

```json
[
  {"stdin": "5", "expected": "1\n2\nFizz\n4\nBuzz"},
  {"stdin": "3", "expected": "1\n2\nFizz"},
  {"stdin": "15", "expected": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz"}
]
```