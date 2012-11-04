<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Code Browser - Overview</title>
        <?php echo css('codebrowser_table.css'); ?>

        <?php echo js('lib/require.js', array('data-main' => js_url() . 'codebrowser_table_main')); ?>

    </head>
    <body>
        <?php
        echo '<table id="overview"><thead><tr><th>Code</th><Th>Flagged, Unedited by Me</th><Th>Flagged, Unedited by Anyone</th><Th>Flagged</th><Th>Total</th><th>View Examples</th></tr></thead>';
        foreach ($codes as $code)
        {
            echo '<tr>';
            echo '<td>' . $code->name . '</td>';
            echo '<td>' . $code->counts['fum'] . '</td>';
            echo '<td>' . $code->counts['fua'] . '</td>';
            echo '<td>' . $code->counts['ft'] . '</td>';
            echo '<td>' . $code->counts['t'] . '</td>';
            echo '<td class="links">';
            echo '<a href="' . base_url() . 'codebrowser/examples/best/' . $code->id . '">best</a> | ';
            echo '<a href="' . base_url() . 'codebrowser/examples/random/' . $code->id . '">rand</a> | ';
            echo '<a href="' . base_url() . 'codebrowser/examples/flagged/' . $code->id . '">flag</a>';
            echo '</td></tr>' . PHP_EOL;
        }
        echo '</table>';
        ?>
    </body>
</html>
