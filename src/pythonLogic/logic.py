import sys

def getSum(sum, count):
  print(int(sum) + int(count))

if __name__ == '__main__': 
  getSum(sys.argv[1], sys.argv[2])