
#!/bin/bash

status=`curl -s -o /dev/null -w "%{http_code}" http://smidgen.sechouse.tech`
echo `date` $status >> crash_checks.log

if [ "$status" -ne "200" ]
then
       # Take any appropriate recovery action here.
	echo "webserver seems down, restarting." >> check.log
        nohup python3 ~/projects/smidgen/smflask.py &
fi
