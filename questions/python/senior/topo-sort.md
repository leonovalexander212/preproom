---
id: py-sr-topo-sort
title: Топологическая сортировка
difficulty: hard
language: python
---

# Описание

Выполните топологическую сортировку ориентированного ациклического графа (DAG). Используйте алгоритм Кана с min-кучей для детерминированного порядка (при нескольких вариантах выбирайте вершину с наименьшим номером). Первая строка — "N M" (вершины, рёбра). Далее M строк — "u v" (ребро от u к v, u должен быть раньше v). Если граф содержит цикл, выведите "CYCLE". Иначе выведите вершины через пробел.

# Стартовый код

```python
import sys
import heapq
from collections import defaultdict

def topo_sort(n, edges):
    # ваш код
    pass

lines = sys.stdin.read().strip().split('\n')
n, m = map(int, lines[0].split())
edges = []
for i in range(1, m + 1):
    u, v = map(int, lines[i].split())
    edges.append((u, v))
print(topo_sort(n, edges))
```

# Тесты

```json
[
  {"stdin": "4 3\n1 2\n1 3\n3 4", "expected": "1 2 3 4"},
  {"stdin": "3 2\n3 1\n3 2", "expected": "3 1 2"},
  {"stdin": "2 2\n1 2\n2 1", "expected": "CYCLE"}
]
```
