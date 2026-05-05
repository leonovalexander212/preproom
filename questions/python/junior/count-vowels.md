---
id: py-count-vowels
title: Подсчёт гласных
difficulty: medium
language: python
---

# Описание

На вход — строка из ASCII-символов. Подсчитай количество гласных (a, e, i, o, u в любом регистре). Выведи число.

# Стартовый код

```python
def count_vowels(s: str) -> int:
    # твой код
    return 0

print(count_vowels(input()))
```

# Тесты

```json
[
  {"stdin": "hello", "expected": "2"},
  {"stdin": "PYTHON", "expected": "1"},
  {"stdin": "aeiou", "expected": "5"},
  {"stdin": "xyz", "expected": "0"},
  {"stdin": "PrepRoom", "expected": "3"}
]
```