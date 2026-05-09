---
id: java-mid-min-stack
title: Стек с минимумом
difficulty: medium
language: java
---

# Описание

Реализуйте стек с операциями push, pop и получением текущего минимума за O(1). Первая строка — количество операций N. Далее N строк: "push X" (положить X), "pop" (удалить верхний элемент), "min" (вывести текущий минимум). Для каждой операции "min" выведите значение минимума.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Deque<Integer> stack = new ArrayDeque<>();
        Deque<Integer> minStack = new ArrayDeque<>();
        StringBuilder sb = new StringBuilder();
        // ваш код
        System.out.print(sb.toString());
    }
}
```

# Тесты

```json
[
  {"stdin": "5\npush 3\npush 5\nmin\npush 1\nmin", "expected": "3\n1"},
  {"stdin": "3\npush 10\npush 20\nmin", "expected": "10"},
  {"stdin": "6\npush 2\npush 1\nmin\npop\nmin\npop", "expected": "1\n2"}
]
```
