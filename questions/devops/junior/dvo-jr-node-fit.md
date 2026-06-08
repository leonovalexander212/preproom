---
id: dvo-jr-node-fit
title: Помещается ли под на ноду
difficulty: easy
language: python
---

# Описание

Нода имеет лимит памяти L МиБ. На неё хотят разместить под из N контейнеров. Прочитайте L, затем N, затем N чисел — запрошенную память каждого контейнера в МиБ (по одному в строке). Выведите OK, если суммарная память помещается в ноду (сумма <= L), иначе OVERCOMMIT.

# Стартовый код

```python
def main():
    limit = int(input())
    n = int(input())
    total = 0
    for _ in range(n):
        mem = int(input())
        # ...
    # выведите OK или OVERCOMMIT
    print("OK")

main()
```

# Тесты

```json
[
  {
    "stdin": "1024\n3\n256\n256\n256",
    "expected": "OK"
  },
  {
    "stdin": "512\n2\n256\n300",
    "expected": "OVERCOMMIT"
  },
  {
    "stdin": "1000\n1\n1000",
    "expected": "OK"
  },
  {
    "stdin": "800\n4\n100\n200\n300\n250",
    "expected": "OVERCOMMIT"
  }
]
```
