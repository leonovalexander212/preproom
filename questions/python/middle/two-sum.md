---
id: py-mid-two-sum
title: Два слагаемых
difficulty: medium
language: python
---

# Описание

Дан массив целых чисел и целевое значение. Найдите два элемента, сумма которых равна целевому значению, и выведите их индексы (0-based) через пробел, меньший индекс первым. Гарантируется, что решение существует и единственно. Первая строка — элементы массива через пробел, вторая строка — целевое значение.

# Стартовый код

```python
def two_sum(nums, target):
    # ваш код
    pass

nums = list(map(int, input().split()))
target = int(input())
result = two_sum(nums, target)
print(result[0], result[1])
```

# Тесты

```json
[
  {"stdin": "2 7 11 15\n9", "expected": "0 1"},
  {"stdin": "3 2 4\n6", "expected": "1 2"},
  {"stdin": "1 5 3 7\n8", "expected": "1 3"}
]
```
