---
id: dvo-mid-rolling-batches
title: Батчи rolling-update
difficulty: medium
language: python
---

# Описание

Деплой обновляет реплики батчами. В первой строке — общее число реплик R, во второй — размер батча B (maxSurge).

Выведи количество батчей, нужных чтобы обновить все реплики (округление вверх).

# Стартовый код

```python
r = int(input())
b = int(input())
# выведи число батчей = ceil(r / b)
print(0)
```

# Тесты

```json
[
  {
    "stdin": "10\n3",
    "expected": "4"
  },
  {
    "stdin": "9\n3",
    "expected": "3"
  },
  {
    "stdin": "1\n5",
    "expected": "1"
  },
  {
    "stdin": "100\n7",
    "expected": "15"
  },
  {
    "stdin": "8\n8",
    "expected": "1"
  }
]
```
