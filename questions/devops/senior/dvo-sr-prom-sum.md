---
id: dvo-sr-prom-sum
title: Сумма метрик Prometheus по метке
difficulty: hard
language: python
---

# Описание

В первой строке — селектор вида `key=value`. Во второй — N (число метрик). Далее N строк формата `name{label="v",...} число`.

Просуммируй значения тех метрик, у которых метка key имеет значение value. Выведи сумму (целое).

# Стартовый код

```python
import re
sel = input().strip()
qk, qv = sel.split("=")
n = int(input())
total = 0
for _ in range(n):
    line = input()
    # извлеки метки и значение; прибавь при совпадении метки
print(total)
```

# Тесты

```json
[
  {
    "stdin": "code=200\n3\nreq{method=\"GET\",code=\"200\"} 42\nreq{method=\"POST\",code=\"200\"} 8\nreq{method=\"GET\",code=\"500\"} 3",
    "expected": "50"
  },
  {
    "stdin": "method=GET\n3\nreq{method=\"GET\",code=\"200\"} 42\nreq{method=\"POST\",code=\"200\"} 8\nreq{method=\"GET\",code=\"500\"} 3",
    "expected": "45"
  },
  {
    "stdin": "code=500\n3\nreq{method=\"GET\",code=\"200\"} 42\nreq{method=\"POST\",code=\"200\"} 8\nreq{method=\"GET\",code=\"500\"} 3",
    "expected": "3"
  },
  {
    "stdin": "method=DELETE\n3\nreq{method=\"GET\",code=\"200\"} 42\nreq{method=\"POST\",code=\"200\"} 8\nreq{method=\"GET\",code=\"500\"} 3",
    "expected": "0"
  }
]
```
