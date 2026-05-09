---
id: py-mid-decode-string
title: Декодирование строки
difficulty: medium
language: python
---

# Описание

Декодируйте строку, закодированную по правилу: число перед квадратными скобками означает количество повторений содержимого скобок. Вложенность допускается. Например, "3[ab]2[c]" декодируется как "abababcc", а "2[a3[b]]" — как "abbbabbb". На вход подаётся закодированная строка. Выведите декодированную строку.

# Стартовый код

```python
def decode_string(s):
    # ваш код
    pass

s = input()
print(decode_string(s))
```

# Тесты

```json
[
  {"stdin": "3[a]2[bc]", "expected": "aaabcbc"},
  {"stdin": "3[a2[c]]", "expected": "accaccacc"},
  {"stdin": "abc", "expected": "abc"},
  {"stdin": "2[abc]3[cd]ef", "expected": "abcabccdcdcdef"}
]
```
