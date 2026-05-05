---
id: py-sum-array
title: Сумма чисел
difficulty: easy
language: python
---

# Описание

Прочитай число N, затем строку из N целых чисел, разделённых пробелом. Выведи их сумму.

# Стартовый код

```python
def main():
    n = int(input())
    nums = list(map(int, input().split()))
    # твой код ниже
    print(0)

main()
```

# Тесты

```json
[
  {"stdin": "3\n1 2 3", "expected": "6"},
  {"stdin": "1\n42", "expected": "42"},
  {"stdin": "5\n-1 -2 -3 -4 -5", "expected": "-15"},
  {"stdin": "4\n100 200 300 400", "expected": "1000"}
]
```