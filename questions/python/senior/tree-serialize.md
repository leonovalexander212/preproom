---
id: py-sr-tree-serialize
title: Сериализация дерева
difficulty: hard
language: python
---

# Описание

Дано бинарное дерево в формате обхода по уровням (level-order), где "null" обозначает отсутствующий узел. Постройте дерево из этого представления и выведите его симметричный обход (inorder: левое поддерево, корень, правое поддерево) через пробел. На вход подаётся одна строка с элементами через пробел.

# Стартовый код

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(values):
    # ваш код
    pass

def inorder(root):
    # ваш код
    pass

values = input().split()
root = build_tree(values)
print(*inorder(root))
```

# Тесты

```json
[
  {"stdin": "1 2 3 null null 4 5", "expected": "2 1 4 3 5"},
  {"stdin": "1", "expected": "1"},
  {"stdin": "1 null 2 null 3", "expected": "1 2 3"}
]
```
