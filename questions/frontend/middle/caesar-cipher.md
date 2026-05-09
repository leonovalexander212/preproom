---
id: js-mid-caesar-cipher
title: Шифр Цезаря
difficulty: medium
language: javascript
---

# Описание

Реализуйте шифр Цезаря. Сдвиньте каждую букву (a-z, A-Z) на заданное число позиций. Остальные символы оставьте без изменений.

# Стартовый код

```javascript
const input = require('fs').readFileSync(0, 'utf8').trim();
const lines = input.split('\n');
const text = lines[0];
const shift = Number(lines[1]);

function caesarCipher(text, shift) {
  // ваш код
}

console.log(caesarCipher(text, shift));
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