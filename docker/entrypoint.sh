#!/bin/sh
set -e

# Render's generated secrets are plain base64; Laravel expects "base64:" in front.
case "$APP_KEY" in
    base64:*) ;;
    "") echo "APP_KEY is not set" >&2; exit 1 ;;
    *) export APP_KEY="base64:$APP_KEY" ;;
esac

# Render gives the port to listen on in $PORT.
if [ -n "$PORT" ]; then
    sed -ri "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
    sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf
fi

php artisan package:discover --ansi
php artisan config:cache
php artisan route:cache
php artisan view:cache
# The commands above run as root; Apache runs as www-data and must be able to write here.
chown -R www-data:www-data storage bootstrap/cache

exec "$@"
