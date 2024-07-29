#!/usr/bin/env bash
# run this file in backend folder!
# to run, open bash terminal, and type ./import_data/import_official_frameworks.sh
MYSQL_OUTPUT="mysql_output.log"
host='crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com'
username='admin'
password='crumpeteers'
db='crumpeteers'

# below is required when importing to local db
# SET GLOBAL local_infile=1;

mysql --local-infile=1 -t -h $host -u $username --password=$password -t $db << EOF | tee -a $MYSQL_OUTPUT
  LOAD DATA LOCAL INFILE "db/official frameworks.csv"
    INTO TABLE Frameworks 
    FIELDS TERMINATED BY '|' 
      ENCLOSED BY '"'
    LINES TERMINATED BY '\r\n'
    IGNORE 1 ROWS 
    (id, framework_name, description);
  SHOW WARNINGS;

  UPDATE Frameworks
  SET
      is_official_framework = True,
      E = 0.33333,
      S = 0.33333,
      G = 0.33333;

EOF
  echo $f 'ran'