---
id: dvo-mid-parse-duration
title: Парсинг длительности
difficulty: medium
language: python
---

# Описание

Дана длительность из компонентов часов/минут/секунд, например `1h30m`, `90m`, `2h`, `45s`, `1h30m15s`.

Выведи суммарное число секунд.

# Стартовый код

```python
import re
s = input().strip()
total = 0
# разбери компоненты: число + h/m/s
print(total)
```

# Тесты

```json
[
  {
    "stdin": "1h30m",
    "expected": "5400"
  },
  {
    "stdin": "90m",
    "expected": "5400"
  },
  {
    "stdin": "2h",
    "expected": "7200"
  },
  {
    "stdin": "45s",
    "expected": "45"
  },
  {
    "stdin": "1h30m15s",
    "expected": "5415"
  }
]
```
