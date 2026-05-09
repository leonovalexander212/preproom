---
id: java-mid-caesar-cipher
title: Шифр Цезаря
difficulty: medium
language: java
---

# Описание

Зашифруйте строку шифром Цезаря. Сдвигаются только латинские буквы (a-z, A-Z), остальные символы остаются без изменений. Первая строка — исходная строка, вторая — величина сдвига. Выведите зашифрованную строку.

# Стартовый код

```java
import java.util.*;

public class Main {
    public static String caesarCipher(String s, int shift) {
        // ваш код
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        int shift = Integer.parseInt(sc.nextLine().trim());
        System.out.println(caesarCipher(s, shift));
    }
}
```

# Тесты

```json
[
  {"stdin": "Hello World\n3", "expected": "Khoor Zruog"},
  {"stdin": "xyz\n3", "expected": "abc"},
  {"stdin": "ABC\n1", "expected": "BCD"},
  {"stdin": "Test 123!\n0", "expected": "Test 123!"}
]
```
