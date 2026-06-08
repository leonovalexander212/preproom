---
id: dvo-mid-mem-sum
title: Сумма памяти в МиБ
difficulty: medium
language: python
---

# Описание

В первой строке N — число значений. Далее N значений памяти в нотации Kubernetes (например 512Mi, 2Gi, 1024Ki, 1Ti), по одному в строке.

Просуммируй и выведи итог в МиБ (целое). Соотношения: 1Mi = 1024Ki, 1Gi = 1024Mi, 1Ti = 1024Gi.

# Стартовый код

```python
n = int(input())
total_ki = 0
units = {"Ki": 1, "Mi": 1024, "Gi": 1024 * 1024, "Ti": 1024 * 1024 * 1024}
for _ in range(n):
    s = input().strip()
    # прибавь в total_ki значение в KiB
print(total_ki // 1024)
```

# Тесты

```json
[
  {
    "stdin": "2\n512Mi\n2Gi",
    "expected": "2560"
  },
  {
    "stdin": "3\n1024Ki\n1Mi\n1Gi",
    "expected": "1026"
  },
  {
    "stdin": "1\n1Ti",
    "expected": "1048576"
  },
  {
    "stdin": "2\n2048Ki\n3Mi",
    "expected": "5"
  }
]
```
