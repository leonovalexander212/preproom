---
id: dvo-mid-sla-uptime
title: Аптайм SLA
difficulty: medium
language: python
---

# Описание

В первой строке — общая длительность периода в минутах. Во второй — суммарное время простоя в минутах.

Выведи аптайм в процентах = (период - простой) / период * 100, округлённый до двух знаков после запятой.

# Стартовый код

```python
total = int(input())
down = int(input())
uptime = (total - down) / total * 100
# выведи с двумя знаками после запятой
print(uptime)
```

# Тесты

```json
[
  {
    "stdin": "1440\n10",
    "expected": "99.31"
  },
  {
    "stdin": "100\n10",
    "expected": "90.00"
  },
  {
    "stdin": "1000\n0",
    "expected": "100.00"
  },
  {
    "stdin": "1440\n60",
    "expected": "95.83"
  },
  {
    "stdin": "200\n1",
    "expected": "99.50"
  }
]
```
