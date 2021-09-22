import random

ABC = [
    chr(ord(b) + i)
        for b, n in (('a', 26), ('A', 26), ('0', 10),)
            for i in range(n)
]

def genRandomStr(k):
    s = ''.join(
        random.choices(ABC, k=k)
    )

    return s
