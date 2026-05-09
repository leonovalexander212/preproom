---
id: py-mid-roman-to-int
title: Римские числа
difficulty: medium
language: python
---

# Описание

Преобразуйте римское число в целое. Римские цифры: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Если меньшая цифра стоит перед большей, она вычитается (например, IV=4, IX=9). На вход подаётся строка с римским числом. Выведите соответствующее целое число.

# Стартовый код

```python
def roman_to_int(s):
    # ваш код
    pass

s = input()
print(roman_to_int(s))
```

# Тесты

```json
[
  {"stdin": "III", "expected": "3"},
  {"stdin": "IV", "expected": "4"},
  {"stdin": "IX", "expected": "9"},
  {"stdin": "XLII", "expected": "42"},
  {"stdin": "MCMXCIV", "expected": "1994"}
]
```
