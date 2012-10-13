<?php echo $this->install_config['htaccess_header']; ?>

RewriteEngine on
RewriteBase <?php echo $this->install_config['site_path']; ?>

RewriteCond $1 !^(index\.php|assets|robots\.txt)
RewriteRule ^(.*)$ index.php?/$1 [L]