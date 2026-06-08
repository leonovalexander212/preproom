---
id: dvo-sr-sliding-window
title: Sliding window rate limit
difficulty: hard
language: python
---

# Описание

Sliding-window rate limit. В первой строке — окно W (секунды) и лимит L через пробел. Во второй — N (число запросов). Далее N строк — времена запросов (неубывающие целые секунды).

Запрос принимается, если число уже принятых запросов с временем в полуинтервале (t-W, t] меньше L; иначе отклоняется.

Выведи число отклонённых запросов.

# Стартовый код

```python
w, lim = map(int, input().split())
n = int(input())
ts = [int(input()) for _ in range(n)]
accepted = []
rejected = 0
# учитывай только принятые с временем > t-w
print(rejected)
```

# Тесты

```json
[
  {
    "stdin": "10 2\n5\n0\n1\n2\n3\n11",
    "expected": "2"
  },
  {
    "stdin": "5 3\n4\n0\n0\n0\n0",
    "expected": "1"
  },
  {
    "stdin": "1 1\n3\n0\n1\n2",
    "expected": "0"
  },
  {
    "stdin": "100 2\n5\n0\n1\n2\n3\n4",
    "expected": "3"
  }
]
```
