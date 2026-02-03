import numpy as np
import pandas as pd
from scipy.optimize import minimize
import pickle
import os

# Define the function that calculates S given parameters and time t
def sprint_equation(t, params):
  A, F, k, i = params
  return (A + F) * t - (A/k) * (1 - np.exp(-k*t)) + (F/i) * (1 - np.exp(i*t))

# Define the error function to minimize
def error_function(params, t_data, s_data):
  predicted = sprint_equation(t_data, params)
  return np.sum((predicted - s_data)**2)  # Sum of squared errors

def weighted_error_function(params, t_data, s_data, weights=None):
    """
    Calculate weighted error with optional parameter penalties
    weights = [distance_weight, A_weight, F_weight, k_weight, i_weight]
    """
    A, F, k, i = params
    
    # Default weights if none provided
    if weights is None:
        weights = [1.0, 1.0, 1.0, 1.0, 1.0]
    
    # Distance fitting error (weighted)
    predicted = sprint_equation(t_data, params)
    distance_error = weights[0] * np.sum((predicted - s_data)**2)
    
    # Parameter penalties (optional)
    param_penalties = (
        weights[1] * (A - 11.245934)**2 +  # Penalize A far from typical value
        weights[2] * (F - 0.038727)**2 +   # Penalize F far from typical value
        weights[3] * (k - 0.891425)**2 +   # Penalize k far from typical value
        weights[4] * (i - 0.331055)**2     # Penalize i far from typical value
    )
    
    return distance_error + param_penalties

def load_and_process_data(csv_path):
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip()
    print("Available columns after cleaning:", df.columns.tolist())
    athletes_data = []

    distance_columns = ['10m', '20m', '30m', '40m', '50m', '60m', '70m', '80m', '90m', '100m']
    
    if not all(col in df.columns for col in distance_columns):
        raise ValueError(f"Could not find distance columns in CSV. Available columns: {df.columns.tolist()}")

    for _, row in df.iterrows():
        try:
            # Convert splits to float and handle any string cleaning
            splits = []
            for col in distance_columns:
                val = str(row[col]).strip()
                splits.append(float(val) if val else np.nan)
            splits = np.array(splits)
            
            if not np.isnan(splits).any():  # Only process complete data rows
                # Check if reaction time exists and is valid
                reaction_exists = False
                if 'Reaction' in df.columns:
                    reaction_val = str(row['Reaction']).strip()
                    try:
                        float(reaction_val)
                        reaction_exists = True
                    except (ValueError, TypeError):
                        reaction_exists = False
                
                # Only subtract default reaction time if no reaction time is provided
                if not reaction_exists:
                    splits[0] -= 0.149  # Subtract standard reaction time from first split
                
                # Calculate cumulative times
                t_data = np.zeros(len(splits) + 1)
                t_data[1:] = np.cumsum(splits)
                
                s_data = np.arange(0, 110, 10)
                
                athletes_data.append({
                    'athlete': str(row['Athlete']).strip(),
                    't_data': t_data,
                    's_data': s_data
                })
                print(f"Processed athlete: {row['Athlete']}, times: {t_data}")  # Debug print
        
        except Exception as e:
            print(f"Error processing row for athlete {row['Athlete']}: {str(e)}")
            continue
    
    if not athletes_data:
        raise ValueError("No valid athlete data could be processed")
    
    return athletes_data

def exp_func(x, a, b, c):
    """Exponential function for parameter relationships"""
    return a * np.exp(b * x) + c

def analyze_parameter_relationships(params_df):
    """Analyze relationships between parameters using exponential regression"""
    from scipy.optimize import curve_fit
    
    relationships = {}
    
    # Fit F vs A with adjusted initial guesses based on data characteristics
    p0_F_A = [
        params_df['F'].mean(),  # amplitude guess based on mean F value
        -1/params_df['A'].mean(),  # rate guess based on characteristic scale of A
        params_df['F'].min()  # offset guess based on minimum F value
    ]
    popt_F_A, _ = curve_fit(exp_func, params_df['A'], params_df['F'], 
                           p0=p0_F_A, maxfev=10000)
    relationships['F_from_A'] = {
        'params': popt_F_A,
        'r2': np.corrcoef(params_df['F'], exp_func(params_df['A'], *popt_F_A))[0,1]**2
    }
    
    # Print relationships
    print("\nParameter Relationships (Exponential Regression):")
    a, b, c = relationships['F_from_A']['params']
    print(f"\nF_from_A:")
    print(f"Formula: {a:.6f} * exp({b:.6f} * x) + {c:.6f}")
    print(f"R² Score: {relationships['F_from_A']['r2']:.4f}")
    
    return relationships

def sprint_equation_reduced(t, params, relationships):
    """
    Reduced parameter sprint equation using F from A relationship
    params = [A, k, i]
    """
    A, k, i = params
    # Calculate F from A using relationship parameters
    F = exp_func(A, *relationships['F_from_A']['params'])
    
    return (A + F) * t - (A/k) * (1 - np.exp(-k*t)) + (F/i) * (1 - np.exp(i*t))

def analyze_parameters_reduced(athletes_data, relationships):
    all_params = []
    total_athletes = len(athletes_data)
    
    for idx, athlete in enumerate(athletes_data):
        print(f"\nProcessing athlete {idx+1}/{total_athletes}: {athlete['athlete']}")
        
        initial_guess = [11.247547, 0.889560, 0.346363]  # [A, k, i]
        bounds = [(0.0, None), (0.0, None), (0.0, None)]
        
        result = minimize(
            lambda params: np.sum((sprint_equation_reduced(athlete['t_data'], params, relationships) - athlete['s_data'])**2),
            initial_guess,
            bounds=bounds,
            method='L-BFGS-B',
            options={'maxiter': 10000, 'ftol': 1e-12}
        )
        
        A, k, i = result.x
        F = exp_func(A, *relationships['F_from_A']['params'])
        
        all_params.append({
            'athlete': athlete['athlete'],
            'A': A,
            'F': F,
            'k': k,
            'i': i,
            'error': result.fun
        })
        
        print(f"Final error: {result.fun:.6f}")
        print(f"Parameters: A={A:.4f}, F={F:.4f}, k={k:.4f}, i={i:.4f}")
    
    return pd.DataFrame(all_params)

def train_relationships(data_path, initial_pickle="relationships_0.243490.pkl"):
    """Training function to find optimal parameter relationships"""
    athletes_data = load_and_process_data(data_path)
    
    with open(initial_pickle, 'rb') as f:
        relationships = pickle.load(f)
        
    params_df_reduced = analyze_parameters_reduced(athletes_data, relationships)
    current_mse = params_df_reduced['error'].mean()
    best_mse = 0.243490  # MSE from the loaded pickle file
    iteration = 0
    
    print(f"\nStarting iterative optimization...")
    print(f"Initial MSE: {current_mse:.6f}")
    print(f"Best known MSE: {best_mse:.6f}")
    
    try:
        while True:
            iteration += 1
            relationships = analyze_parameter_relationships(params_df_reduced)
            params_df_reduced = analyze_parameters_reduced(athletes_data, relationships)
            
            current_mse = params_df_reduced['error'].mean()
            print(f"\nIteration {iteration}")
            print(f"Current MSE: {current_mse:.6f}")
            print(f"Best MSE so far: {best_mse:.6f}")
            
            if current_mse < best_mse:
                best_mse = current_mse
                pickle_filename = f"relationships_{current_mse:.6f}.pkl"
                with open(pickle_filename, 'wb') as f:
                    pickle.dump(relationships, f)
                print(f"New best MSE found and saved!")
    
    except KeyboardInterrupt:
        print(f"\nOptimization stopped after {iteration} iterations")
        print(f"Final MSE: {current_mse:.6f}")
        print(f"Best MSE found: {best_mse:.6f}")

def predict_splits(t_data, s_data, relationships_pickle="models/relationships_0.243490.pkl"):
    """
    Inference function to predict splits for a single athlete
    
    Parameters:
    -----------
    t_data : numpy.ndarray
        Cumulative times including 0 at start
    s_data : numpy.ndarray
        Distance points corresponding to t_data
    relationships_pickle : str
        Path to relationships pickle file
    
    Returns:
    --------
    dict
        Contains parameters, crossing times, split times, and error
    """
    # Load relationships
    with open(relationships_pickle, 'rb') as f:
        relationships = pickle.load(f)
    
    # Get parameters for athlete
    result = minimize(
        lambda params: np.sum((sprint_equation_reduced(t_data, params, relationships) - s_data)**2),
        [11.247547, 0.889560, 0.346363],  # [A, k, i]
        bounds=[(0.0, None), (0.0, None), (0.0, None)],
        method='L-BFGS-B',
        options={'maxiter': 10000, 'ftol': 1e-12}
    )
    
    A, k, i = result.x
    F = exp_func(A, *relationships['F_from_A']['params'])
    best_params = [A, F, k, i]
    
    # Calculate crossing times for standard intervals
    intervals = np.arange(10, 210, 10)
    crossing_times = []
    for distance in intervals:
        time = minimize(lambda t: abs(sprint_equation(t, best_params) - distance), 2, bounds=[(0, None)]).x[0]
        crossing_times.append(time)
    
    # Calculate split times
    split_times = np.diff([0] + crossing_times)
    
    return {
        'parameters': {'A': A, 'F': F, 'k': k, 'i': i},
        'crossing_times': crossing_times,
        'split_times': split_times,
        'error': result.fun
    }

if __name__ == "__main__":
    # Example usage with t_data and s_data
    t_data = np.array([0, 11.37])
    s_data = np.array([0, 100])
    results = predict_splits(t_data, s_data)
    
    # Print results
    print("\nOptimized parameters:")
    for param, value in results['parameters'].items():
        print(f"{param} = {value:.4f}")
    
    print("\nPredicted times:")
    print("Distance | Split Time | Cumulative Time")
    print("-" * 40)
    cumulative_time = 0
    for i, split_time in enumerate(results['split_times']):
        cumulative_time += split_time
        if i == 0:
            print(f"0-10m   | {split_time:9.4f} | {cumulative_time:14.4f}")
        else:
            print(f"{i*10:2d}-{(i+1)*10}m | {split_time:9.4f} | {cumulative_time:14.4f}")
    
    print(f"\nFitting error: {results['error']:.6f}")
    
    # To run training (commented out by default):
    # train_relationships('models/times.csv')