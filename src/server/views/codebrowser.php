<?php
/**
 * Renders a table of example messages with context, for a specific code.
 */

/**
 * Generates a link to a modified code examples view.
 *
 * @param string $label The link label
 * @param string $which The type of example list to show
 * @param int $code_id The code id to show examples for
 * @param int $number The number of examples to show
 * @param int $before The number of messages before the example to include
 * @param int $after The number of messages after the example to include
 * @return string
 */
function edit_url($label, $which, $code_id, $number, $before, $after)
{
    return '<a href="' . base_url() .
            'codebrowser/examples/'.
            $which . '/' .
            $code_id . '/' .
            $number . '/' .
            $before . '/' .
            $after . '">' .
            $label . '</a>';
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
        echo '<h1>';
        echo edit_url('-', $which, $code_id, $number - 1, $before, $after);
        echo $number;
        echo edit_url('+', $which, $code_id, $number + 1, $before, $after);
        echo "{$which} examples for code <em>{$code}</em></h1>";
        echo '<h2>';
        echo edit_url('-', $which, $code_id, $number, $before - 1, $after);
        echo $before;
        echo edit_url('+', $which, $code_id, $number, $before + 1, $after);
        echo 'minutes before and ';
        echo edit_url('-', $which, $code_id, $number, $before, $after - 1);
        echo $after;
        echo edit_url('+', $which, $code_id, $number, $before, $after + 1);
        echo 'minutes after</h2>';
        echo "<h3>logged in as {$user_id}</h3>";
        echo '<table>';
        foreach ($examples as $messages)
        {
            echo '<tr><Td colspan=5><br><br><br><hr></td><td valign=bottom>';
            echo '<form>';
            for ($i = 1; $i <= 5; $i++)
            {
                echo '<input name="star' . $messages['id'] . ' " data-id="' . $messages['id'] . '" type="radio" class="srating required" value="$i"';
                if ($messages['rating'] === $i)
                    echo ' checked';
                echo '/>';
            }
            echo '</form>';
            echo '<div class="avg' . $messages['id'] . ' avg"><form>';
            for ($i = 1; $i <= 5; $i++)
            {
                echo '<input name="avg' . $messages['id'] . ' " data-id="' . $messages['id'] . '" type="radio" class="srating required" value="' . $i . '"';
                if (ceil($messages['avgrating']) === $i)
                    echo ' checked';
                echo ' disabled/>';
            }
            echo '</div></form>';
            echo '</td></tr>' . PHP_EOL;
            $previous_participant = '';
            foreach ($messages['conversation'] as $message)
            {
                $highlight = '';
                if ($message->id === $messages['id'])
                    $highlight = 'highlight';
                echo "<tr><td class='time {$highlight}'>" . $message->time . '</td>';
                $participant = $message->participant;
                if ($previous_participant === $participant)
                    $participant = '';
                else
                    $previous_participant = $participant;
                echo "<td class='participant {$highlight}'>{$participant}</td>";
                echo "<td class='message {$highlight}'>" . $message->message . '</td></tr>' . PHP_EOL;
            }
        }
        echo '</table>';
        ?>
    </body>
</html>
