---
id: py-sr-sliding-max
title: Максимум в скользящем окне
difficulty: hard
language: python
---

# Описание

Дан массив целых чисел и размер окна K. Для каждого положения скользящего окна размера K найдите максимальный элемент. Первая строка — элементы массива через пробел, вторая строка — размер окна K. Выведите максимумы через пробел.

# Стартовый код

```python
from collections import deque

def sliding_max(nums, k):
    # ваш код
    pass

nums = list(map(int, input().split()))
k = int(input())
print(*sliding_max(nums, k))
```

# Тесты

```json
[
  {"stdin": "1 3 -1 -3 5 3 6 7\n3", "expected": "3 3 5 5 6 7"},
  {"stdin": "1\n1", "expected": "1"},
  {"stdin": "1 -1\n1", "expected": "1 -1"},
  {"stdin": "9 8 7 6 5\n2", "expected": "9 8 7 6"}
]
```
