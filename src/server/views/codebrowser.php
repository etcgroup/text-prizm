<?php
function edit_url($label, $which, $code_id, $n, $before, $after)
{
	return "<a href=\"" . base_url() . "codebrowser/examples/$which/$code_id/$n/$before/$after\">$label</a>";
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Code Browser</title>
        <?php echo css('codebrowser.css'); ?>

        <script type="text/javascript">
            window.user_id = <?php echo $user_id; ?>;
        </script>

        <?php echo js('lib/require.js', array('data-main' => js_url() . 'codebrowser_main')); ?>

    </head>
    <body>

        <?php
        echo "<h1>";
        echo edit_url("-", $which, $code_id, $n - 1, $before, $after);
        echo "$n";
        echo edit_url("+", $which, $code_id, $n + 1, $before, $after);
        echo "$which examples for code <em>$code</em></h1>";
        echo "<h2>";
        echo edit_url("-", $which, $code_id, $n, $before - 1, $after);
        echo "$before";
        echo edit_url("+", $which, $code_id, $n, $before + 1, $after);
        echo "minutes before and ";
        echo edit_url("-", $which, $code_id, $n, $before, $after - 1);
        echo "$after";
        echo edit_url("+", $which, $code_id, $n, $before, $after + 1);
        echo "minutes after</h2>";
        echo "<h3>logged in as $user_id</h3>";
        echo "<table>";
        foreach ($data as $arr)
        {
            echo "<tr><Td colspan=5><br><br><br><hr></td><td valign=bottom>";
            echo "<form>";
            for ($i = 1; $i <= 5; $i++)
            {
                echo "<input name=\"star" . $arr["id"] . " \" data-id=" . $arr["id"] . " type=\"radio\" class=\"srating required\" value=\"$i\"";
                if ($arr["rating"] == $i)
                    echo " checked";
                echo "/>";
            }
            echo "</form>";
            echo "<div class='avg" . $arr["id"] . " avg'><form>";
            for ($i = 1; $i <= 5; $i++)
            {
                echo "<input name=\"avg" . $arr["id"] . " \" data-id=" . $arr["id"] . " type=\"radio\" class=\"srating required\" value=\"$i\"";
                if (ceil($arr["avgrating"]) == $i)
                    echo " checked";
                echo " disabled/>";
            }
            echo "</div></form>";
            echo "</td></tr>\n";
            $cpar = "";
            foreach ($arr["conversation"] as $example)
            {
                $highlight = "";
                if ($example->id == $arr["id"])
                    $highlight = "highlight";
                echo "<tr><td class='time $highlight'>" . $example->time . "</td>";
                $par = $example->participant;
                if ($cpar == $par)
                    $par = "";
                else
                    $cpar = $par;
                echo "<td class='participant $highlight'>$par</td>";
                echo "<td class='message $highlight'>" . $example->message . "</td></tr>\n";
            }
        }
        echo "</table>";
        ?>
    </body>
</html>