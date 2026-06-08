---
id: dvo-sr-weighted-rr
title: Weighted round robin
difficulty: hard
language: python
---

# Описание

Smooth weighted round robin (алгоритм nginx). В первой строке N — число серверов. Далее N строк `имя вес` (целый вес). Последняя строка — K (число запросов).

На каждом шаге: к текущему весу каждого сервера прибавляется его вес; выбирается сервер с максимальным текущим весом (при равенстве — меньший индекс в порядке ввода); у выбранного из текущего веса вычитается сумма всех весов.

Выведи последовательность из K выбранных серверов через пробел.

# Стартовый код

```python
n = int(input())
names = []
weights = []
for _ in range(n):
    name, w = input().split()
    names.append(name)
    weights.append(int(w))
k = int(input())
total = sum(weights)
cur = [0] * n
out = []
# реализуй smooth WRR на k запросов
print(" ".join(out))
```

# Тесты

```json
[
  {
    "stdin": "2\na 3\nb 1\n4",
    "expected": "a a b a"
  },
  {
    "stdin": "2\na 1\nb 1\n4",
    "expected": "a b a b"
  },
  {
    "stdin": "3\nx 5\ny 1\nz 1\n7",
    "expected": "x x y x z x x"
  },
  {
    "stdin": "1\nsolo 10\n3",
    "expected": "solo solo solo"
  }
]
```
