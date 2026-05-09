---
id: py-sr-shortest-path
title: Кратчайший путь в графе
difficulty: hard
language: python
---

# Описание

Найдите кратчайший путь в невзвешенном неориентированном графе с помощью BFS. Первая строка содержит N (вершины) и M (рёбра). Следующие M строк — рёбра "u v". Последняя строка — "start end" (начальная и конечная вершины). Выведите длину кратчайшего пути или -1, если путь не существует.

# Стартовый код

```python
import sys
from collections import deque

def shortest_path(n, edges, start, end):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
n, m = map(int, lines[0].split())
edges = []
for i in range(1, m + 1):
    u, v = map(int, lines[i].split())
    edges.append((u, v))
start, end = map(int, lines[m + 1].split())
print(shortest_path(n, edges, start, end))
```

# Тесты

```json
[
  {"stdin": "4 4\n1 2\n2 3\n3 4\n1 3\n1 4", "expected": "2"},
  {"stdin": "3 1\n1 2\n1 3", "expected": "-1"},
  {"stdin": "2 1\n1 2\n1 2", "expected": "1"}
]
```
