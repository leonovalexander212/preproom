---
id: py-reverse-string
title: Реверс строки
difficulty: easy
language: python
---

# Описание

На вход — одна строка. Выведи её перевёрнутой. Пустая строка остаётся пустой.

# Стартовый код

```python
def reverse_str(s: str) -> str:
    # твой код
    return s

print(reverse_str(input()))
```

# Тесты

```json
[
  {"stdin": "hello", "expected": "olleh"},
  {"stdin": "a", "expected": "a"},
  {"stdin": "PrepRoom", "expected": "mooRperP"},
  {"stdin": "12345", "expected": "54321"}
]
```