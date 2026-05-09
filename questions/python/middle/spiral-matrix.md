---
id: py-mid-spiral-matrix
title: Спиральный обход матрицы
difficulty: medium
language: python
---

# Описание

Выведите элементы матрицы в спиральном порядке (по часовой стрелке, начиная с верхнего левого угла). Первая строка содержит R и C (количество строк и столбцов). Далее идут R строк по C чисел. Выведите элементы через пробел в порядке спирального обхода.

# Стартовый код

```python
import sys

def spiral_order(matrix):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
r, c = map(int, lines[0].split())
matrix = [list(map(int, lines[i + 1].split())) for i in range(r)]
print(*spiral_order(matrix))
```

# Тесты

```json
[
  {"stdin": "2 3\n1 2 3\n4 5 6", "expected": "1 2 3 6 5 4"},
  {"stdin": "3 3\n1 2 3\n4 5 6\n7 8 9", "expected": "1 2 3 6 9 8 7 4 5"},
  {"stdin": "1 1\n42", "expected": "42"}
]
```
