---
id: dvo-mid-hpa-replicas
title: Желаемые реплики HPA
difficulty: medium
language: python
---

# Описание

Формула автоскейлера HPA. В строках: текущее число реплик, текущее значение метрики, целевое значение метрики (все целые, например загрузка CPU в %).

Выведи желаемое число реплик = ceil(текущие_реплики * текущая_метрика / целевая_метрика).

# Стартовый код

```python
import math
cur = int(input())
metric = int(input())
target = int(input())
# выведи ceil(cur * metric / target)
print(0)
```

# Тесты

```json
[
  {
    "stdin": "3\n90\n60",
    "expected": "5"
  },
  {
    "stdin": "4\n50\n50",
    "expected": "4"
  },
  {
    "stdin": "2\n100\n40",
    "expected": "5"
  },
  {
    "stdin": "10\n30\n60",
    "expected": "5"
  },
  {
    "stdin": "1\n80\n80",
    "expected": "1"
  }
]
```
