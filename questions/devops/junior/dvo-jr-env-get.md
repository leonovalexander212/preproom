---
id: dvo-jr-env-get
title: Чтение значения из .env
difficulty: easy
language: python
---

# Описание

Дан .env-файл из N строк формата KEY=VALUE. Прочитайте N, затем N строк, затем имя искомого ключа. Выведите значение этого ключа. Если ключ отсутствует — выведите NOT_FOUND. Если ключ встречается несколько раз — берётся последнее значение. Значение может содержать символ '=' (делить нужно только по первому '=').

# Стартовый код

```python
def main():
    n = int(input())
    env = {}
    for _ in range(n):
        line = input()
        # разберите line на ключ и значение по первому '='
    key = input()
    # выведите значение ключа или NOT_FOUND
    print("NOT_FOUND")

main()
```

# Тесты

```json
[
  {
    "stdin": "3\nDB_HOST=localhost\nDB_PORT=5432\nDEBUG=true\nDB_PORT",
    "expected": "5432"
  },
  {
    "stdin": "2\nA=1\nB=2\nC",
    "expected": "NOT_FOUND"
  },
  {
    "stdin": "2\nURL=http://x?a=1\nX=y\nURL",
    "expected": "http://x?a=1"
  },
  {
    "stdin": "3\nK=old\nK=new\nZ=1\nK",
    "expected": "new"
  }
]
```
