---
id: cs-sr-tree-serialize
title: Сериализация дерева
difficulty: hard
language: csharp
---

# Описание

Дано бинарное дерево в формате level-order (значения узлов через пробел, отсутствующие узлы обозначены "null"). Постройте дерево и выведите его обход inorder (симметричный обход) через пробел.

# Стартовый код

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    class TreeNode {
        public int Val;
        public TreeNode Left, Right;
        public TreeNode(int v) { Val = v; }
    }

    static void Main() {
        var tokens = Console.ReadLine().Split();
        // ваш код
        Console.WriteLine(string.Join(" ", result));
    }
}
```

# Тесты

```json
[
  {"stdin": "1 2 3 null null 4 5", "expected": "2 1 4 3 5"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "1 null 2 null 3", "expected": "1 2 3"}
]
```