---
id: java-mid-roman-to-int
title: Римские числа
difficulty: medium
language: java
---

# Описание

Преобразуйте римское число в целое. Поддерживаемые символы: I(1), V(5), X(10), L(50), C(100), D(500), M(1000). Учтите вычитательную нотацию (IV=4, IX=9, XL=40, XC=90, CD=400, CM=900). Вход: строка с римским числом. Выход: целое число.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int romanToInt(String s) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(romanToInt(s));
    }
}
```

# Тесты

```json
[
  {"stdin": "III", "expected": "3"},
  {"stdin": "IV", "expected": "4"},
  {"stdin": "IX", "expected": "9"},
  {"stdin": "XLII", "expected": "42"},
  {"stdin": "MCMXCIV", "expected": "1994"}
]
```
