#!/usr/bin/env bash
# change path to where you put your ESG data
cd '/Users/tinasong/Desktop/ESG'
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
    INTO TABLE Companies 
    FIELDS TERMINATED BY '|' 
      ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS 
    (company_name, perm_id, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, headquarter_country);
  SHOW WARNINGS;
EOF
  echo $f 'ran'
done

# Extract and display the summary from the output
# grep -E 'Query OK|Records|Deleted|Skipped|Warnings' $MYSQL_OUTPUT
