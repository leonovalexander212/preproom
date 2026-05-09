---
id: py-mid-anagram-check
title: Проверка анаграмм
difficulty: medium
language: python
---

# Описание

Даны две строки. Определите, являются ли они анаграммами (содержат одинаковые символы в одинаковом количестве, без учёта регистра). Пробелы и прочие символы учитываются. Первая строка — первое слово, вторая строка — второе слово. Выведите "true" или "false".

# Стартовый код

```python
def is_anagram(s1, s2):
    # ваш код
    pass

s1 = input()
s2 = input()
print("true" if is_anagram(s1, s2) else "false")
```

# Тесты

```json
[
  {"stdin": "listen\nsilent", "expected": "true"},
  {"stdin": "Hello\nWorld", "expected": "false"},
  {"stdin": "Dormitory\nDirty room", "expected": "false"},
  {"stdin": "abc\ncba", "expected": "true"},
  {"stdin": "a\na", "expected": "true"}
]
```
