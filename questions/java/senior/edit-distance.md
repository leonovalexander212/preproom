---
id: java-sr-edit-distance
title: Расстояние редактирования
difficulty: hard
language: java
---

# Описание

Вычислите расстояние Левенштейна — минимальное количество операций (вставка, удаление, замена символа) для превращения одной строки в другую. Первая строка — s1, вторая — s2. Выведите минимальное число операций.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int editDistance(String s1, String s2) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.nextLine();
        String s2 = sc.nextLine();
        System.out.println(editDistance(s1, s2));
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
