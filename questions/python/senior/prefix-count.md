---
id: py-sr-prefix-count
title: Поиск по префиксу
difficulty: hard
language: python
---

# Описание

Дан список из N слов и Q запросов. Для каждого запроса определите, сколько слов из списка начинаются с данного префикса. Первая строка — число N. Далее N строк со словами. Затем число Q и Q строк с запросами. Для каждого запроса выведите количество совпадений на отдельной строке.

# Стартовый код

```python
import sys

def prefix_count(words, queries):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
idx = 0
n = int(lines[idx]); idx += 1
words = []
for i in range(n):
    words.append(lines[idx]); idx += 1
q = int(lines[idx]); idx += 1
queries = []
for i in range(q):
    queries.append(lines[idx]); idx += 1
results = prefix_count(words, queries)
print('\n'.join(map(str, results)))
```

# Тесты

```json
[
  {"stdin": "5\napple\napp\napricot\nbanana\nband\n3\nap\nban\nz", "expected": "3\n2\n0"},
  {"stdin": "2\nhello\nhelp\n1\nhel", "expected": "2"}
]
```
