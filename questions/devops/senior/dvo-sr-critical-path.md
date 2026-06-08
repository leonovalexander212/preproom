---
id: dvo-sr-critical-path
title: Критический путь пайплайна
difficulty: hard
language: python
---

# Описание

В первой строке два числа: N (число узлов) и M (число рёбер). Во второй — N имён узлов через пробел. Далее M строк `A B w` — направленное ребро из A в B весом w (целое). Граф ацикличен.

Выведи длину критического пути — максимальную сумму весов рёбер вдоль любого пути. Если рёбер нет — 0.

# Стартовый код

```python
first = input().split()
n, m = int(first[0]), int(first[1])
nodes = input().split()
edges = [input().split() for _ in range(m)]
# найди самый длинный путь (по сумме весов) в DAG
print(0)
```

# Тесты

```json
[
  {
    "stdin": "3 2\na b c\na b 2\nb c 4",
    "expected": "6"
  },
  {
    "stdin": "4 3\nbuild test lint deploy\nbuild test 5\nbuild lint 2\ntest deploy 3",
    "expected": "8"
  },
  {
    "stdin": "3 0\nx y z",
    "expected": "0"
  },
  {
    "stdin": "5 4\na b c d e\na b 1\nb c 1\nc d 1\nd e 1",
    "expected": "4"
  }
]
```
