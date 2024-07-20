#!/usr/bin/env bash
# run this file in backend folder!
# to run, open bash terminal, and type ./import_data/import_metric_indicators.sh
MYSQL_OUTPUT="mysql_output.log"
host='crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com'
username='admin'
password='crumpeteers'
db='crumpeteers'

# below is required when importing to local db
# SET GLOBAL local_infile=1;
# mysql --local-infile=1 -u admin -p -h crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com crumpeteers

mysql --local-infile=1 -t -h $host -u $username --password=$password -t $db << EOF | tee -a $MYSQL_OUTPUT
  # commented below is for local use
  # LOAD DATA LOCAL INFILE "C:/Users/byunt/OneDrive - UNSW/Documents/UNSW/2024/T2/COMP3900/capstone-project-3900h18bcrumpeteers/backend/db/metric_indicators.csv"
  LOAD DATA LOCAL INFILE "db/metric_indicators.csv"
    INTO TABLE MetricIndicators 
    FIELDS TERMINATED BY '|' 
      ENCLOSED BY '"'
    LINES TERMINATED BY '\r\n'
    IGNORE 1 ROWS 
    (metric_id, indicator_name);
  SHOW WARNINGS;

  # ALTER TABLE MetricIndicators ADD COLUMN indicator_id INT NOT NULL DEFAULT 0;
  UPDATE MetricIndicators
  INNER JOIN Indicators ON MetricIndicators.indicator_name = Indicators.name 
  SET MetricIndicators.indicator_id = Indicators.id;
EOF
echo $f 'ran'


