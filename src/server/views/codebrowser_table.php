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
        echo "<table id='overview'><thead><tr><th>Code</th><Th>Flagged, Unedited by Me</th><Th>Flagged, Unedited by Anyone</th><Th>Flagged</th><Th>Total</th><th>View Examples</th></tr></thead>";
        foreach ($codes as $code)
        {
            echo "<tr><Td>" . $code->name . "</td><Td>" . $code->counts["fum"] . "</td><Td>" . $code->counts["fua"] . "</td><Td>" . $code->counts["ft"] . "</td><Td>" . $code->counts["t"] . "</td><td class='links'><a href=\"" . base_url() . "codebrowser/examples/best/" . $code->id . "\">best</a> | <a href=\"" . base_url() . "codebrowser/examples/random/" . $code->id . "\">rand</a> | <a href=\"" . base_url() . "codebrowser/examples/flagged/" . $code->id . "\">flag</a></td></tr>\n";
        }
        echo "</table>";
        ?>
    </body>
</html>