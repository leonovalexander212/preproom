---
id: java-sr-topo-sort
title: Топологическая сортировка
difficulty: hard
language: java
---

# Описание

Выполните топологическую сортировку ориентированного ациклического графа (DAG) алгоритмом Кана. Для детерминированного вывода используйте min-heap (при одинаковом приоритете выбирайте вершину с наименьшим номером). Первая строка — "N M", затем M строк "u v" (ребро от u к v, u должен быть до v). Выведите порядок через пробел, или "CYCLE" если граф содержит цикл.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static String topoSort(int n, List<int[]> edges) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] nm = sc.nextLine().trim().split(" ");
        int N = Integer.parseInt(nm[0]);
        int M = Integer.parseInt(nm[1]);
        List<int[]> edges = new ArrayList<>();
        for (int i = 0; i < M; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            edges.add(new int[]{Integer.parseInt(parts[0]), Integer.parseInt(parts[1])});
        }
        System.out.println(topoSort(N, edges));
    }
}
```

# Тесты

```json
[
  {"stdin": "4 3\n1 2\n1 3\n3 4", "expected": "1 2 3 4"},
  {"stdin": "3 2\n3 1\n3 2", "expected": "3 1 2"},
  {"stdin": "2 2\n1 2\n2 1", "expected": "CYCLE"}
]
```
