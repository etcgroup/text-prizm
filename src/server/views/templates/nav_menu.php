<?php

function nav_menu_item($href, $text, $active_href)
{
    $attrs = '';
    if ($active_href === $href)
    {
        $attrs = 'class="active"';
    }
    return "<li $attrs><a href='$href'>$text</a></li>";
}
?>
<ul class="nav">
    <?php
    echo nav_menu_item("dashboard", "Dashboard", $active_nav);
    echo nav_menu_item("codingstats", "Coding Stats", $active_nav);
    echo nav_menu_item("codebrowser", "Code Browser", $active_nav);
    echo nav_menu_item("coding", "Coding Tool", $active_nav);
    ?>
</ul>