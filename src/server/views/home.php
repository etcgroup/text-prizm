<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Home</title>
        <?php echo css('reset.css'); ?>
    </head>
    <body>
        <h1>Hello <?php echo $user->name ?>!</h1>
        <p>Some useful links:</p>
        <ul>
            <li><a href="codingstats">Coding Stats</a></li>
            <li><a href="coding">Coding Tools</a></li>
            <li><a href="codebrowser">Code Browser</a></li>
        </ul>
    </body>
</html>