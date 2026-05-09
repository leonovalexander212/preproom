---
id: cs-sr-edit-distance
title: Расстояние редактирования
difficulty: hard
language: csharp
---

# Описание

Вычислите расстояние Левенштейна между двумя строками — минимальное количество операций вставки, удаления или замены символа, необходимых для преобразования одной строки в другую.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        string a = Console.ReadLine();
        string b = Console.ReadLine();
        // ваш код
        Console.WriteLine(result);
    }
}
```

# Тесты

```json
[
  {"stdin": "kitten\nsitting", "expected": "3"},
  {"stdin": "abc\nabc", "expected": "0"},
  {"stdin": "\nabc", "expected": "3"},
  {"stdin": "horse\nros", "expected": "3"}
]
```