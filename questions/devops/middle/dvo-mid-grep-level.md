---
id: dvo-mid-grep-level
title: Подсчёт по уровням лога
difficulty: medium
language: python
---

# Описание

В первой строке N — число строк лога. Далее N строк формата `УРОВЕНЬ сообщение` (уровень — первое слово: ERROR, WARN, INFO или DEBUG).

Выведи счётчики в формате `ERROR=A WARN=B INFO=C DEBUG=D`.

# Стартовый код

```python
n = int(input())
c = {"ERROR": 0, "WARN": 0, "INFO": 0, "DEBUG": 0}
for _ in range(n):
    line = input()
    # увеличь счётчик уровня (первое слово)
print("ERROR=" + str(c["ERROR"]) + " WARN=" + str(c["WARN"]) + " INFO=" + str(c["INFO"]) + " DEBUG=" + str(c["DEBUG"]))
```

# Тесты

```json
[
  {
    "stdin": "4\nINFO started\nERROR disk full\nWARN slow\nERROR timeout",
    "expected": "ERROR=2 WARN=1 INFO=1 DEBUG=0"
  },
  {
    "stdin": "3\nINFO a\nINFO b\nINFO c",
    "expected": "ERROR=0 WARN=0 INFO=3 DEBUG=0"
  },
  {
    "stdin": "2\nDEBUG x\nERROR y",
    "expected": "ERROR=1 WARN=0 INFO=0 DEBUG=1"
  },
  {
    "stdin": "1\nWARN low disk",
    "expected": "ERROR=0 WARN=1 INFO=0 DEBUG=0"
  }
]
```
