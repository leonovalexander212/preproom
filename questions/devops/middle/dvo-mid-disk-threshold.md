---
id: dvo-mid-disk-threshold
title: Диски выше порога
difficulty: medium
language: python
---

# Описание

В первой строке два числа через пробел: N — количество дисков и T — порог в процентах. Далее N строк формата `имя занято всего` (целые, МиБ).

Выведи имена дисков (в порядке ввода), у которых заполненность строго больше T процентов — каждое на отдельной строке. Если таких нет — выведи OK.

# Стартовый код

```python
n, t = map(int, input().split())
over = []
for _ in range(n):
    name, used, total = input().split()
    # добавь name в over, если заполненность > t%
if over:
    for name in over:
        print(name)
else:
    print("OK")
```

# Тесты

```json
[
  {
    "stdin": "3 80\nsda 900 1000\nsdb 500 1000\nsdc 850 1000",
    "expected": "sda\nsdc"
  },
  {
    "stdin": "2 90\nroot 950 1000\ndata 900 1000",
    "expected": "root"
  },
  {
    "stdin": "2 50\na 100 1000\nb 200 1000",
    "expected": "OK"
  },
  {
    "stdin": "1 0\nx 1 100",
    "expected": "x"
  }
]
```
