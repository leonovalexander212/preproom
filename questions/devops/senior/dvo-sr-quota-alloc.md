---
id: dvo-sr-quota-alloc
title: Превышение квоты кластера
difficulty: hard
language: python
---

# Описание

В первой строке — квота Q (например millicores CPU). Во второй — N (число namespace'ов). Далее N строк `namespace запрос` (целый запрос).

Выделяй ресурсы по порядку, накапливая сумму. Выведи имя первого namespace, на котором накопленная сумма строго превысит Q. Если все помещаются — выведи ALL_FIT.

# Стартовый код

```python
q = int(input())
n = int(input())
s = 0
for _ in range(n):
    name, req = input().split()
    s += int(req)
    # если s > q -> выведи name и заверши
print("ALL_FIT")
```

# Тесты

```json
[
  {
    "stdin": "100\n3\nteam-a 40\nteam-b 40\nteam-c 40",
    "expected": "team-c"
  },
  {
    "stdin": "100\n2\nx 50\ny 50",
    "expected": "ALL_FIT"
  },
  {
    "stdin": "10\n1\nbig 20",
    "expected": "big"
  },
  {
    "stdin": "1000\n3\na 100\nb 200\nc 300",
    "expected": "ALL_FIT"
  }
]
```
