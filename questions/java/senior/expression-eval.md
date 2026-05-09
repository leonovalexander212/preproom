---
id: java-sr-expression-eval
title: Вычисление выражения
difficulty: hard
language: java
---

# Описание

Вычислите математическое выражение, содержащее операторы +, -, *, скобки и целые числа. Деление не используется (кроме операции /). Приоритет операций стандартный: скобки, затем *, затем + и -. Вход: строка с выражением. Выход: результат вычисления.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int evaluate(String expression) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String expr = sc.nextLine().trim();
        System.out.println(evaluate(expr));
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
