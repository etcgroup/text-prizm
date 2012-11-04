<?php
/**
 * Template for generating a top-level navigation menu.
 * Expects $active_nav to be defined.
 */

/**
 * Generates a menu item with the provided
 * link and text. If the link is equal to the active
 * link, then the menu item is marked active.
 *
 * @param string $href The url for the menu item.
 * @param string $text The label for the menu item.
 * @param string $active_href The url for the current active menu item.
 * @return string
 */
function nav_menu_item($href, $text, $active_href)
{
    $attrs = '';
    if ($active_href === $href)
    {
        $attrs = 'class="active"';
    }
    return "<li {$attrs}><a href='{$href}'>{$text}</a></li>";
}
?>
<ul class="nav">
    <?php
    echo nav_menu_item('dashboard', 'Dashboard', $active_nav);
    echo nav_menu_item('codingstats', 'Coding Stats', $active_nav);
    echo nav_menu_item('codebrowser', 'Code Browser', $active_nav);
    echo nav_menu_item('coding', 'Coding Tool', $active_nav);
    ?>
</ul>
