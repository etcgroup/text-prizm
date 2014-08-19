Text Prizm
==========

A web application for collaborative qualitative coding of
large volumes of short text messages.

Setup and Configuration
-----------------------

### Get the source code of Text Prizm

On the machine where you will be working with Text Prizm,
run `git clone https://github.com/etcgroup/text-prizm.git`.
Since this is a private repository, it will ask your github username and password in order to download it.

### Get Dependencies
To build the software, you will also need a copy of the "dependencies" project
that defines the configuration of many third party libraries:
`git clone https://github.com/etcgroup/dependencies.git`.
This should be cloned as **a sibling to** the text-prizm project folder.

### Install a Virtual Machine (Not necessary if you have a server already)
For testing and development, it might be easiest to set up a virtual server
using the provided Vagrantfile. The instructions below may or may not work
without translation on other types of systems.

Below are the steps for setting up a VM:

1. [Install Vagrant](http://docs.vagrantup.com/v2/installation/).
   Vagrant is a program for managing virtual machines that works on
   Linux, Windows, and OSX.
2. On your terminal, run `vagrant up`. This starts
   a VM running Ubuntu Precise x32. The configuration of the 
   VM is in a file called Vagrantfile at the top of the project.
3. SSH into the VM with `vagrant ssh`.
   You can also use another SSH client. Just
   connect to `localhost:2222` and use vagrant's authentication key.
   Type `vagrant ssh-config` to see where the key file is located.
4. Your clone of the Text Prizm source code will be mounted
   on the VM at `/home/vagrant/text-prizm`. Any changes on either
   machine will be automatically synced.
   The `dependencies` folder will also be mounted so that you
   can build on the VM.

Note: VirtualBox is needed for Vagrant
   
### Prerequisites

Your server must be running MySQL and Apache with PHP.

- Ant, a JDK, and Git, for building
- MySQL version >= 5.5
- PHP version >= 5.4
- Apache >= 2.2

To install these on Ubuntu, such as in the vagrant VM, run the commands below.
Watch out for the caret (^) at the end.
You will be asked to provide a root password for MySQL.

```bash
$ sudo apt-get update
$ sudo apt-get install ant default-jdk ant-contrib git
$ sudo apt-get install lamp-server^
```

One additional line is needed to make sure ant-contrib works:

```bash
$ sudo ln -s /usr/share/java/ant-contrib.jar /usr/share/ant/lib/ant-contrib.jar
```

You will also need to make sure you have the the rewrite module available. On Ubuntu:

```bash
$ sudo a2enmod rewrite
```

At this point, you should be able to visit [http://localhost:8080/](http://localhost:8080/) and 
see the default Apache "It works!" page.

To check that your PHP and Apache setup is working, 
add a test file (e.g. `/var/www/test.php`) containing only `<?php phpinfo(); ?>`.
Now, visiting [http://localhost:8080/test.php](http://localhost:8080/test.php) should
show information about your PHP configuration.

Verify that your mysql server is running by logging into it as root:

```bash
$ mysql -u root -p
```

### MySQL Configuration

You will now create a database for Text Prizm.
While logged into your MySQL server, use the create database command.
You may also create a user for Text Prizm if you want:

```sql
CREATE DATABASE text_prizm;
GRANT ALL PRIVILEGES ON text_prizm.* 
   TO 'text_prizm'@'localhost' IDENTIFIED BY 'yourpassword';
FLUSH PRIVILEGES;
```

Exit your MySQL client.


### Build Text Prizm & First-time Setup

On your server, cd to your Text Prizm project folder (e.g. `/home/vagrant/text-prizm`).
Then use ant to build the project:

```bash
$ cd text-prizm
$ ant
```
The ant script will download a bunch of stuff from places.
Downloaded files will be stored (for faster later building) in
the dependencies `_cache` folder.

Next, the script builds several artifacts and collects the results
in the `dist` folder. Finally, the `deploy-local` folder
is created, and the distribution is "deployed" (copied) there.
The `deploy-local` folder is where Text Prizm will actually be run from.

The first time to run this step will stop with the following message:
```
     [exec]       [ upgrade ] Beginning upgrade...
     [exec]       [ upgrade ] ERROR: The installation has not yet been completed.
```

That is because it initiates an automatic upgrade process whenever
you deploy Text Prizm, but this doesn't work because we haven't actually
finished installing it yet.	 

To complete the initial configuration, run the following command.
```bash
$ cd deploy-local
$ php applications/util/manage.php install
```

You will be prompted to provide database credentials and other
configuration details. Also important, you must set the base url path
from which your copy of Text Prizm will be served (e.g. you could enter something
 like `/tp/` so that the url for Text Prizm will be http://localhost:8080/tp/ .)

The official storage location for these settings in `deploy-local/application/config/.install.ini`,
but the script also updates many of the php files in `deploy-local/application/config`
accordingly.

After it is finished, run ant at the parent directory again:
```bash
$ cd ..
$ ant
```

This script also ran the database migration procedures, so your
previously empty database now contains several tables.

### Rebuild

If you rebuild later, the `dist` folder will be copied onto the deploy-local folder again,
but your `.install.ini` fill will be used to restore any deployment-specific settings.
If you need to manually change any of these settings, just run
`php applications/util/manage.php upgrade` to propagate your new settings.


### Putting it Online

Now that Text Prizm is built and configured, you just need to
let Apache know to serve it.

For example, on your vagrant-managed Ubuntu VM, 
if you plan to serve Text Prizm from `/tp/`, you could
add a line like this to your default Apache virtual host
file (`/etc/apache2/sites-available/default`):

```
Alias /tp/ "/home/vagrant/text-prizm/deploy-local/"
<Directory "/home/vagrant/text-prizm/deploy-local/">
    AllowOverride All
</Directory>
```

The AllowOverride is important since it means Text Prizm can use its
own htaccess files for additional configuration.

Then use `sudo service apache2 restart` to refresh the configuration.

### User Configuration

Almost there, but you have not created any users for Text Prizm, so
you cannot log into the site yet.

To create a new user for testing, you can enter the following SQL
into your mysql client:

```sql
INSERT INTO text_prizm.users (name, full_name, email) 
   VALUES ('admin', 'Test User', 'admin@example.com');
```

Now, if you visit [http://localhost:8080/tp/](http://localhost:8080/tp/)
you should be prompted for your credentials. Just type in 'admin' without a password.

FAQ
-----------------------
1. **Q: What happened if I get the following error message?**
```
BUILD FAILED
/<my_dir_url>/text-prizm/build.xml:144: Project 'dependencies' must be present in order to build.
```
**A:** Please make sure you clone "dependencies" project as a sibling folder to text-prizm.
( [Dependencies Project](https://github.com/etcgroup/dependencies) )



2. **Q: I got the following messages after I ran ant.**
```
deploy-local:
    [mkdir] Created dir: /<my_dir_url>/text-prizm/deploy-local
     [exec] Could not open input file: /<my_dir_url>/text-prizm/deploy-local/application/util/manage.php
     [exec] Result: 1
     [copy] Copying 469 files to /<my_dir_url>/text-prizm/deploy-local
     [exec]
     [exec]       [ upgrade ] Beginning upgrade...
     [exec]       [ upgrade ] ERROR: The installation has not yet been completed.
     [exec] PHP Strict Standards:  Non-static method Util::is_cli_request() should not be called statically in /<my_dir_url>/text-prizm/deploy-local/applic
ation/util/manage.php on line 1245

BUILD FAILED
/<my_dir_url>/text-prizm/build.xml:700: exec returned: 1
```
**A:** Please run the following command after you run ant for the first time:
```bash
php deploy-local/applications/util/manage.php install
```
