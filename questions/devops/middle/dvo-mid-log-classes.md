---
id: dvo-mid-log-classes
title: Классы HTTP-ответов
difficulty: medium
language: python
---

# Описание

В первой строке N — число ответов. Далее N строк — HTTP-коды (целые, 100–599).

Выведи в формате `2xx=A 3xx=B 4xx=C 5xx=D` количество ответов каждого класса. Класс — первая цифра кода. Коды 1xx игнорируй.

# Стартовый код

```python
n = int(input())
c = {2: 0, 3: 0, 4: 0, 5: 0}
for _ in range(n):
    code = int(input())
    # увеличь счётчик класса code // 100
print("2xx=" + str(c[2]) + " 3xx=" + str(c[3]) + " 4xx=" + str(c[4]) + " 5xx=" + str(c[5]))
```

# Тесты

```json
[
  {
    "stdin": "6\n200\n201\n301\n404\n500\n503",
    "expected": "2xx=2 3xx=1 4xx=1 5xx=2"
  },
  {
    "stdin": "3\n100\n200\n199",
    "expected": "2xx=1 3xx=0 4xx=0 5xx=0"
  },
  {
    "stdin": "4\n404\n404\n404\n404",
    "expected": "2xx=0 3xx=0 4xx=4 5xx=0"
  },
  {
    "stdin": "1\n302",
    "expected": "2xx=0 3xx=1 4xx=0 5xx=0"
  }
]
```
