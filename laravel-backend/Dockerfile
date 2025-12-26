FROM php:8.4-apache

# -----------------------------
# Install system dependencies
# -----------------------------
RUN apt-get update && apt-get install -y \
    unzip git curl libzip-dev libpng-dev libonig-dev libxml2-dev \
    mariadb-client-compat \
    && docker-php-ext-install pdo pdo_mysql zip gd \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Install Composer
# -----------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# -----------------------------
# Set working directory
# -----------------------------
WORKDIR /var/www/html

# -----------------------------
# Install Laravel if not exists
# -----------------------------
RUN if [ ! -f artisan ]; then \
        composer create-project laravel/laravel . --prefer-dist --no-interaction; \
    fi

# -----------------------------
# Install dependencies
# -----------------------------
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader || composer install --no-interaction

# -----------------------------
# Set permissions
# -----------------------------
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# -----------------------------
# Apache: serve Laravel public folder
# -----------------------------
RUN sed -ri 's!DocumentRoot /var/www/html!DocumentRoot /var/www/html/public!g' /etc/apache2/sites-available/*.conf \
    && sed -ri 's!<Directory /var/www/html>!<Directory /var/www/html/public>!g' /etc/apache2/apache2.conf

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
EXPOSE 80

# -----------------------------
# Set SESSION_DRIVER to database (optional: file)
# -----------------------------
ENV SESSION_DRIVER=database

# -----------------------------
# Run migrations & start Apache
# -----------------------------
CMD bash -c "\
    php artisan key:generate && \
    php artisan config:clear && \
    php artisan migrate --force && \
    apache2-foreground"


RUN apt-get install -y mariadb-client-compat 