---
id: py-mid-run-length
title: RLE-кодирование
difficulty: medium
language: python
---

# Описание

Реализуйте RLE-кодирование (Run-Length Encoding) строки. Каждая группа подряд идущих одинаковых символов заменяется на символ и количество повторений. Например, "aaabbc" кодируется как "a3b2c1". На вход подаётся строка, на выход — закодированная строка.

# Стартовый код

```python
def run_length_encode(s):
    # ваш код
    pass

s = input()
print(run_length_encode(s))
```

# Тесты

```json
[
  {"stdin": "aaabbc", "expected": "a3b2c1"},
  {"stdin": "a", "expected": "a1"},
  {"stdin": "aaa", "expected": "a3"},
  {"stdin": "abcd", "expected": "a1b1c1d1"},
  {"stdin": "aabbbcccc", "expected": "a2b3c4"}
]
```
