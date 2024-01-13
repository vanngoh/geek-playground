import time


def normal_pow(x: float, n: int):
  start_time = time.perf_counter_ns()

  ans = 1
  for i in range(n):
    ans *= x

  end_time = time.perf_counter_ns()
  cost = f"{end_time - start_time}ns"

  return (ans, cost)


def optimized_pow(x: float, n: int):
  start_time = time.perf_counter_ns()

  ans = 1
  i = n
  while i>0:
      # Check if the last bit is 1
      if i&1:
          ans *= x
          
      # Prepare the x for next bit iteration
      x *= x
      i >>= 1

  end_time = time.perf_counter_ns()
  cost = f"{end_time - start_time}ns"

  return (ans, cost)


def py_pow(x: float, n: int):
  start_time = time.perf_counter_ns()

  ans = x**n

  end_time = time.perf_counter_ns()
  cost = f"{end_time - start_time}ns"

  return (ans, cost)


tests = [(3, 2), (16, 8), (4, 18), (2, 64)]
for index, test in enumerate(tests):
  print(f"Round {index}, {test[0]}^{test[1]}")
  print(f"Normal Power: {normal_pow(test[0], test[1])}")
  print(f"Optimized Power: {optimized_pow(test[0], test[1])}")
  print(f"Python Built-in Power: {py_pow(test[0], test[1])}")
  print("====================================================")