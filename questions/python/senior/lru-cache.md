---
id: py-sr-lru-cache
title: LRU-кэш
difficulty: hard
language: python
---

# Описание

Реализуйте LRU-кэш (Least Recently Used). Первая строка — вместимость кэша. Вторая строка — количество операций N. Далее N строк: "put K V" (добавить ключ K со значением V) или "get K" (получить значение по ключу). Для каждой операции "get" выведите значение или -1, если ключ не найден. При превышении вместимости удаляется наименее недавно использованный элемент.

# Стартовый код

```python
import sys

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        # ваш код

    def get(self, key):
        # ваш код
        pass

    def put(self, key, value):
        # ваш код
        pass

lines = sys.stdin.read().strip().split('\n')
capacity = int(lines[0])
n = int(lines[1])
cache = LRUCache(capacity)
results = []
for i in range(2, 2 + n):
    parts = lines[i].split()
    if parts[0] == 'get':
        results.append(str(cache.get(int(parts[1]))))
    else:
        cache.put(int(parts[1]), int(parts[2]))
print('\n'.join(results))
```

# Тесты

```json
[
  {"stdin": "2\n5\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2", "expected": "1\n-1"},
  {"stdin": "1\n4\nput 1 10\nget 1\nput 2 20\nget 1", "expected": "10\n-1"}
]
```
