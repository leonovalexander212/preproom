---
id: py-mid-max-subarray
title: Максимальный подмассив
difficulty: medium
language: python
---

# Описание

Найдите максимальную сумму непрерывного подмассива в массиве целых чисел (алгоритм Кадане). На вход подаётся одна строка с элементами массива через пробел. Выведите максимальную сумму.

# Стартовый код

```python
def max_subarray(nums):
    # ваш код
    pass

nums = list(map(int, input().split()))
print(max_subarray(nums))
```

# Тесты

```json
[
  {"stdin": "-2 1 -3 4 -1 2 1 -5 4", "expected": "6"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "-1 -2 -3", "expected": "-1"},
  {"stdin": "5 -3 5", "expected": "7"}
]
```
