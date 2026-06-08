---
id: dvo-sr-deploy-waves
title: Число волн деплоя
difficulty: hard
language: python
---

# Описание

В первой строке два числа: N (число сервисов) и M (число зависимостей). Во второй — N имён сервисов через пробел. Далее M строк `A B` (A разворачивается раньше B).

Сервисы разворачиваются волнами: в волне 1 — те, у кого нет предшественников; в каждой следующей — те, чьи предшественники уже развёрнуты. Выведи число волн (= длина самой длинной цепочки зависимостей). Если есть цикл — выведи CYCLE.

# Стартовый код

```python
from collections import deque
first = input().split()
n, m = int(first[0]), int(first[1])
nodes = input().split()
edges = [input().split() for _ in range(m)]
# вычисли уровни (Kahn BFS); число волн = max(level); CYCLE если цикл
print(0)
```

# Тесты

```json
[
  {
    "stdin": "3 2\ndb api web\ndb api\napi web",
    "expected": "3"
  },
  {
    "stdin": "4 2\na b c d\na c\nb d",
    "expected": "2"
  },
  {
    "stdin": "3 0\nx y z",
    "expected": "1"
  },
  {
    "stdin": "2 2\np q\np q\nq p",
    "expected": "CYCLE"
  }
]
```
