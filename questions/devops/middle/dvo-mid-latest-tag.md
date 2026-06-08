---
id: dvo-mid-latest-tag
title: Самый свежий тег
difficulty: medium
language: python
---

# Описание

В первой строке N — число тегов. Далее N строк — теги версий формата MAJOR.MINOR.PATCH.

Выведи самый свежий (наибольший) тег. Сравнение покомпонентное.

# Стартовый код

```python
n = int(input())
tags = [input().strip() for _ in range(n)]
# найди тег с наибольшей версией
print(tags[0])
```

# Тесты

```json
[
  {
    "stdin": "3\n1.2.0\n1.10.0\n1.9.0",
    "expected": "1.10.0"
  },
  {
    "stdin": "3\n2.0.0\n1.5.0\n2.0.1",
    "expected": "2.0.1"
  },
  {
    "stdin": "2\n0.9.0\n0.10.0",
    "expected": "0.10.0"
  },
  {
    "stdin": "4\n1.0.0\n3.2.1\n2.5.0\n3.1.9",
    "expected": "3.2.1"
  }
]
```
