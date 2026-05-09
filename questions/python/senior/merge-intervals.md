---
id: py-sr-merge-intervals
title: Слияние интервалов
difficulty: hard
language: python
---

# Описание

Даны N интервалов. Объедините все пересекающиеся интервалы и выведите результат в отсортированном порядке. Первая строка — количество интервалов N. Далее N строк, каждая содержит два числа "start end". Выведите объединённые интервалы, по одному на строку.

# Стартовый код

```python
import sys

def merge_intervals(intervals):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
n = int(lines[0])
intervals = []
for i in range(1, n + 1):
    start, end = map(int, lines[i].split())
    intervals.append((start, end))
result = merge_intervals(intervals)
for s, e in result:
    print(s, e)
```

# Тесты

```json
[
  {"stdin": "3\n1 3\n2 6\n8 10", "expected": "1 6\n8 10"},
  {"stdin": "2\n1 4\n4 5", "expected": "1 5"},
  {"stdin": "1\n1 1", "expected": "1 1"},
  {"stdin": "3\n1 4\n0 4\n3 5", "expected": "0 5"}
]
```
