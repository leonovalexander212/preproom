---
id: cs-sr-expression-eval
title: Вычисление выражения
difficulty: hard
language: csharp
---

# Описание

Вычислите значение арифметического выражения, содержащего целые числа и операции +, -, *, / со скобками. Целочисленное деление округляется к нулю. Выражение всегда корректно.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        string expr = Console.ReadLine();
        // ваш код
        Console.WriteLine(result);
    }
}
```

# Тесты

```json
[
  {"stdin": "3+2*2", "expected": "7"},
  {"stdin": "(1+(4+5+2)-3)+(6+8)", "expected": "23"},
  {"stdin": "2*(5+5*2)/3+(6/2+8)", "expected": "21"},
  {"stdin": "1+1", "expected": "2"}
]
```