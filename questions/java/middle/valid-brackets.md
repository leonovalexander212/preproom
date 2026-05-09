---
id: java-mid-valid-brackets
title: Валидные скобки
difficulty: medium
language: java
---

# Описание

Дана строка, содержащая символы '(', ')', '[', ']', '{', '}'. Определите, является ли скобочная последовательность валидной. Каждая открывающая скобка должна быть закрыта соответствующей закрывающей в правильном порядке. Выведите "true" или "false".

# Стартовый код

```java
import java.util.*;

public class Main {
    public static boolean isValid(String s) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(isValid(s));
    }
}
```

# Тесты

```json
[
  {"stdin": "()", "expected": "true"},
  {"stdin": "()[]{}", "expected": "true"},
  {"stdin": "(]", "expected": "false"},
  {"stdin": "([)]", "expected": "false"},
  {"stdin": "{[]}", "expected": "true"},
  {"stdin": "", "expected": "true"}
]
```
