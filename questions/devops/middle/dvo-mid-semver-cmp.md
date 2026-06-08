---
id: dvo-mid-semver-cmp
title: Сравнение semver-версий
difficulty: medium
language: python
---

# Описание

Сравни две semver-версии формата MAJOR.MINOR.PATCH (целые). В первой строке — первая версия, во второй — вторая.

Выведи -1, если первая меньше второй; 1, если больше; 0, если равны. Сравнение покомпонентное.

# Стартовый код

```python
a = input().strip()
b = input().strip()
# распарси версии и сравни покомпонентно
# выведи -1, 0 или 1
print(0)
```

# Тесты

```json
[
  {
    "stdin": "1.2.3\n1.2.4",
    "expected": "-1"
  },
  {
    "stdin": "2.0.0\n1.9.9",
    "expected": "1"
  },
  {
    "stdin": "1.4.0\n1.4.0",
    "expected": "0"
  },
  {
    "stdin": "0.10.0\n0.9.0",
    "expected": "1"
  },
  {
    "stdin": "3.1.0\n3.1.1",
    "expected": "-1"
  }
]
```
