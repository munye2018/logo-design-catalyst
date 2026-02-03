import numpy as np
from scipy.optimize import minimize

import matplotlib.pyplot as plt

# Define the function that calculates S given parameters and time t
def sprint_equation(t, params):
  A, F, k, i = params
  return (A + F) * t - (A/k) * (1 - np.exp(-k*t)) + (F/i) * (1 - np.exp(i*t))

# Define the error function to minimize
def error_function(params, t_data, s_data):
  predicted = sprint_equation(t_data, params)
  return np.sum((predicted - s_data)**2)  # Sum of squared errors

def try_different_optimizers(error_function, initial_guess, t_data, s_data, bounds):
    methods = ['Nelder-Mead', 'COBYLA', 'SLSQP', 'L-BFGS-B']
    results = {}
    
    for method in methods:
        try:
            result = minimize(error_function, 
                            initial_guess,
                            args=(t_data, s_data),
                            bounds=bounds if method in ['L-BFGS-B', 'SLSQP'] else None,
                            method=method,
                            options={'maxiter': 10000, 'ftol': 1e-12, 'disp': True})
            results[method] = (result.fun, result.x)
            print(f"\n{method} results:")
            print(f"Final error: {result.fun:.6f}")
            print(f"Parameters: A={result.x[0]:.4f}, F={result.x[1]:.4f}, k={result.x[2]:.4f}, i={result.x[3]:.4f}")
        except Exception as e:
            print(f"{method} failed: {str(e)}")
    
    return results

# Example usage
if __name__ == "__main__":
  # Sample data points (t, S) - replace with your actual data
  # t_data = np.array([0, 1.89, 2.88, 3.78, 4.64, 5.47, 6.29, 7.10, 7.92, 8.75, 9.58])
  # s_data = np.array([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])

  t_data = np.array([0, 10.37])
  s_data = np.array([0, 100])

  # Initial guess for parameters [A, F, k, i]
  initial_guess = [11.247547, 0.037311, 0.889560, 0.346363]

  # Set bounds for parameters (all positive)
  bounds = [(0.0, None), (0.0, None), (0.0, None), (0.0, None)]

  # Try different optimizers
  results = try_different_optimizers(error_function, initial_guess, t_data, s_data, bounds)
  
  # Use the best result for plotting
  best_method = min(results.items(), key=lambda x: x[1][0])
  print(f"\nBest method: {best_method[0]}")
  best_params = best_method[1][1]  # Use the best parameters for plotting


  # Extract optimized parameters
  A_opt, F_opt, k_opt, i_opt = best_params

  print(f"Optimized parameters:")
  print(f"A = {A_opt:.4f}")
  print(f"F = {F_opt:.4f}")
  print(f"k = {k_opt:.4f}")
  print(f"i = {i_opt:.4f}")

  # Calculate times the athlete crosses each 10m interval
  intervals = np.arange(10, 210, 10)
  crossing_times = []

  for distance in intervals:
      time = minimize(lambda t: abs(sprint_equation(t, best_params) - distance), 2, bounds=[(0, None)]).x[0]
      crossing_times.append(time)

  print("\nTimes the athlete crosses each 10m interval:")
  for i, time in enumerate(crossing_times):
      print(f"{(i+1)*10}m: {time:.4f} seconds")

  # Calculate split times from cumulative times
  split_times = np.diff([0] + crossing_times)

  print("\nSplit times for each 10m interval:")
  for i, split_time in enumerate(split_times):
      if i == 0:
          print(f"0-10m: {split_time:.4f} seconds")
      else:
          print(f"{i*10}-{(i+1)*10}m: {split_time:.4f} seconds")

  # Plot results
  t_smooth = np.linspace(min(t_data), max(t_data), 100)
  s_predicted = sprint_equation(t_smooth, best_params)

  plt.scatter(t_data, s_data, color='blue', label='Data points')
  plt.plot(t_smooth, s_predicted, color='red', label='Fitted curve')
  plt.xlabel('Time (t)')
  plt.ylabel('Distance (S)')
  plt.legend()
  plt.grid(True)
  plt.show()