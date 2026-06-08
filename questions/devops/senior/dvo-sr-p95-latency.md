---
id: dvo-sr-p95-latency
title: Перцентиль p95 латентности
difficulty: hard
language: python
---

# Описание

В первой строке N — число замеров. Далее N строк — значения латентности (целые, мс).

Выведи p95 методом nearest-rank: отсортируй значения по возрастанию и возьми элемент с рангом ceil(0.95 * N) (нумерация с 1).

# Стартовый код

```python
import math
n = int(input())
vals = sorted(int(input()) for _ in range(n))
# rank = ceil(0.95 * n); выведи vals[rank-1]
print(0)
```

# Тесты

```json
[
  {
    "stdin": "10\n10\n20\n30\n40\n50\n60\n70\n80\n90\n100",
    "expected": "100"
  },
  {
    "stdin": "5\n5\n3\n1\n4\n2",
    "expected": "5"
  },
  {
    "stdin": "20\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20",
    "expected": "19"
  },
  {
    "stdin": "8\n10\n20\n30\n40\n50\n60\n70\n80",
    "expected": "80"
  }
]
```
