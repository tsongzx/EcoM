#!/usr/bin/env bash
# run this file in backend folder!
# to run, open bash terminal, and type ./import_data/import_metrics.sh
MYSQL_OUTPUT="mysql_output.log"
host='crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com'
username='admin'
password='crumpeteers'
db='crumpeteers'

# below is required when importing to local db
# SET GLOBAL local_infile=1;

mysql --local-infile=1 -t -h $host -u $username --password=$password -t $db << EOF | tee -a $MYSQL_OUTPUT
  # commented below is for local use
  # LOAD DATA LOCAL INFILE "C:/Users/byunt/OneDrive - UNSW/Documents/UNSW/2024/T2/COMP3900/capstone-project-3900h18bcrumpeteers/backend/db/metrics.csv"
  LOAD DATA LOCAL INFILE "db/metrics.csv"
    INTO TABLE Metrics 
    FIELDS TERMINATED BY '|' 
      ENCLOSED BY '"'
    LINES TERMINATED BY '\r\n'
    IGNORE 1 ROWS 
    (id, name);
  SHOW WARNINGS;

  CREATE temporary table mapping AS
  SELECT category, metric_id
  FROM OfficialFrameworkMetrics
  GROUP BY metric_id;

  UPDATE Metrics m 
  JOIN mapping ON m.id = mapping.metric_id
  SET m.category = mapping.category;
EOF
  echo $f 'ran'
