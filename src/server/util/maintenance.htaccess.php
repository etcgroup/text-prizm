RewriteEngine On
RewriteBase <?php echo $this->install_config['site_path']; ?>

# The remaining two code lines close the site. They say:
# If the request is NOT for /maintenance.php, send /maintenance.php instead.
# Allowing maintenance.php to be served as-is prevents an endless redirect loop.
RewriteCond %{REQUEST_URI} !^/maintenance\.php$

# This line says: no matter what file was requested, serve maintenance.php.
# This is a rewrite (not a redirect), so we use the local file path, no http://
RewriteRule ^(.*)$ maintenance.php [L]