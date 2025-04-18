#!/usr/bin/env bash

# change path to where you put your ESG data
cd "/Users/tinasong/Desktop/ESG"
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
    INTO TABLE CompanyData 
    FIELDS TERMINATED BY '|' 
      ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS 
    (company_name, perm_id, @dummy, disclosure, @dummy, indicator_name, @dummy, indicator_value, indicator_year, nb_points_of_observations, indicator_period, provider_name, reported_date, @dummy, @dummy);
  SHOW WARNINGS;
  # UPDATE CompanyData SET indicator_year_int = EXTRACT(YEAR FROM indicator_year);
EOF
  echo $f 'ran'
done

# after loop is done
# ALTER TABLE CompanyData ADD column_name indicator_year_int;
