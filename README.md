sentinelf
=========

First follow the tuto here https://github.com/vincentserpoul/vagrant-yeoman-env

        cd vagrant.sentinelf.com/www
        git clone git@github.com:vincentserpoul/sentinelf.git dev.sentinelf.com

### Viewing the project

Once everything is downloaded and puppet is done running, you can log in to the VM and start the server

        $ vagrant ssh
        $ cd /var/www/dev.sentinelf.com
        $ sudo npm install
        $ sudo bower install
        $ grunt server
        $ (grunt server OR nohup grunt server > /dev/null 2>&1 &)

### Launching your server

Then you can access the server on your host machine's browsers at http://dev.sentinelf.com:9000

### Testing

If you want to run unit tests on the project, ssh to the box, cd to /var/www/dev.sentinelf.com and run the following command

        $ grunt test

This will run your unit tests using the headless Webkit browser "Phantomjs"

### Packaging

If you want to package your project, ssh to the box, cd to /var/www/dev.sentinelf.com and run the following command

        $ grunt

Compressed, packaged assets can be found in /var/www/dev.sentinelf.com/dist
