---
id: py-mid-binary-search
title: Бинарный поиск
difficulty: medium
language: python
---

# Описание

Дан отсортированный массив целых чисел и целевое значение. Найдите индекс целевого значения в массиве (индексация с 0). Если значение не найдено, верните -1. Первая строка — элементы массива через пробел, вторая строка — целевое значение.

# Стартовый код

```python
def binary_search(arr, target):
    # ваш код
    pass

arr = list(map(int, input().split()))
target = int(input())
print(binary_search(arr, target))
```

# Тесты

```json
[
  {"stdin": "1 3 5 7 9\n5", "expected": "2"},
  {"stdin": "1 3 5 7 9\n6", "expected": "-1"},
  {"stdin": "10\n10", "expected": "0"},
  {"stdin": "1 2 3 4 5 6 7 8 9 10\n1", "expected": "0"}
]
```
