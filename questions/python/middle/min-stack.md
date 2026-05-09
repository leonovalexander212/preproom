---
id: py-mid-min-stack
title: Стек с минимумом
difficulty: medium
language: python
---

# Описание

Реализуйте стек, поддерживающий операции push, pop и получение текущего минимума за O(1). Первая строка — количество операций N. Далее N строк с командами: "push X" (положить число X), "pop" (удалить верхний элемент), "min" (вывести текущий минимум). Для каждой команды "min" выведите значение на отдельной строке.

# Стартовый код

```python
import sys

def process_operations(operations):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
n = int(lines[0])
operations = lines[1:n + 1]
results = process_operations(operations)
print('\n'.join(map(str, results)))
```

# Тесты

```json
[
  {"stdin": "5\npush 3\npush 5\nmin\npush 1\nmin", "expected": "3\n1"},
  {"stdin": "3\npush 10\npush 20\nmin", "expected": "10"},
  {"stdin": "6\npush 2\npush 1\nmin\npop\nmin\npop", "expected": "1\n2"}
]
```
