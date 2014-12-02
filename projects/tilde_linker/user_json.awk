#!/usr/bin/awk -f

# Gets user names from /etc/passwd and outputs a JSON object

BEGIN   { FS=":" }

        { if ( $3 >= 1000 && $3 <= 60000 ) print  $1 }