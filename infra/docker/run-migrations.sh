#!/bin/sh
set -eu

wait_for_mysql() {
  host="${MYSQL_HOST:-mysql}"
  port="${MYSQL_PORT:-3306}"
  attempts="${MYSQL_WAIT_ATTEMPTS:-60}"
  delay="${MYSQL_WAIT_DELAY_SECONDS:-2}"
  attempt=1

  echo "[migrate] Waiting for MySQL at ${host}:${port}"

  while [ "$attempt" -le "$attempts" ]; do
    if node -e "const net = require('node:net'); const host = process.argv[1]; const port = Number(process.argv[2]); const socket = net.createConnection({ host, port }); const fail = () => { socket.destroy(); process.exit(1); }; socket.setTimeout(2000, fail); socket.on('connect', () => { socket.end(); process.exit(0); }); socket.on('error', fail);" "$host" "$port"
    then
      echo "[migrate] MySQL is reachable"
      return 0
    fi

    echo "[migrate] MySQL not ready yet (${attempt}/${attempts}), retrying in ${delay}s"
    sleep "$delay"
    attempt=$((attempt + 1))
  done

  echo "[migrate] Timed out waiting for MySQL at ${host}:${port}" >&2
  return 1
}

run_deploy() {
  service_path="$1"

  echo "[migrate] Applying Prisma migrations for ${service_path}"
  npm run prisma:deploy -w "$service_path"
}

wait_for_mysql

run_deploy "services/auth-service"
run_deploy "services/store-service"
run_deploy "services/newsfeed-service"
run_deploy "services/app-service"
run_deploy "services/api-gateway"
