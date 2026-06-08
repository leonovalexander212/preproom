---
id: dvo-sr-error-rate-top
title: Эндпоинт с худшим error rate
difficulty: hard
language: python
---

# Описание

В первой строке N — число запросов в логе. Далее N строк `эндпоинт статус` (статус — целое). Серверной ошибкой считается статус ≥ 500.

Для каждого эндпоинта посчитай долю ошибок (число ошибок / число запросов). Выведи эндпоинт с наибольшей долей ошибок; при равенстве — лексикографически меньший.

# Стартовый код

```python
from collections import defaultdict
n = int(input())
total = defaultdict(int)
errors = defaultdict(int)
for _ in range(n):
    ep, st = input().split()
    # учти запрос и ошибку (статус >= 500)
# выбери эндпоинт с макс. долей (тай-брейк по имени)
print("")
```

# Тесты

```json
[
  {
    "stdin": "5\n/api 200\n/api 500\n/users 200\n/users 200\n/users 503",
    "expected": "/api"
  },
  {
    "stdin": "4\n/a 500\n/a 500\n/b 200\n/b 500",
    "expected": "/a"
  },
  {
    "stdin": "3\n/x 200\n/y 200\n/z 200",
    "expected": "/x"
  },
  {
    "stdin": "4\n/z 500\n/z 500\n/a 500\n/a 200",
    "expected": "/z"
  }
]
```
