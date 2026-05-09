---
id: cs-mid-caesar-cipher
title: Шифр Цезаря
difficulty: medium
language: csharp
---

# Описание

Зашифруйте текст шифром Цезаря с заданным сдвигом. Сдвигайте только латинские буквы (a-z, A-Z), остальные символы оставляйте без изменений.

# Стартовый код

```csharp
using System;
using System.Text;

class Program {
    static void Main() {
        string text = Console.ReadLine();
        int shift = int.Parse(Console.ReadLine());
        Console.WriteLine(CaesarCipher(text, shift));
    }

    static string CaesarCipher(string text, int shift) {
        // ваш код
    }
}
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
