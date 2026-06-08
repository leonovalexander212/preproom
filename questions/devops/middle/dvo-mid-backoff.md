---
id: dvo-mid-backoff
title: Экспоненциальный backoff
difficulty: medium
language: python
---

# Описание

Экспоненциальный backoff с потолком. В строках: base (базовая задержка), factor (множитель), attempts (число попыток), cap (потолок) — все целые.

Выведи задержки через пробел: задержка i-й попытки = min(base * factor^i, cap), i от 0 до attempts-1.

# Стартовый код

```python
base = int(input())
factor = int(input())
attempts = int(input())
cap = int(input())
delays = []
# delays[i] = min(base * factor**i, cap)
print(" ".join(map(str, delays)))
```

# Тесты

```json
[
  {
    "stdin": "100\n2\n5\n1000",
    "expected": "100 200 400 800 1000"
  },
  {
    "stdin": "1\n3\n4\n1000",
    "expected": "1 3 9 27"
  },
  {
    "stdin": "500\n2\n3\n600",
    "expected": "500 600 600"
  },
  {
    "stdin": "50\n10\n3\n100000",
    "expected": "50 500 5000"
  }
]
```
