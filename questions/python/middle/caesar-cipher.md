---
id: py-mid-caesar-cipher
title: Шифр Цезаря
difficulty: medium
language: python
---

# Описание

Зашифруйте строку шифром Цезаря. Сдвигаются только латинские буквы (a-z, A-Z), остальные символы остаются без изменений. Сдвиг циклический. Первая строка — исходная строка, вторая строка — величина сдвига (целое число).

# Стартовый код

```python
def caesar_cipher(text, shift):
    # ваш код
    pass

text = input()
shift = int(input())
print(caesar_cipher(text, shift))
```

# Тесты

```json
[
  {"stdin": "Hello World\n3", "expected": "Khoor Zruog"},
  {"stdin": "xyz\n3", "expected": "abc"},
  {"stdin": "ABC\n1", "expected": "BCD"},
  {"stdin": "Test 123!\n0", "expected": "Test 123!"}
]
```
