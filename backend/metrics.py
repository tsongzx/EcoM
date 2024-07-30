import functools
import json 
@functools.lru_cache
def read_metrics_file():
  file_name = 'db/metrics.json'
  # Open and read the JSON file
  with open(file_name, 'r') as file:
      return json.load(file)