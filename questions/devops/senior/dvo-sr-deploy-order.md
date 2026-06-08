---
id: dvo-sr-deploy-order
title: Порядок деплоя (топосортировка)
difficulty: hard
language: python
---

# Описание

В первой строке два числа: N (число сервисов) и M (число зависимостей). Во второй — N имён сервисов через пробел. Далее M строк `A B`, означающих, что сервис A должен деплоиться раньше B.

Выведи корректный порядок деплоя через пробел. При нескольких вариантах выбирай лексикографически меньшее имя из доступных. Если есть циклическая зависимость — выведи CYCLE.

# Стартовый код

```python
import heapq
first = input().split()
n, m = int(first[0]), int(first[1])
nodes = input().split()
edges = [input().split() for _ in range(m)]
# топосортировка Kahn с min-heap; CYCLE если остались узлы
print("")
```

# Тесты

```json
[
  {
    "stdin": "3 2\nweb api db\ndb api\napi web",
    "expected": "db api web"
  },
  {
    "stdin": "4 2\na b c d\na b\nc d",
    "expected": "a b c d"
  },
  {
    "stdin": "2 2\nx y\nx y\ny x",
    "expected": "CYCLE"
  },
  {
    "stdin": "3 0\nfront back cache",
    "expected": "back cache front"
  }
]
```
