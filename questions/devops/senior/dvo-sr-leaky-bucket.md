---
id: dvo-sr-leaky-bucket
title: Leaky bucket
difficulty: hard
language: python
---

# Описание

Leaky bucket: ёмкость C, утечка R запросов в секунду. В первой строке — C и R через пробел. Во второй — N. Далее N строк — времена поступления (неубывающие целые секунды).

Уровень стартует с 0 и утекает на R за каждую прошедшую секунду (не ниже 0). Перед каждым запросом обнови уровень; если уровень < C — запрос принимается (уровень +1), иначе отбрасывается.

Выведи число отброшенных запросов.

# Стартовый код

```python
c, rate = map(int, input().split())
n = int(input())
ts = [int(input()) for _ in range(n)]
level = 0
dropped = 0
# симулируй leaky bucket
print(dropped)
```

# Тесты

```json
[
  {
    "stdin": "2 1\n5\n0\n0\n0\n0\n0",
    "expected": "3"
  },
  {
    "stdin": "3 1\n4\n0\n1\n2\n3",
    "expected": "0"
  },
  {
    "stdin": "1 0\n3\n0\n0\n0",
    "expected": "2"
  },
  {
    "stdin": "5 2\n6\n0\n0\n0\n0\n0\n0",
    "expected": "1"
  }
]
```
