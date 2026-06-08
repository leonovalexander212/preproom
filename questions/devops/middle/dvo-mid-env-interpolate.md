---
id: dvo-mid-env-interpolate
title: Интерполяция переменных
difficulty: medium
language: python
---

# Описание

В первой строке M — число переменных. Далее M строк `KEY=VALUE` (делить по первому `=`). Последняя строка — шаблон.

Замени в шаблоне все вхождения вида ${KEY} на значение переменной. Неизвестные переменные замени на пустую строку. Выведи результат.

# Стартовый код

```python
import re
m = int(input())
env = {}
for _ in range(m):
    k, _, v = input().partition("=")
    env[k] = v
tmpl = input()
# замени ${KEY} на env.get(KEY, "")
print(tmpl)
```

# Тесты

```json
[
  {
    "stdin": "2\nHOST=localhost\nPORT=5432\n${HOST}:${PORT}",
    "expected": "localhost:5432"
  },
  {
    "stdin": "1\nUSER=admin\nhello ${USER}, id=${ID}",
    "expected": "hello admin, id="
  },
  {
    "stdin": "2\nA=1\nB=2\n${A}-${B}-${A}",
    "expected": "1-2-1"
  },
  {
    "stdin": "1\nURL=http://x\nendpoint: ${URL}/api",
    "expected": "endpoint: http://x/api"
  }
]
```
