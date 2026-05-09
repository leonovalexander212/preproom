---
id: java-sr-shortest-path
title: Кратчайший путь в графе
difficulty: hard
language: java
---

# Описание

Найдите кратчайший путь (количество рёбер) в невзвешенном неориентированном графе с помощью BFS. Первая строка — "N M" (вершины и рёбра), затем M строк "u v" (ребро между u и v), последняя строка — "start end". Выведите длину кратчайшего пути или -1, если путь не существует.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static int shortestPath(List<List<Integer>> graph, int start, int end, int n) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] nm = sc.nextLine().trim().split(" ");
        int N = Integer.parseInt(nm[0]);
        int M = Integer.parseInt(nm[1]);
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < M; i++) {
            String[] edge = sc.nextLine().trim().split(" ");
            int u = Integer.parseInt(edge[0]);
            int v = Integer.parseInt(edge[1]);
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        String[] se = sc.nextLine().trim().split(" ");
        int start = Integer.parseInt(se[0]);
        int end = Integer.parseInt(se[1]);
        System.out.println(shortestPath(graph, start, end, N));
    }
}
```

# Тесты

```json
[
  {"stdin": "4 4\n1 2\n2 3\n3 4\n1 3\n1 4", "expected": "2"},
  {"stdin": "3 1\n1 2\n1 3", "expected": "-1"},
  {"stdin": "2 1\n1 2\n1 2", "expected": "1"}
]
```
