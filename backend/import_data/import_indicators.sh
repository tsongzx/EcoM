#!/usr/bin/env bash
# change path to where you put your ESG data
cd "C:/Users/byunt/OneDrive - UNSW/Documents/UNSW/2024/T2/COMP3900/ESG Data"
MYSQL_OUTPUT="mysql_output.log"
host='crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com'
username='admin'
password='crumpeteers'
db='crumpeteers'

# below is required when importing to local db
# SET GLOBAL local_infile=1;

for f in *.csv
do
mysql --local-infile=1 -t -h $host -u $username --password=$password -t $db << EOF | tee -a $MYSQL_OUTPUT
  LOAD DATA LOCAL INFILE '$f'
    INTO TABLE Indicators 
    FIELDS TERMINATED BY '|' 
      ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS 
    (@dummy, @dummy, data_type, @dummy, description, name, unit, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, pillar, @dummy);
  SHOW WARNINGS;
  UPDATE Indicators set source = "ClarityAI";
EOF
  echo $f 'ran'
done