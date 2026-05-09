---
id: java-sr-knapsack
title: Задача о рюкзаке
difficulty: hard
language: java
---

# Описание

Решите задачу о рюкзаке 0/1. Дано N предметов и рюкзак вместимостью W. Каждый предмет имеет вес и стоимость. Найдите максимальную стоимость предметов, которые можно поместить в рюкзак. Первая строка — "N W", затем N строк "weight value". Выведите максимальную стоимость.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int knapsack(int[] weights, int[] values, int W) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] nw = sc.nextLine().trim().split(" ");
        int N = Integer.parseInt(nw[0]);
        int W = Integer.parseInt(nw[1]);
        int[] weights = new int[N];
        int[] values = new int[N];
        for (int i = 0; i < N; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            weights[i] = Integer.parseInt(parts[0]);
            values[i] = Integer.parseInt(parts[1]);
        }
        System.out.println(knapsack(weights, values, W));
    }
}
```

# Тесты

```json
[
  {"stdin": "3 50\n10 60\n20 100\n30 120", "expected": "220"},
  {"stdin": "1 5\n10 100", "expected": "0"},
  {"stdin": "2 10\n5 50\n5 60", "expected": "110"}
]
```
