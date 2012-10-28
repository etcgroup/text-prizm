<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title><?php echo $page_title; ?></title>
        <?php echo css($app_css); ?>

        <script>
            var require = {
                baseUrl: "<?php echo js_url() ?>"
            }
        </script>

        <?php echo js('lib/require.js') ?>
        <?php echo js('common_config.js'); ?>
    </head>
    <body>
        <!-- #wrap and #push create the sticky footer effect -->

        <div id="sticky-wrapper">
            <div class="navbar navbar-inverse navbar-fixed-top">
                <div class="navbar-inner">
                    <div class="container-fluid">
                        <a class="brand" href="dashboard" class="active">Text Prizm</a>
                        <?php echo $nav_menu; ?>
                    </div>
                </div>
            </div>

            <div id="main" class="container-fluid">
                <?php echo $main_content; ?>
            </div>
            <div id="stiky-push"></div>
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
