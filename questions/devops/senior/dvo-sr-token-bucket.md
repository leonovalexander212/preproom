---
id: dvo-sr-token-bucket
title: Token bucket rate limiter
difficulty: hard
language: python
---

# Описание

Token bucket: ёмкость C токенов, пополнение R токенов в секунду (не выше C). В первой строке — C и R через пробел. Во второй — N (число запросов). Далее N строк — времена запросов в секундах (неубывающие целые).

Бакет стартует полным. Перед каждым запросом добавляются токены за прошедшее время (с потолком C). Если есть хотя бы 1 токен — запрос разрешён, токен тратится; иначе отклонён.

Выведи число разрешённых запросов.

# Стартовый код

```python
c, rate = map(int, input().split())
n = int(input())
ts = [int(input()) for _ in range(n)]
tokens = c
allowed = 0
# симулируй token bucket
print(allowed)
```

# Тесты

```json
[
  {
    "stdin": "2 1\n5\n0\n0\n0\n1\n2",
    "expected": "4"
  },
  {
    "stdin": "1 1\n3\n0\n0\n0",
    "expected": "1"
  },
  {
    "stdin": "5 0\n5\n0\n1\n2\n3\n4",
    "expected": "5"
  },
  {
    "stdin": "3 2\n6\n0\n0\n0\n0\n1\n1",
    "expected": "5"
  }
]
```
