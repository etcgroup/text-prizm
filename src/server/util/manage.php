<?php

define('BASEPATH', 'nobody better try to use this define');

/**
 * IniFileWriter based on Config_Lite (Config/Lite.php)
 * @link      https://github.com/pce/config_lite
 */
class IniFileWriter {

    /**
     * line-break chars, default *x: "\n", windows: "\r\n"
     *
     * @var string
     */
    protected $linebreak = "\n";

    /**
     * quote Strings - if true,
     * writes ini files with doublequoted strings
     *
     * @var bool
     */
    protected $quoteStrings = true;

    /**
     * generic write ini config file, to save use `save'.
     *
     * writes the global options and sections with normalized Values,
     * that means "bool" values to human readable representation,
     * doublequotes strings and numeric values without any quotes.
     * prepends a php exit if suffix is php,
     * it is valid to write an empty Config file,
     * this method is used by save and is public for explicit usage,
     * eg. if you do not want to hold the whole configuration in the object.
     *
     * @param string $filename      filename
     * @param array  $sectionsarray array with sections
     *
     * @return bool
     * @throws Config_Lite_Exception_Runtime when file is not writeable
     * @throws Config_Lite_Exception_Runtime when write failed
     */
    public function write($filename, $sectionsarray)
    {
        $content = $this->buildOutputString($sectionsarray);
        return file_put_contents($filename, $content, LOCK_EX);
    }

    /**
     * Generated the output of the ini file, suitable for echo'ing or
     * writing back to the ini file.
     *
     * @param string $sectionsarray array of ini data
     *
     * @return string
     */
    protected function buildOutputString($sectionsarray)
    {
        $content = '';
        $sections = '';
        $globals = '';
        if (!empty($sectionsarray))
        {
            // 2 loops to write `globals' on top, alternative: buffer
            foreach ($sectionsarray as $section => $item)
            {
                if (!is_array($item))
                {
                    $value = $this->normalizeValue($item);
                    $globals .= $section . ' = ' . $value . $this->linebreak;
                }
            }
            $content .= $globals;
            foreach ($sectionsarray as $section => $item)
            {
                if (is_array($item))
                {
                    $sections .= "\n[" . $section . "]\n";
                    foreach ($item as $key => $value)
                    {
                        if (is_array($value))
                        {
                            foreach ($value as $arrkey => $arrvalue)
                            {
                                $arrvalue = $this->normalizeValue($arrvalue);
                                $arrkey = $key . '[' . $arrkey . ']';
                                $sections .= $arrkey . ' = ' . $arrvalue
                                        . $this->linebreak;
                            }
                        }
                        else
                        {
                            $value = $this->normalizeValue($value);
                            $sections .= $key . ' = ' . $value . $this->linebreak;
                        }
                    }
                }
            }
            $content .= $sections;
        }
        return $content;
    }

    /**
     * normalize a Value by determining the Type
     *
     * @param string $value value
     *
     * @return string
     */
    protected function normalizeValue($value)
    {
        if (is_bool($value))
        {
            $value = $this->toBool($value);
            return $value;
        }
        elseif (is_numeric($value))
        {
            return $value;
        }
        if ($this->quoteStrings)
        {
            $value = '"' . $value . '"';
        }
        return $value;
    }

    /**
     * converts string to a  representable Config Bool Format
     *
     * @param string $value value
     *
     * @return string
     * @throws Config_Lite_Exception_UnexpectedValue when format is unknown
     */
    protected function toBool($value)
    {
        if ($value === true)
        {
            return 'yes';
        }
        return 'no';
    }

}

abstract class Util {

    static $action_stack = array();

    /**
     * Surrounds $path with '/' if not present already.
     * @param type $path
     * @return string
     */
    static function slashify($path)
    {
        if (strlen($path) == 0)
        {
            return '/';
        }

        if ($path[0] != '/')
        {
            $path = '/' . $path;
        }
        if ($path[strlen($path) - 1] != '/')
        {
            $path = $path . '/';
        }
        return $path;
    }

    /**
     * Generates a highly random encryption key suitable for CodeIgniter.
     * @return string
     */
    static function generate_key()
    {
        $time = microtime(true);
        $random = mt_rand(10000000, 99999999);
        $local = gethostname();
        $combo = uniqid($time . $random . $local, true);
        return sha1($combo);
    }

    /**
     * Is cli Request?
     *
     * Test to see if a request was made from the command line
     *
     * @return 	boolean
     */
    function is_cli_request()
    {
        return (php_sapi_name() == 'cli') or defined('STDIN');
    }

    /**
     * Replaces every occurrence of $searchs with $replaces
     * in the file.
     * searches and replaces may also be arrays of strings (same length arrays).
     * Returns FALSE if there is an error. Otherwise
     * it returns the length of the new file.
     * If $fail_if_none is true and no replacements were made, returns FALSE.
     * @param string $searches
     * @param string|array $replaces
     * @param string|array $filename
     * @param bool $fail_if_none
     * @return boolean
     */
    static function replace_in_file($searches, $replaces, $filename, $fail_if_none = FALSE)
    {
        if (is_string($searches) && is_string($replaces))
        {
            $searches = array($searches);
            $replaces = array($replaces);
        }
        else if (is_array($searches) && is_array($replaces))
        {
            if (count($searches) != count($replaces))
            {
                fatal('Different number of searche strings and replace strings');
            }
        }
        else
        {
            fatal('Invalid parameters to Util::file_replace().');
        }


        $contents = file_get_contents($filename);
        if ($contents)
        {
            for ($i = 0; $i < count($searches); $i++)
            {
                $search = $searches[$i];
                $replace = $replaces[$i];

                $contents_replaced = str_replace($search, $replace, $contents);
                if ($contents == $contents_replaced && $fail_if_none)
                {
                    warn('Could not find ' . $search . ' in ' . $filename);
                }
                $contents = $contents_replaced;
            }

            return file_put_contents($filename, $contents_replaced);
        }
        return FALSE;
    }

    /**
     * Gets the index into $haystack of a string containing $needle.
     * If no such string exists, returns FALSE.
     * @param array $haystack
     * @param string $needle
     * @return int|boolean
     */
    static function string_array_pos($haystack, $needle)
    {
        for ($i = 0; $i < count($haystack); $i++)
        {
            if (strpos($haystack[$i], $needle) !== FALSE)
            {
                return $i;
            }
        }
        return FALSE;
    }

    /**
     * Prints a prompt and gets a line of input from the user.
     * A default may be used if the user enters nothing.
     * @param string $msg
     * @param string $default
     * @return string
     */
    static function get_input($msg, $default = NULL)
    {
        echo PHP_EOL;
        $question = "> $msg";
        if ($default !== NULL)
        {
            $question .= " [$default]: ";
        }
        else
        {
            $question .= ': ';
        }
        $varin = NULL;
        while ($varin === NULL)
        {
            fwrite(STDOUT, $question);
            $varin = trim(fgets(STDIN));

            if (!$varin)
            {
                $varin = $default;
            }
        }
        echo PHP_EOL;
        return $varin;
    }

    static function action_start()
    {
        $trace = debug_backtrace(NULL);
        self::$action_stack[] = $trace[1]['function'];
        echo PHP_EOL;
    }

    static function action_end()
    {
        array_pop(self::$action_stack);
        echo PHP_EOL;
    }

    /**
     * Returns TRUE if the haytack ends with the needle.
     * http://stackoverflow.com/questions/834303/php-startswith-and-endswith-functions
     * @param type $haystack
     * @param type $needle
     * @return boolean
     */
    static function ends_with($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0)
        {
            return true;
        }

        return (substr($haystack, -$length) === $needle);
    }

    /**
     * Writes the given contents to the given file.
     * If the file does not exist, it is created.
     *
     * If it does exist, it is first backed up (by default).
     * Returns false if the file could not be saved,
     * or if an existing version could not be backed up.
     * @param type $filename
     * @param type $contents
     * @param type $backup
     * @return boolean
     */
    static function put_file($filename, $contents, $backup = TRUE)
    {
        if (file_exists($filename) && $backup)
        {
            if (!self::backup_file($filename))
            {
                return FALSE;
            }
        }

        out('Putting file ' . $filename);
        return file_put_contents($filename, $contents);
    }

    /**
     * Reverses put_file();
     * @param string $filename
     * @return boolean
     */
    static function unput_file($filename)
    {
        if (!file_exists($filename))
        {
            return FALSE;
        }


        $backup_filename = $filename . '.0.bak';
        if (file_exists($backup_filename))
        {
            return self::restore_file($filename);
        }
        else
        {
            out('Removing file ' . $filename);
            return unlink($filename);
        }
    }

    /**
     * Given a file, this function will create a backup copy.
     * A number and ".bak" will be added to the name.
     *
     * Returns false if the file did not exist or the backup was
     * not successful.
     * @param string $filename
     * @return boolean
     */
    static function backup_file($filename)
    {
        if (!file_exists($filename))
        {
            out('File ' . $filename . ' does not exist');
            return FALSE;
        }

        $number = 0;
        $backup_filename = $filename . '.' . $number . '.bak';
        while (file_exists($backup_filename))
        {
            $number++;
            $backup_filename = $filename . '.' . $number . '.bak';
        }

        out('Backing up ' . $filename . ' to ' . $backup_filename . '.');

        return copy($filename, $backup_filename);
    }

    /**
     * Restores a file that has been backed up.
     *
     * Returns FALSE if there is no backup,
     * or the backup was unsuccessful.
     * @param type $filename
     * @return boolean
     */
    static function restore_file($filename)
    {

        $number = 0;
        $backup_filename = $filename . '.' . $number . '.bak';
        while (file_exists($backup_filename))
        {
            $number++;
            $backup_filename = $filename . '.' . $number . '.bak';
        }
        //Backup one to the last one that existed
        $number--;
        $backup_filename = $filename . '.' . $number . '.bak';

        if (file_exists($backup_filename))
        {
            out('Restoring original ' . $filename . ' from ' . $backup_filename . '.');
            return rename($backup_filename, $filename);
        }

        out('No backup exists for ' . $filename . '.');
        return FALSE;
    }

}

function fatal($message = '')
{
    out('ERROR: ' . $message);
    exit(1);
}

function out($message = '')
{
    if (count(Util::$action_stack) > 0)
    {
        $action = Util::$action_stack[count(Util::$action_stack) - 1];
        $prefix = " [ $action ] ";
        $message = str_pad($prefix, 18, ' ', STR_PAD_LEFT) . $message;
    }

    echo $message . PHP_EOL;
}

function warn($message = '')
{
    out('WARNING: ' . $message);
    $continue = Util::get_input('Do you want to continue? (y/n)', 'y');
    if ($continue == 'y')
    {
        return;
    }
    else
    {
        fatal('Cancelled by user.');
    }
}

class Config {

    static $env_install = FALSE;
    static $env_install_name = FALSE;
    var $config_dir;
    var $util_dir;
    var $application_dir;
    var $base_dir;
    var $install_config;
    var $app_config;
    var $install_config_file;

    function __construct()
    {
        $this->util_dir = __DIR__;
        $this->application_dir = realpath($this->util_dir . '/..');
        $this->base_dir = realpath($this->application_dir . '/..');
        $this->config_dir = $this->application_dir . '/config';

        $this->install_config_file = $this->config_dir . '/.install.ini';
    }

    /**
     * Loads the install and app configs.
     */
    public function load_configs()
    {
        //Get the meta-configuration for this installation
        $this->read_install_config();

        //Get any needed application configurations
        $this->app_config = $this->get_config('app');
    }

    private function get_config($config_name)
    {
        out('Loading config/' . $config_name . '.php');
        $config = array();
        include $this->config_dir . '/' . $config_name . '.php';
        return $config;
    }

    /**
     * Reads the install config file.
     * Returns false if there isn't one.
     * @return boolean
     */
    private function read_install_config()
    {
        if (file_exists($this->install_config_file))
        {
            out('Loaded install config file.');
            $this->install_config = parse_ini_file($this->install_config_file, TRUE);
            return $this->install_config !== FALSE;
        }
        else
        {
            return FALSE;
        }
    }

    /**
     * Returns TRUE if an install config file exists.
     * @return type
     */
    function install_config_exists()
    {
        return file_exists($this->install_config_file);
    }

    /**
     * Creates a new install config file based on user prompts.
     * Note: you must still call load_configs to have access to it.
     * @return boolean
     */
    function collect_install_config()
    {
        $install_config = array(
            'db' => array(
                'hostname' => '',
                'username' => '',
                'password' => '',
                'database' => ''
            ),
            'site_path' => '',
            'htaccess_header' => ''
        );

        if (!self::$env_install)
        {
            $install_config['db']['hostname'] = Util::get_input('Database hostname?', 'localhost');
            $install_config['db']['username'] = Util::get_input('Database username?', 'root');
            $install_config['db']['password'] = Util::get_input('Database password?', '');
            $install_config['db']['database'] = Util::get_input('Database schema?');

            $install_config['site_path'] = Util::get_input('Path portion of your application\'s url?', '/');
            $install_config['htaccess_header'] = Util::get_input('Any special header for your .htaccess file?', '');
        }
        else
        {
            $this->collect_env_install($install_config, self::$env_install_name);
        }

        $install_config['site_path'] = Util::slashify($install_config['site_path']);
        $install_config['htaccess_header'] = str_replace('\n', "\n", $install_config['htaccess_header']);

        out('Configuration:');
        var_dump($install_config);

        $this->install_config = $install_config;
    }

    /**
     * Gets the install config by $name from the environment.
     * @param array $install_config
     * @param string $name
     */
    function collect_env_install(&$install_config, $name)
    {
        $install_config['db']['hostname'] = $_ENV['MYSQL_RUNTIME_HOST'];
        if ($_ENV['MYSQL_PORT'])
        {
            $install_config['db']['hostname'] .= ':' . $_ENV['MYSQL_PORT'];
        }
        $install_config['db']['username'] = $_ENV['MYSQL_' . $name . '_USER'];
        $install_config['db']['password'] = $_ENV['MYSQL_' . $name . '_PASSWORD'];
        $install_config['db']['database'] = $_ENV['MYSQL_' . $name . '_DATABASE'];

        $install_config['site_path'] = $_ENV['BASE_URL_' . $name];
        $install_config['htaccess_header'] = $_ENV['HTACCESS_HEADER'];
    }

    function save_install_config($install_config = NULL)
    {
        if ($install_config == NULL)
        {
            $install_config = $this->install_config;
        }
        $writer = new IniFileWriter();
        if (!$writer->write($this->install_config_file, $install_config))
        {
            fatal('Unable to save ' . $this->install_config_file);
        }
        else
        {
            out('Saved install config file.');
            return TRUE;
        }
    }

    /**
     * Enables or disables migrations.
     * @param bool $enabled
     */
    function set_migrations($enabled)
    {
        $enabled_str = '$config[\'migration_enabled\'] = TRUE;';
        $disabled_str = '$config[\'migration_enabled\'] = FALSE;';
        $migration_config = $this->config_dir . '/migration.php';
        if ($enabled)
        {
            out('Enabling migrations');
            Util::replace_in_file($disabled_str, $enabled_str, $migration_config)
                    || fatal('Could not enable migrations');
        }
        else
        {
            out('Disabling migrations');
            Util::replace_in_file($enabled_str, $disabled_str, $migration_config)
                    || fatal('Could not disable migrations');
        }
    }

    function place_standard_htaccess()
    {
        $htaccess_src = $this->util_dir . '/standard.htaccess.php';
        $htaccess_dest = $this->base_dir . '/.htaccess';

        //Get the contents of htaccess
        ob_start();
        include $htaccess_src;
        $htaccess_content = ob_get_clean();

        if (!Util::put_file($htaccess_dest, $htaccess_content, FALSE))
        {
            fatal('Unable to put standard .htaccess in place');
        }

        return TRUE;
    }

    function is_maintenance_on()
    {
        $maintenance_dest = $this->base_dir . '/maintenance.php';
        return file_exists($maintenance_dest);
    }

    /**
     * Activates maintenance mode.
     */
    function maintenance_on()
    {
        $maintenance_src = $this->util_dir . '/maintenance.php';
        $htaccess_src = $this->util_dir . '/maintenance.htaccess.php';

        $maintenance_dest = $this->base_dir . '/maintenance.php';
        $htaccess_dest = $this->base_dir . '/.htaccess';

        if ($this->is_maintenance_on())
        {
            out('Maintenance mode was already enabled. Nothing to do.');
            return TRUE;
        }

        //Get the contents of htaccess
        ob_start();
        include $htaccess_src;
        $htaccess_content = ob_get_clean();

        if (!Util::put_file($htaccess_dest, $htaccess_content, FALSE))
        {
            fatal('Unable to put maintenance .htaccess in place');
        }

        out('Creating maintenance.php');
        if (!copy($maintenance_src, $maintenance_dest))
        {
            fatal('Unable to put maintenance.php in place');
        }

        return TRUE;
    }

    /**
     * Deactivates maintenance mode.
     */
    function maintenance_off()
    {
        $maintenance_dest = $this->base_dir . '/maintenance.php';
        $htaccess_dest = $this->base_dir . '/.htaccess';

        if (!$this->is_maintenance_on())
        {
            out('Maintenance mode was already off. Nothing to do.');
            return TRUE;
        }

        if (!$this->place_standard_htaccess())
        {
            fatal('Unable to restore standard .htaccess');
        }
        out('Removing maintenance.php');
        if (!unlink($maintenance_dest))
        {
            fatal('Unable to remove maintenance.php');
        }

        return TRUE;
    }

    /**
     * Sets up the CodeIgniter configs which are
     * fresh from the source code with certain
     * settings.
     */
    function refresh_configs()
    {
        //Set the encryption key
        out('Generating encryption key for config/config.php');
        $key = Util::generate_key();
        $before_str = '$config[\'encryption_key\'] = \'\';';
        $after_str = '$config[\'encryption_key\'] = \'' . $key . '\';';
        $main_config = $this->config_dir . '/config.php';
        Util::replace_in_file($before_str, $after_str, $main_config)
                || fatal('Could not set the encryption key');

        //Set up the database connection
        out('Placing database configuration in config/database.php');
        $db_conf = $this->install_config['db'];
        $before_str = array(
            '$db[\'default\'][\'hostname\'] = \'\'',
            '$db[\'default\'][\'username\'] = \'\'',
            '$db[\'default\'][\'password\'] = \'\'',
            '$db[\'default\'][\'database\'] = \'\''
        );
        $after_str = array(
            '$db[\'default\'][\'hostname\'] = \'' . $db_conf['hostname'] . '\'',
            '$db[\'default\'][\'username\'] = \'' . $db_conf['username'] . '\'',
            '$db[\'default\'][\'password\'] = \'' . $db_conf['password'] . '\'',
            '$db[\'default\'][\'database\'] = \'' . $db_conf['database'] . '\''
        );
        $database_config = $this->config_dir . '/database.php';
        Util::replace_in_file($before_str, $after_str, $database_config)
                || fatal('Could not set up the database connection');
    }

    /**
     * Returns TRUE if the installation has completed successfully.
     * @return boolean
     */
    function is_fully_installed()
    {
        if ($this->install_config_exists())
        {
            $this->load_configs();
            if (array_key_exists('install_complete_time', $this->install_config))
            {
                return TRUE;
            }
        }
        return FALSE;
    }

}

class Database {

    /**
     * @var Config
     */
    var $config;

    function __construct($config)
    {
        $this->config = $config;
    }

    /**
     * Migrates the database to the latest version.
     */
    function do_migration()
    {
        // First enable migrations.
        $this->config->set_migrations(true);

        out('Performing database migration...');

        $exec_msg = exec('php ' . $this->config->base_dir . '/index.php migrate index', $exec_output, $exec_return);
        $error_msg_line = Util::string_array_pos($exec_output, 'error');
        if ($error_msg_line !== FALSE)
        {
            fatal('Migration error: ' . $exec_output[$error_msg_line]);
        }

        out('Migration complete!');

        // Then disable migrations.
        $this->config->set_migrations(false);
    }

}

class Manager {

    /**
     * @var Config
     */
    var $config;

    /**
     * @var Database
     */
    var $db;

    function __construct()
    {
        $this->config = new Config();
        $this->db = new Database($this->config);
    }

    /**
     * Enables the application after maintenance.
     */
    function up()
    {
        Util::action_start();

        out('Putting the application up...');

        if (!$this->config->is_fully_installed())
        {
            fatal('The installation has not yet been completed.');
        }

        if (array_key_exists('upgrade_begin_time', $this->config->install_config))
        {
            warn('A previous upgrade did not complete. Are you sure you want to continue? (y/n)', 'n');
        }

        $this->config->maintenance_off();

        out('The application is up and running.');

        Util::action_end();
    }

    /**
     * Disables the application for maintenance.
     */
    function down()
    {
        Util::action_start();

        out('Taking the application down...');

        if (!$this->config->is_fully_installed())
        {
            fatal('The installation has not yet been completed.');
        }

        $this->config->maintenance_on();

        out('The application is down.');

        Util::action_end();
    }

    /**
     * Performs tasks needed for a fresh installation of the application.
     */
    function install()
    {
        Util::action_start();

        out('Installing the application...');

        if ($this->config->install_config_exists())
        {
            $this->config->load_configs();
            if (array_key_exists('install_complete_time', $this->config->install_config))
            {
                out('Installation already in place. Switching to upgrade.');
                $this->upgrade();
                Util::action_end();
                return;
            }

            if (array_key_exists('install_begin_time', $this->config->install_config))
            {
                warn('A previous installation did not complete. Are you sure you want to continue? (y/n)', 'n');
            }

            if (array_key_exists('upgrade_begin_time', $this->config->install_config))
            {
                warn('A previous UPGRADE did not complete. Are you sure you want to continue? (y/n)', 'n');
            }
        }
        else
        {
            if (Config::$env_install)
            {
                out('Reading install config from environment...');
            }
            else
            {
                warn('You have no install config file. Would you like to create one? (y/n)', 'y');
            }
            $this->config->collect_install_config();
        }

        //Mark the installation as begun
        $this->config->install_config['install_begin_time'] = time();
        $this->config->save_install_config();

        //Generate the CI configuration
        $this->config->refresh_configs();

        //Put up the standard .htaccess file
        $this->config->place_standard_htaccess();

        //Create the database
        $this->db->do_migration();

        //Mark the installation as complete
        $this->config->install_config['install_complete_time'] = time();
        unset($this->config->install_config['install_begin_time']);
        $this->config->install_config['app'] = $this->config->app_config;
        $this->config->save_install_config();

        out('Hooray! The installation is complete.');

        Util::action_end();
    }

    /**
     * Performs tasks for an upgrade.
     */
    function upgrade()
    {
        Util::action_start();

        out('Beginning upgrade...');

        if (!$this->config->is_fully_installed())
        {
            fatal('The installation has not yet been completed.');
        }

        if (array_key_exists('upgrade_begin_time', $this->config->install_config))
        {
            warn('A previous upgrade did not complete. Are you sure you want to continue? (y/n)', 'n');
        }

        if (!$this->config->is_maintenance_on())
        {
            fatal('You must put the application in maintenance mode before an upgrade!');
        }

        //Mark the upgrade as begun
        $this->config->install_config['upgrade_begin_time'] = time();
        $this->config->save_install_config();

        //Regenerate the configs (they were probably overwritten during upload)
        $this->config->refresh_configs();

        //Upgrade the database
        $this->db->do_migration();

        //Mark the upgrade complete
        $this->config->install_config['upgrade_complete_time'] = time();
        unset($this->config->install_config['upgrade_begin_time']);
        $this->config->install_config['app'] = $this->config->app_config;
        $this->config->save_install_config();

        out('Upgrade complete.');

        Util::action_end();
    }

}

if (!Util::is_cli_request())
{
    echo 'No web access';
    die(1);
}

$methods = get_class_methods('Manager');

if ($argc == 1)
{
    echo 'Usage: php manage.php ACTION' . PHP_EOL;
    echo PHP_EOL;
    echo 'Available actions:' . PHP_EOL;

    foreach ($methods as $method_name)
    {
        if (strpos($method_name, '_') === FALSE)
        {
            echo '   ' . $method_name . PHP_EOL;
        }
    }

    exit(1);
}
else if ($argc >= 2)
{
    $method_name = $argv[1];

    if ($argc >= 3)
    {
        if ($argv[2] === 'env-install')
        {
            Config::$env_install = TRUE;
            if ($argc == 3)
            {
                fatal('Must specify name for env-install');
            }
            Config::$env_install_name = $argv[3];
        }
    }

    $manager = new Manager();
    if (!method_exists($manager, $method_name))
    {
        fatal('Invalid method ' . $method_name . '.');
    }

    call_user_func(array(&$manager, $method_name));
}