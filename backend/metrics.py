import functools
import json 
@functools.lru_cache
def read_metrics_file():
  file_name = 'db/metrics.json'
  # Open and read the JSON file
  with open(file_name, 'r') as file:
      return json.load(file)
    
def calculate_metric(year, company_values, weights):
  indicator_data = read_metrics_file()

  if year not in company_values:
      return 0
  year_indicators = company_values[year]
  overall_score = 0
  
  for indicator_name, weight in weights.items():
      print(indicator_name)
      print(f'printing weight {weight}')
      if indicator_name not in year_indicators:
          # indicator does not exist for that company for that year
          print("skipping")
          continue
      indicator_scaling = indicator_data[indicator_name]

      lower = indicator_scaling["lower"]
      higher = indicator_scaling["higher"]
      indicator_value = year_indicators[indicator_name].indicator_value
      print(f'printing indicator value {indicator_value}')
      scaled_score = 0
      if higher == lower:
          scaled_score = 100
          continue
      elif indicator_scaling["indicator"] == "positive":
          scaled_score = 100*(indicator_value - lower)/(higher - lower)
      else:
          scaled_score = 100*(higher - indicator_value)/(higher - lower)
      print(f'printing scaled value {scaled_score}')
      
      overall_score += scaled_score * weight
      print(overall_score)
  return overall_score
