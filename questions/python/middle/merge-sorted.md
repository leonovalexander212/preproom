---
id: py-mid-merge-sorted
title: Слияние отсортированных массивов
difficulty: medium
language: python
---

# Описание

Даны два отсортированных массива целых чисел. Объедините их в один отсортированный массив. Каждая из двух строк ввода содержит элементы массива через пробел (строка может быть пустой). Выведите результат через пробел.

# Стартовый код

```python
import sys

def merge_sorted(arr1, arr2):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
arr1 = list(map(int, lines[0].split())) if lines[0].strip() else []
arr2 = list(map(int, lines[1].split())) if len(lines) > 1 and lines[1].strip() else []
print(*merge_sorted(arr1, arr2))
```

# Тесты

```json
[
  {"stdin": "1 3 5\n2 4 6", "expected": "1 2 3 4 5 6"},
  {"stdin": "1\n2", "expected": "1 2"},
  {"stdin": "1 2 3\n", "expected": "1 2 3"},
  {"stdin": "\n4 5 6", "expected": "4 5 6"}
]
```
