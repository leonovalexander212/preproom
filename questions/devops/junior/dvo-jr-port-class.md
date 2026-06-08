---
id: dvo-jr-port-class
title: Категория порта
difficulty: easy
language: python
---

# Описание

Прочитайте номер порта (0-65535). Выведите его категорию: well-known (0-1023), registered (1024-49151) или dynamic (49152-65535).

# Стартовый код

```python
port = int(input())
# определите категорию и выведите её
print("")
```

# Тесты

```json
[
  {
    "stdin": "80",
    "expected": "well-known"
  },
  {
    "stdin": "8080",
    "expected": "registered"
  },
  {
    "stdin": "1023",
    "expected": "well-known"
  },
  {
    "stdin": "1024",
    "expected": "registered"
  },
  {
    "stdin": "49152",
    "expected": "dynamic"
  },
  {
    "stdin": "65535",
    "expected": "dynamic"
  }
]
```
