---
id: java-sr-tree-serialize
title: Сериализация дерева
difficulty: hard
language: java
---

# Описание

Дано бинарное дерево в формате level-order (обход в ширину), где "null" обозначает отсутствующий узел. Постройте дерево и выведите его inorder-обход (левый узел, корень, правый узел) через пробел. Вход: элементы через пробел. Выход: inorder-обход через пробел.

# Стартовый код

```java
import java.util.*;

public class Main {
    static int[] inorder(String[] tokens) {
        // ваш код — построить дерево из level-order и вернуть inorder
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] tokens = sc.nextLine().trim().split(" ");
        int[] result = inorder(tokens);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(result[i]);
        }
        System.out.println(sb.toString());
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
