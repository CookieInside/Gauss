from math import gcd
from typing import List, Union

class Rational:
    def __init__(self, z:Union["Rational", int], n:int=1):
        if isinstance(z, int):
            self.z:int = z
            self.n:int = n
        else:
            self.z = z.z
            self.n = z.n
    
    def __mul__(self, other:Union["Rational",int]) -> "Rational":
        if isinstance(other, int):
            return Rational(z=self.z * other, n=self.n).shorten()
        return Rational(z=self.z*other.z, n=self.n*other.n).shorten()
    
    def __truediv__(self, other:Union["Rational",int]) -> "Rational":
        if isinstance(other, int):
            return Rational(z=self.z, n=self.n * other).shorten()
        return Rational(z=self.z * other.n, n=self.n * other.z).shorten()

    def __add__(self, other:Union["Rational",int]) -> "Rational":
        if isinstance(other, int):
            return Rational(z=self.z + self.n * other, n=self.n).shorten()
        return Rational(z=self.z * other.n + other.z * self.n, n=self.n * other.n).shorten()

    def __eq__(self, other:Union["Rational", int, float]) -> bool:
        if isinstance(other, Rational):
            return self.z == other.z and self.n == other.n
        return self.value() == other

    def __abs__(self):
        self.z = abs(self.z)
        self.n = abs(self.n)

    def shorten(self) -> "Rational":
        if self.z <= 0 and self.n <= 0:
            self.z *= -1
            self.n *= -1
        m = gcd(self.z, self.n)
        return Rational(z=int(self.z / m), n=int(self.n / m))

    def value(self) -> float:
        return self.z / self.n

    def inverse(self) -> "Rational":
        return Rational(z=self.n, n=self.z)

    def __str__(self) -> str:
        self.shorten()
        o = ""
        if self.n < 0 or self.z < 0:
            o += "-"
            self.__abs__()

        if int(self.n) == 1:
            return f"({o}{int(self.z)})"
        return f"({o}{int(self.z)}/{self.n})"
    
    def to_tex(self) -> str:
        self.shorten()
        o = ""
        if self.n < 0 or self.z < 0:
            o += "-"
            self.__abs__()

        if int(self.n) == 1:
            return f"{o}{int(self.z)}"
        return f"\\frac{{ {o} {int(self.z)} }} {{ {self.n} }}"

class LGS:
    @staticmethod
    def to_rational(matrix: List[List[int]]) -> List[List[Rational]]:
        return [[Rational(cell) for cell in row] for row in matrix]

    def __init__(self, matrix:Union[List[List[Rational]], List[List[int]]]):
        matrix = self.to_rational(matrix)
        self.matrix = matrix
        self.height = len(matrix)
        self.width = len(matrix[0])
    
    def __str__(self) -> str:
        o = ""
        for row in self.matrix:
            for cell in row:
                o += f" {cell} "
            o += "\n"
        return o

    def to_tex(self) -> str:
        o = "\\begin{pmatrix}"
        for row in self.matrix:
            for cell in row:
                o += cell.to_tex() + "&"
            o += "\\\\"
        o = o[:-2]
        o += "\end{pmatrix}"
        return o

    def swap(self, x: int, y: int):
        tmp = self.matrix[x]
        self.matrix[x] = self.matrix[y]
        self.matrix[y] = tmp
    
    def mul(self, x:int, mul: Union[Rational, int]):
        self.matrix[x] = [cell * mul for cell in self.matrix[x]]
    
    def add(self, x: int, y: int, mul: Union[Rational, int]):
        self.matrix[x] = [self.matrix[x][row] + self.matrix[y][row] * mul for row in range(self.width)]

    def get(self, x:int, y:int):
        return self.matrix[x, y]

    def set(self, x:int, y:int, v):
        self.matrix[x][y] = v

    def print(self):
        for row in self.matrix:
            print(row)

    def gauss(self):
        for colIdx in range(self.height):
            for i in range(colIdx, self.height):
                if self.matrix[colIdx][colIdx].value() == 0:
                    self.swap(rowIdx, i)
            if not self.matrix[colIdx][colIdx].value() == 0:
                    self.mul(colIdx, self.matrix[colIdx][colIdx].inverse())
            for rowIdx in range(self.height):
                if not rowIdx == colIdx:
                    self.add(rowIdx, colIdx, self.matrix[rowIdx][colIdx] * -1)
