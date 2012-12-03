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
 * @param string $text The label for the menu item.
 * @param string $page_id The page id for this menu item.
 * @param string $active_page_id The page id for the current active menu item.
 * @param string $href (optional) The url for the menu item. Defaults to the page id.
 *
 * @return string
 */
function nav_menu_item($text, $page_id, $active_page_id, $href = NULL)
{
    $attrs = '';
    if ($active_page_id === $page_id)
    {
        $attrs = 'class="active"';
    }

    //Use the $page_id as the href by default.
    if ($href === NULL)
    {
        $href = $page_id;
    }

    return "<li {$attrs}><a href='{$href}'>{$text}</a></li>";
}
?>
<ul class="nav">
    <?php
    echo nav_menu_item('Dashboard', 'dashboard', $active_nav, '');
    echo nav_menu_item('Coding Stats', 'codingstats', $active_nav);
    echo nav_menu_item('Code Browser', 'codebrowser', $active_nav);
    echo nav_menu_item('Coding Tool', 'coding', $active_nav);
    echo nav_menu_item('Didiera', 'didiera', $active_nav);
    ?>
</ul>
