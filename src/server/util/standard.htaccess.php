<?php echo $this->install_config['htaccess_header']; ?>

RewriteEngine on
RewriteBase <?php echo $this->install_config['site_path']; ?>

# Rewrite trailing slashes to non-trailing-slash equivalents
RewriteCond %{REQUEST_URI} /$ [NC]
RewriteRule ^(.*)/$ $1 [NC,L,R=301]

RewriteCond $1 !^(index\.php|assets|robots\.txt)
RewriteRule ^(.*)$ index.php?/$1 [L]