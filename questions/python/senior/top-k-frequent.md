---
id: py-sr-top-k-frequent
title: Top-K частых элементов
difficulty: hard
language: python
---

# Описание

Найдите K наиболее часто встречающихся элементов в массиве. Результат отсортируйте по убыванию частоты. При одинаковой частоте меньший элемент идёт первым. Первая строка — элементы массива через пробел, вторая строка — число K. Выведите K элементов через пробел.

# Стартовый код

```python
from collections import Counter

def top_k_frequent(nums, k):
    # ваш код
    pass

nums = list(map(int, input().split()))
k = int(input())
print(*top_k_frequent(nums, k))
```

# Тесты

```json
[
  {"stdin": "1 1 1 2 2 3\n2", "expected": "1 2"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "4 4 4 1 1 2 2 2\n2", "expected": "2 4"}
]
```
