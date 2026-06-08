---
id: dvo-mid-replica-spread
title: Распределение реплик по зонам
difficulty: medium
language: python
---

# Описание

В первой строке R — число реплик, во второй — Z — число зон.

Распредели реплики по зонам максимально равномерно (topology spread): первые (R mod Z) зон получают по ceil(R/Z), остальные — по floor(R/Z).

Выведи числа реплик по зонам через пробел, по убыванию.

# Стартовый код

```python
r = int(input())
z = int(input())
base = r // z
extra = r % z
counts = []
# первые extra зон: base+1, остальные: base
print(" ".join(map(str, counts)))
```

# Тесты

```json
[
  {
    "stdin": "7\n3",
    "expected": "3 2 2"
  },
  {
    "stdin": "6\n3",
    "expected": "2 2 2"
  },
  {
    "stdin": "10\n4",
    "expected": "3 3 2 2"
  },
  {
    "stdin": "5\n1",
    "expected": "5"
  },
  {
    "stdin": "2\n5",
    "expected": "1 1 0 0 0"
  }
]
```
