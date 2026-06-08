---
id: dvo-jr-status-errors
title: Подсчёт ошибочных ответов
difficulty: easy
language: python
---

# Описание

Балансировщик записал N кодов HTTP-ответов. Прочитайте число N, затем N кодов статусов (по одному в строке). Выведите количество ошибочных ответов — это коды 4xx и 5xx (то есть код >= 400).

# Стартовый код

```python
def main():
    n = int(input())
    errors = 0
    for _ in range(n):
        code = int(input())
        # увеличьте errors, если код >= 400
        pass
    print(errors)

main()
```

# Тесты

```json
[
  {
    "stdin": "5\n200\n404\n500\n301\n200",
    "expected": "2"
  },
  {
    "stdin": "3\n200\n200\n200",
    "expected": "0"
  },
  {
    "stdin": "4\n400\n403\n404\n500",
    "expected": "4"
  },
  {
    "stdin": "1\n302",
    "expected": "0"
  }
]
```
