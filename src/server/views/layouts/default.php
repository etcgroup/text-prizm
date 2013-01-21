<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title><?php echo $page_title; ?></title>
        <?php echo css($app_css); ?>

        <?php echo js('common_config.js'); ?>
        <?php echo js('lib/require.js') ?>
        <script>
            require.config({
                baseUrl: "<?php echo js_url() ?>"
            });

            window.baseUrl = '<?php echo base_url(); ?>';
        </script>
    </head>
    <body>
        <!-- #wrap and #push create the sticky footer effect -->

        <div id="sticky-wrapper">
            <div class="navbar navbar-inverse navbar-fixed-top">
                <div class="navbar-inner">
                    <div class="container-fluid">
                        <a class="brand" href=""><?php echo $this->config->item('name') ?></a>
                        <?php echo $nav_menu; ?>
                    </div>
                </div>
            </div>

            <div id="main" class="container-fluid">
                <?php echo $main_content; ?>
            </div>
            <div id="sticky-push"></div>
        </div>

        <div id="footer" class="container-fluid">
            <div class="row-fluid">
                <?php echo $footer; ?>
            </div>
        </div>

        <script>
            var app = require(["<?php echo $app_js ?>"]);
        </script>
    </body>
</html>
