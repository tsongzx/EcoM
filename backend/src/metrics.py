import functools
import json 
@functools.lru_cache
def read_metrics_file():
  file_name = 'db/metrics.json'
  # Open and read the JSON file
  with open(file_name, 'r') as file:
      return json.load(file)
    
def calculate_metric(year_indicators, weights):
    indicator_data = read_metrics_file()
    
    overall_score = 0
    for indicator_name, weight in weights.items():
        if indicator_name not in year_indicators:
            continue
        indicator_scaling = indicator_data[indicator_name]
        indicator_value = year_indicators[indicator_name].indicator_value
        
        scaled_score = 0
        if indicator_scaling["type"] == "Yes/No":
            if indicator_value == 0 and indicator_scaling["pos"] == "Positive":
                scaled_score = 0
            elif indicator_value == 1 and indicator_scaling["pos"] == "Negative":
                scaled_score = 0
            else:
                scaled_score = 0
        # In the case that lower == higher then stdev = 0, set score to perfect
        elif indicator_scaling["stdev"] == 0:
            scaled_score = 100
        else:
            mean = indicator_scaling["mean"]
            stdev = indicator_scaling["stdev"]
            zscore = (indicator_value - mean)/stdev
            scaled_score = (zscore + 2.5)*20
            if scaled_score < 0:
                scaled_score = 0
            if scaled_score > 100:
                scaled_score = 100
            
            # If negative reverses score
            if indicator_scaling["pos"] == "Negative":
                scaled_score = 100 - scaled_score            
        overall_score += scaled_score * weight
        
    return round(overall_score)
