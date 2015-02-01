# Schema Information

I will not be implementing a database unless I get to the bonus features, and even then
I am not sure I will want to.  I didn't separate the user from tweet itself because
there will never be searching features by user.  Ideally this would be saved in a mongo database,
because often times the tweets received have null values.

## Tweets
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
geo_lat     | integer   | not null
geo_lng     | integer   | not null
favorites   | integer   | not null
tw_id       | integer   | not null
retw_count  | integer   | not null
text        | string    | not null
user_id     | integer   | not null
user_name   | string    | not null

