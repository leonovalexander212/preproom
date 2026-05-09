---
id: java-sr-coin-change
title: Размен монет
difficulty: hard
language: java
---

# Описание

Найдите минимальное количество монет для набора заданной суммы. Каждый номинал можно использовать неограниченное число раз. Первая строка — номиналы монет через пробел, вторая — целевая сумма. Выведите минимальное количество монет или -1, если набрать сумму невозможно.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int coinChange(int[] coins, int amount) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split(" ");
        int[] coins = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            coins[i] = Integer.parseInt(parts[i]);
        }
        int amount = Integer.parseInt(sc.nextLine().trim());
        System.out.println(coinChange(coins, amount));
    }
}
```

# Тесты

```json
[
  {"stdin": "1 5 10\n11", "expected": "2"},
  {"stdin": "2\n3", "expected": "-1"},
  {"stdin": "1\n0", "expected": "0"},
  {"stdin": "1 2 5\n11", "expected": "3"}
]
```
