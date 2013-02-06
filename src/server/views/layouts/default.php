<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title><?php echo $page_title; ?></title>

        <?php
        $path_to_app = parse_url(base_url());
        $cache_string = 'v=' . substr($build_revision, 0, 8);
        ?>

        <?php echo css($app_css . '?' . $cache_string); ?>

        <?php echo js('common_config.js?' . $cache_string); ?>
        <?php echo js('lib/require.js?' . $cache_string) ?>

        <script>
            require.config({
                baseUrl: "<?php echo js_url() ?>",
                urlArgs: "<?php echo $cache_string; ?>"
            });


            window.baseUrl = '<?php echo $path_to_app['path']; ?>';
        </script>
    </head>
    <body>
        <!-- #wrap and #push create the sticky footer effect -->

        <div id="sticky-wrapper">
            <div class="navbar navbar-inverse navbar-fixed-top">
                <div class="navbar-inner">
                    <div class="container-fluid">
                        <a class="brand" href="<?php echo base_url(); ?>"><?php echo $this->config->item('name') ?></a>
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

        <div id="alert-box"></div>

        <script>
            var app = require(["<?php echo $app_js ?>"]);
        </script>
    </body>
</html>
