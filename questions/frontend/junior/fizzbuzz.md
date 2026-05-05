---
id: js-fizzbuzz
title: FizzBuzz
difficulty: easy
language: javascript
---

# Описание

Прочитай N. Выведи N строк: 3→Fizz, 5→Buzz, 15→FizzBuzz, иначе число.

# Стартовый код

```javascript
const n = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);

function fizzbuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    // твой код
    out.push(String(i));
  }
  return out.join('\n');
}

console.log(fizzbuzz(n));
```

# Тесты

```json
[
  {"stdin": "5", "expected": "1\n2\nFizz\n4\nBuzz"},
  {"stdin": "3", "expected": "1\n2\nFizz"},
  {"stdin": "15", "expected": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz"}
]
```