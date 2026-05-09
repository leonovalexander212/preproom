---
id: py-mid-matrix-rotate
title: Поворот матрицы
difficulty: medium
language: python
---

# Описание

Дана квадратная матрица NxN. Поверните её на 90 градусов по часовой стрелке. На вход подаётся N строк, каждая содержит N целых чисел через пробел. Выведите повёрнутую матрицу в том же формате.

# Стартовый код

```python
import sys

def rotate_matrix(matrix):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
matrix = [list(map(int, line.split())) for line in lines]
result = rotate_matrix(matrix)
for row in result:
    print(*row)
```

# Тесты

```json
[
  {"stdin": "1 2\n3 4", "expected": "3 1\n4 2"},
  {"stdin": "1 2 3\n4 5 6\n7 8 9", "expected": "7 4 1\n8 5 2\n9 6 3"},
  {"stdin": "1", "expected": "1"}
]
```
