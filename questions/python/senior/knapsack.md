---
id: py-sr-knapsack
title: Задача о рюкзаке
difficulty: hard
language: python
---

# Описание

Решите задачу о рюкзаке 0/1. Даны N предметов, каждый с весом и ценностью, и рюкзак с максимальной грузоподъёмностью W. Каждый предмет можно взять не более одного раза. Найдите максимальную суммарную ценность предметов, помещающихся в рюкзак. Первая строка — "N W", далее N строк — "weight value" для каждого предмета.

# Стартовый код

```python
import sys

def knapsack(n, w, items):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
n, w = map(int, lines[0].split())
items = []
for i in range(1, n + 1):
    weight, value = map(int, lines[i].split())
    items.append((weight, value))
print(knapsack(n, w, items))
```

# Тесты

```json
[
  {"stdin": "3 50\n10 60\n20 100\n30 120", "expected": "220"},
  {"stdin": "1 5\n10 100", "expected": "0"},
  {"stdin": "2 10\n5 50\n5 60", "expected": "110"}
]
```
