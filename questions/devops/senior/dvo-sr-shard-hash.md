---
id: dvo-sr-shard-hash
title: Шардирование по хешу
difficulty: hard
language: python
---

# Описание

В первой строке N — число шардов. Во второй — N имён шардов через пробел. В третьей — ключ (строка).

Отсортируй имена шардов лексикографически. Вычисли хеш ключа = сумма кодов символов (ord). Выведи шард с индексом (хеш mod N) в отсортированном списке.

# Стартовый код

```python
n = int(input())
nodes = sorted(input().split())
key = input().strip()
# индекс = (сумма ord символов ключа) mod n
print(nodes[0])
```

# Тесты

```json
[
  {
    "stdin": "2\nnode-a node-b\nuser1",
    "expected": "node-a"
  },
  {
    "stdin": "3\nshard0 shard1 shard2\nsession-xyz",
    "expected": "shard1"
  },
  {
    "stdin": "1\nonly\nanything",
    "expected": "only"
  },
  {
    "stdin": "2\nb a\nfoo",
    "expected": "a"
  }
]
```
