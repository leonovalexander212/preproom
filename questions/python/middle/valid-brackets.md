---
id: py-mid-valid-brackets
title: Валидные скобки
difficulty: medium
language: python
---

# Описание

Дана строка, содержащая только символы '(', ')', '[', ']', '{', '}'. Определите, является ли скобочная последовательность валидной. Строка валидна, если каждая открывающая скобка закрывается соответствующей закрывающей скобкой в правильном порядке. Выведите "true" или "false".

# Стартовый код

```python
def is_valid(s):
    # ваш код
    pass

s = input()
print("true" if is_valid(s) else "false")
```

# Тесты

```json
[
  {"stdin": "()", "expected": "true"},
  {"stdin": "()[]{}", "expected": "true"},
  {"stdin": "(]", "expected": "false"},
  {"stdin": "([)]", "expected": "false"},
  {"stdin": "{[]}", "expected": "true"},
  {"stdin": "", "expected": "true"}
]
```
