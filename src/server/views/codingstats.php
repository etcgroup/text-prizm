<!DOCTYPE html>
<html>
    <head>
        <title>Coding Stats</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <?php echo css('codingstats.css'); ?>

        <script type="text/javascript">
            window.lines_by_person = <?php echo json_encode($lines_by_person); ?>;
            window.codes_by_line = <?php echo json_encode($codes_by_line); ?>;
        </script>
        <?php echo js('common_config.js'); ?>
        <?php echo js('lib/require.js', array('data-main' => js_url() . 'codingstats_main')); ?>
    </head>
    <body>
        <div id="container">
            <div id="legend"></div>
            <div id="chart"></div>
            <div id="stats">
                <div>
                    <h1><?php echo $total_lines_coded; ?></h1>
                    Total Lines Coded</div>
                <div>
                    <h2><?php echo $last_weeks_codes; ?></h2>
                    Lines Coded Last Week</div>
                <div>
                    <h2><?php echo $affect_code_count; ?></h2>
                    Coded Affect Lines</div>
            </div>
        </div>
        <div id="morestats">
            <h1>Lines Coded</h1>
            <div id="codes_total_chart" class="stdbar stdgraph"></div>
            <div id="codes_total" class="grid"></div>
            <h1>Affective State Codes</h1>
            <div id="affective_codes_chart" class="stdbar stdgraph"></div>
            <div id="affective_codes" class="grid"></div>
            <h1>Codes x Date</h1>
            <div id="codes_dates_chart" class="stdbar stdgraph"></div>
            <div id="codes" class="grid"></div>
        </div>
        <div id="tooltip" >
            <div id="tooltip_hdr" ></div>
            <div id="tooltip_content"></div>
        </div>
    </body>
    <script  type="text/template" id="legend-table-template">
        <h3><%= label %></h3>
        <table>
        </table>
    </script>
    <script  type="text/template" id="legend-item-template">
        <tr>
            <td class="<%= class1 %>" ></td>
            <td class="spacer" ></td>
            <td><%= name %></td>
        </tr>
    </script>
</html>

