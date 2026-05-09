---
id: py-sr-edit-distance
title: Расстояние редактирования
difficulty: hard
language: python
---

# Описание

Вычислите расстояние Левенштейна между двумя строками — минимальное количество операций (вставка, удаление, замена символа) для преобразования первой строки во вторую. Первая строка — s1, вторая строка — s2 (строка может быть пустой). Выведите минимальное количество операций.

# Стартовый код

```python
import sys

def edit_distance(s1, s2):
    # ваш код
    pass

lines = sys.stdin.read().split('\n')
s1 = lines[0] if lines[0] else ""
s2 = lines[1] if len(lines) > 1 and lines[1] else ""
print(edit_distance(s1, s2))
```

# Тесты

```json
[
  {"stdin": "kitten\nsitting", "expected": "3"},
  {"stdin": "abc\nabc", "expected": "0"},
  {"stdin": "\nabc", "expected": "3"},
  {"stdin": "horse\nros", "expected": "3"}
]
```
