TRIES=${TRIES:-3}
INTERVAL=${INTERVAL:-5}

i=$TRIES
ok=1

while true; do
    make db-migrate
    ok=$?
    i=$(($i-1))
    ([ $ok -eq 0 ]  || [ $i -le 0 ]) && break
    sleep $INTERVAL
done

return $ok
