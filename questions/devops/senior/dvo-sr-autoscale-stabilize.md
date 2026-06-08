---
id: dvo-sr-autoscale-stabilize
title: Стабилизация автоскейлера
difficulty: hard
language: python
---

# Описание

HPA со стабилизирующим окном. В первой строке — окно W (секунды). Во второй — N (число рекомендаций). Далее N строк `время желаемые_реплики` (время — неубывающее целое).

Итоговое число реплик = максимум желаемых значений за окно [T - W, T], где T — время последней рекомендации. Выведи это число.

# Стартовый код

```python
w = int(input())
n = int(input())
recs = [tuple(map(int, input().split())) for _ in range(n)]
last_t = recs[-1][0]
# выведи max желаемых за окно [last_t - w, last_t]
print(0)
```

# Тесты

```json
[
  {
    "stdin": "60\n4\n0 3\n30 5\n60 2\n90 4",
    "expected": "5"
  },
  {
    "stdin": "10\n3\n0 2\n5 8\n20 3",
    "expected": "3"
  },
  {
    "stdin": "100\n3\n0 5\n50 2\n90 7",
    "expected": "7"
  },
  {
    "stdin": "0\n2\n0 4\n10 9",
    "expected": "9"
  }
]
```
