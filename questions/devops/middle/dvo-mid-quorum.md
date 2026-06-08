---
id: dvo-mid-quorum
title: Кворум кластера
difficulty: medium
language: python
---

# Описание

Кластер из N узлов. В первой строке — N (всего узлов), во второй — U (число узлов в статусе UP).

Выведи HEALTHY, если живых узлов строго больше половины (U*2 > N), иначе DEGRADED.

# Стартовый код

```python
n = int(input())
up = int(input())
# выведи HEALTHY или DEGRADED
print("DEGRADED")
```

# Тесты

```json
[
  {
    "stdin": "3\n2",
    "expected": "HEALTHY"
  },
  {
    "stdin": "4\n2",
    "expected": "DEGRADED"
  },
  {
    "stdin": "5\n3",
    "expected": "HEALTHY"
  },
  {
    "stdin": "1\n0",
    "expected": "DEGRADED"
  },
  {
    "stdin": "7\n4",
    "expected": "HEALTHY"
  }
]
```
