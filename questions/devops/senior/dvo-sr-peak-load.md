---
id: dvo-sr-peak-load
title: Пиковая нагрузка в окне
difficulty: hard
language: python
---

# Описание

В первой строке — длина окна W (секунды). Во второй — N (число запросов). Далее N строк — времена запросов (целые секунды).

Выведи максимальное число запросов, попадающих в любое окно длины W (полуинтервал [t, t+W) с началом в одной из меток запросов).

# Стартовый код

```python
from bisect import bisect_left
w = int(input())
n = int(input())
ts = sorted(int(input()) for _ in range(n))
best = 0
# для каждой метки посчитай число запросов в [ts[i], ts[i]+w)
print(best)
```

# Тесты

```json
[
  {
    "stdin": "5\n6\n0\n1\n2\n10\n11\n12",
    "expected": "3"
  },
  {
    "stdin": "10\n5\n0\n1\n2\n3\n4",
    "expected": "5"
  },
  {
    "stdin": "1\n4\n5\n5\n5\n5",
    "expected": "4"
  },
  {
    "stdin": "2\n6\n0\n1\n2\n3\n4\n5",
    "expected": "2"
  }
]
```
