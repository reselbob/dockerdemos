# What's My Namespace

**UNDER CONSTRUCTION**

In terminal 1, do the following:

`sudo su -`

`unshare -u bash`

`uname -n`

`hostname bobbybaby`

`uname -n`

`readlink /proc/$$/ns/uts`

You'll get the namespace id for the new UTS namespace

`readlink /proc/$$/ns/net`

But, no new NET namespace will be created.

In terminal 2, do the following:

`readlink /proc/$$/ns/uts`


`readlink /proc/$$/ns/net`

Both the original host name and new host name, `bobbybaby` will share the same NET namespace.

`apt install libcap-ng-utils`

`pscap $$`