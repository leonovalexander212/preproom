---
id: java-sr-prefix-count
title: Поиск по префиксу
difficulty: hard
language: java
---

# Описание

Дано N слов и Q запросов. Для каждого запроса-префикса подсчитайте, сколько слов начинаются с этого префикса. Формат ввода: первая строка — N, затем N слов (по одному на строку), затем Q, затем Q префиксов. Для каждого запроса выведите количество совпадений.

# Стартовый код

```java
import java.util.*;

public class Main {
    // ваш код — реализация Trie или другого подхода

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] words = new String[n];
        for (int i = 0; i < n; i++) {
            words[i] = sc.nextLine().trim();
        }
        int q = Integer.parseInt(sc.nextLine().trim());
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            String prefix = sc.nextLine().trim();
            int count = 0;
            // ваш код
            if (i > 0) sb.append("\n");
            sb.append(count);
        }
        System.out.println(sb.toString());
    }
}
```

# Тесты

```json
[
  {"stdin": "5\napple\napp\napricot\nbanana\nband\n3\nap\nban\nz", "expected": "3\n2\n0"},
  {"stdin": "2\nhello\nhelp\n1\nhel", "expected": "2"}
]
```
