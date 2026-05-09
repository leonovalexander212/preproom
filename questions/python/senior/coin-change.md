---
id: py-sr-coin-change
title: Размен монет
difficulty: hard
language: python
---

# Описание

Найдите минимальное количество монет для набора заданной суммы. Каждую монету можно использовать неограниченное число раз. Если набрать сумму невозможно, выведите -1. Первая строка — номиналы монет через пробел, вторая строка — целевая сумма.

# Стартовый код

```python
def coin_change(coins, amount):
    # ваш код
    pass

coins = list(map(int, input().split()))
amount = int(input())
print(coin_change(coins, amount))
```

# Тесты

```json
[
  {"stdin": "1 5 10\n11", "expected": "2"},
  {"stdin": "2\n3", "expected": "-1"},
  {"stdin": "1\n0", "expected": "0"},
  {"stdin": "1 2 5\n11", "expected": "3"}
]
```
