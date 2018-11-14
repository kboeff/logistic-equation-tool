n = int(input())
OddSum = 0
OddMin = None
OddMax = None
EvenSum = 0
EvenMin = None
EvenMax = None

for i in range (1, n+1):
    x = float(input())
    if i % 2 != 0:
        if OddMin == None or x < OddMin:
            OddMin = x
        if OddMax == None or x > OddMax:
            OddMax = x
        OddSum += x
    else:
        if EvenMin == None or x < EvenMin:
            EvenMin = x
        if EvenMax == None or x > EvenMax:
            EvenMax = x
        EvenSum += x

if EvenMin == EvenMax or EvenMin == None:
    EvenMin = "No"
    EvenMax = "No"
if OddMin == OddMax or OddMin == None:
    OddMin = "No"
    OddMax = "No"

print("OddSum={},\nOddMin={},\nOddMax={},\nEvenSum={},\nEvenMin={},\nEvenMax={}".format(OddSum, OddMin, OddMax, EvenSum, EvenMin, EvenMax))