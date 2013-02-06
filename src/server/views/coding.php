<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Coding</title>

        <?php
        $path_to_app = parse_url(base_url());
        $cache_string = 'v=' . substr($build_revision, 0, 8);
        ?>

        <?php echo css('coding.css?' . $cache_string); ?>

        <?php echo js('common_config.js'); ?>
        <?php echo js('lib/require.js') ?>

        <script type="text/javascript">
<?php if (isset($get_all_users) && $get_all_users): ?>
        window.get_all_users = true;
<?php endif; ?>

    window.coding_options ={
        version: "<?php echo $version ?>",
        schemaId: <?php echo $schema_id ?>,
        codes: <?php echo json_encode($codes); ?>,
        participants: <?php echo json_encode($participants); ?>,
        users: <?php echo json_encode($users); ?>,
        userId: <?php echo $user_id ?>
    };

    require.config({
        baseUrl: "<?php echo js_url() ?>",
        urlArgs: "<?php echo $cache_string; ?>"
    });

    window.baseUrl = '<?php echo $path_to_app['path']; ?>';
        </script>
    </head>
    <body>
        <div id="general-info"></div>
        <div id="outer">
            <div id="topsection">
            </div>
            <div id="contentwrapper">
                <div id="contentcolumn" tabindex="0">
                    <div id="message-list-view">
                        <ul></ul> <!-- The actual message list view -->
                    </div>
                    <div id="code-filter-view"></div>
                    <div id="grid-selector-view"></div>
                </div>
            </div>
            <div id="leftcolumn">
                <div id="frequency-view"></div>
            </div>
            <div id="rightcolumn">
                <div id="code-selectors">
                    <div id="rbgrid" class="unselectable"></div>
                    <div id="codeListView"></div>
                </div>
                <div id="info-box">
                    <div id="code-info">
                        <div id="ci-description-box">
                            <h3>Code</h3>
                            <p>Code Info</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/template" id="message-template">
            <div class="clearfix" data-message_id="<%=get('id')%>">
                <div class="fluid-column-wrapper">
                    <div class="fluid-column">
                        <div class="message"><%= get('message') %></div>
                        <div class="time" title="<%=Date.parse(get('time')).toString('h:mm:ss tt M/d/yyyy')%>">
                            <%=Date.parse(get('time')).toString('h:mm:ss tt')%> <i class="faded">s<%= get('session_id')%></i>
                        </div>
                        <ul class="instances"></ul>
                    </div>
                </div>
                <div class="left-column" title="<%=get('participant').get('name')%>">
                    <div class="participant">
                        <% if (get('speaker_changed')) { %>
                        <%= get('participant').get('name')%>:
                        <% } %>
                    </div>
                    <div class="participantIndicator"></div>
                </div>
            </div>
        </script>
        <script type="text/template" id="code-instance-template">
            <div class="instance <%= get('flag') == 1 ? 'flagged' : '' %>" data-id="<%=get('id')%>"
                 title="by <%=get('user').get('name')%><%= get('added') ? ' at ' + Date.parse(get('added')).toString('h:mm:ss tt M/d/yyyy') : '' %>">
                <%=get('code').get('name')%>
                <div class="deleter"></div>
            </div>
        </script>
        <script type="text/template" id="code-filter-template">
            <span class="filter-box"></span><span class="cursor">|</span>
            <span class="code-box"></span>
        </script>
        <script type="text/template" id="grid-selector-template">
            <div class="title"><%= title %></div>
            <div class="grid"></div><div class="label"></div>
        </script>
        <script type="text/template" id="general-info-template">
            <div class="info-group">
                <span class="title"><?php echo $this->config->item('name') ?> <%= version %></span> <a target="_blank" href="coding/notes">notes</a><br />
                User: <%= user_name %>
            </div>
            <div class="info-group">
                Viewing: <a href="<%=link_to_viewer%>"><%= time_interval %> starting from <%= from_time %></a><br/>
                Data: <%= message_count %> messages, working in code scheme <%= schema_id %>
            </div>
            <div class="right">
                <a class="button" id="copy-paste-button" title="Click this to allow copy-paste.">Enable Copy Paste</a>
                <a class="button" id="fix-selection-button" title="If the message selection gets weird, try this or refreshing.">Fix Broken Selection</a>
                <input id="codeEntryBox" title="Type a new code to add here"></input>
                <a class="button" id="create-code-button" title="If the box flashes yellow the code already exists. Red indicates an error.">Create Code</a>
            </div>
            <div id="coding-progress" class="info-group">
                <span>Messages Coded</span><br />
                <div id="coding-progress-bar-outer">
                    <div id="coding-progress-bar-inner"></div>
                </div>
            </div>
        </script>

        <script>
            var app = require(["coding_main"]);
        </script>
    </body>
</html>
