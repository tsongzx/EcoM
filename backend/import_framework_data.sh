#!/usr/bin/env bash
# change path to where you put your ESG data
cd "C:/Users/byunt/OneDrive - UNSW/Documents/UNSW/2024/T2/COMP3900/ESG Data"
MYSQL_OUTPUT="mysql_output.log"
host='crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com'
username='admin'
password='crumpeteers'
db='crumpeteers'

mysql --local-infile=1 -u admin -p -h crumpeteers.chg60uma2isb.ap-southeast-2.rds.amazonaws.com crumpeteers 

# below is required when importing to local db
# SET GLOBAL local_infile=1;

do
mysql --local-infile=1 -t -h $host -u $username --password=$password -t $db << EOF | tee -a $MYSQL_OUTPUT
  LOAD DATA LOCAL INFILE '$f'
    INTO TABLE CompanyList 
    FIELDS TERMINATED BY '|' 
      ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS 
    (company_name, perm_id, data_type, disclosure, metric_description, metric_name, metric_unit, metric_value, metric_year, nb_points_of_observations, metric_period, provider_name, reported_date, pillar, headquarter_country);
  SHOW WARNINGS;
EOF
  echo $f 'ran'
done

# Extract and display the summary from the output
# grep -E 'Query OK|Records|Deleted|Skipped|Warnings' $MYSQL_OUTPUT
LOAD DATA LOCAL INFILE "C:/Users/byunt/OneDrive - UNSW/Documents/UNSW/2024/T2/COMP3900/capstone-project-3900h18bcrumpeteers/backend/db/official frameworks.csv"
  INTO TABLE OfficialFrameworks 
  FIELDS TERMINATED BY '|' 
    ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS 
  (id, framework_name, description);
SHOW WARNINGS;