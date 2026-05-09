---
id: java-sr-lru-cache
title: LRU-кэш
difficulty: hard
language: java
---

# Описание

Реализуйте LRU-кэш (Least Recently Used). Первая строка — ёмкость кэша. Вторая — количество операций N. Далее N строк: "put K V" (добавить ключ K со значением V) или "get K" (получить значение по ключу K). Для каждой операции "get" выведите значение или -1, если ключ отсутствует.

# Стартовый код

```java
import java.util.*;

public class Main {
    // ваш код — реализация LRU-кэша

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int capacity = Integer.parseInt(sc.nextLine().trim());
        int n = Integer.parseInt(sc.nextLine().trim());
        LinkedHashMap<Integer, Integer> cache = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;
            }
        };
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("get")) {
                int key = Integer.parseInt(line.split(" ")[1]);
                // ваш код
            } else {
                String[] parts = line.split(" ");
                int key = Integer.parseInt(parts[1]);
                int val = Integer.parseInt(parts[2]);
                // ваш код
            }
        }
        System.out.print(sb.toString());
    }
}
```

# Тесты

```json
[
  {"stdin": "2\n5\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2", "expected": "1\n-1"},
  {"stdin": "1\n4\nput 1 10\nget 1\nput 2 20\nget 1", "expected": "10\n-1"}
]
```
