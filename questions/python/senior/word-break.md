---
id: py-sr-word-break
title: Разбиение строки
difficulty: hard
language: python
---

# Описание

Определите, можно ли разбить строку на подстроки так, чтобы каждая подстрока являлась словом из заданного словаря. Первая строка — исходная строка, вторая строка — слова словаря через пробел. Выведите "true" или "false".

# Стартовый код

```python
def word_break(s, word_dict):
    # ваш код
    pass

s = input()
word_dict = set(input().split())
print("true" if word_break(s, word_dict) else "false")
```

# Тесты

```json
[
  {"stdin": "leetcode\nleet code", "expected": "true"},
  {"stdin": "applepenapple\napple pen", "expected": "true"},
  {"stdin": "catsandog\ncats dog sand and cat", "expected": "false"}
]
```
