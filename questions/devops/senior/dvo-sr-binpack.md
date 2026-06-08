---
id: dvo-sr-binpack
title: Упаковка подов (first-fit)
difficulty: hard
language: python
---

# Описание

Ноды имеют одинаковую ёмкость памяти C (МиБ). В первой строке — C, во второй — N (число подов), в третьей — N размеров подов через пробел (каждый ≤ C).

Размещай поды алгоритмом first-fit (в порядке ввода): каждый под — в первую ноду, где он помещается; если ни в одну — заводи новую ноду.

Выведи число использованных нод.

# Стартовый код

```python
cap = int(input())
n = int(input())
pods = list(map(int, input().split()))
nodes = []  # остатки ёмкости
# размести поды first-fit
print(len(nodes))
```

# Тесты

```json
[
  {
    "stdin": "10\n5\n6 5 4 3 2",
    "expected": "2"
  },
  {
    "stdin": "100\n3\n50 50 50",
    "expected": "2"
  },
  {
    "stdin": "8\n4\n8 8 8 8",
    "expected": "4"
  },
  {
    "stdin": "10\n6\n3 3 3 3 3 3",
    "expected": "2"
  }
]
```
