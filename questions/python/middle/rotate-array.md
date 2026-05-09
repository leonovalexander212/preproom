---
id: py-mid-rotate-array
title: Ротация массива
difficulty: medium
language: python
---

# Описание

Сдвиньте массив вправо на K позиций. Элементы, выходящие за правый край, появляются слева. Первая строка — элементы массива через пробел, вторая строка — число K. Выведите результат через пробел.

# Стартовый код

```python
def rotate_array(arr, k):
    # ваш код
    pass

arr = list(map(int, input().split()))
k = int(input())
print(*rotate_array(arr, k))
```

# Тесты

```json
[
  {"stdin": "1 2 3 4 5\n2", "expected": "4 5 1 2 3"},
  {"stdin": "1 2 3\n1", "expected": "3 1 2"},
  {"stdin": "1\n5", "expected": "1"},
  {"stdin": "1 2 3 4\n4", "expected": "1 2 3 4"}
]
```
