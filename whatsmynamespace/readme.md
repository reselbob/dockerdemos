# What's My Namespace

The purpose of this project is to demonstrate Linux [namespace](http://man7.org/linux/man-pages/man7/namespaces.7.html) isolation. In this project we
are going to create a new namespace and then make a change to the hostname. (The change will
affect the namespace type, `UTS`.) Because the hostname change has occurred in the newly created namespace,
it will only be visible within the new namespace.

## At the Linux Level

**Step 1:** Make the current user a super user:

`sudo su -`

**Step 2:** Create a new namespace of type [`UTS`](https://unix.stackexchange.com/questions/183717/whats-a-uts-namespace#183722).

`unshare -u bash`

**WHERE**

* [`unshare`](https://www.commandlinux.com/man-page/man1/unshare.1.html) is the command that creates a new namespace
separate from the parent namespace
* `-u` is an option that indicates that the new namespace is to be associated with the [resource namespace](http://man7.org/linux/man-pages/man7/namespaces.7.html), 
[UTS](https://windsock.io/uts-namespace/) (UNIX Timesharing System)
* `bash` is the program to run in the newly created namespace

**Step 3:** Confirm that the original host name is still in force

`uname -n`

**Step 4:** Change the host name using the Linxu `hostname` command

`hostname newHostNameOne`

**WHERE**
* [`hostname`](https://www.computerhope.com/unix/uhostnam.htm) is the Linux command used to change the hostname
* `newHostNameOne` is the new name

**Step 5:** Confirm that the new host name is still in force

`uname -n`

You'll get the following output:

`newHostNameOne`

**Step 6:** Get the namespace id associated with the current process in terms of the `UTS` resource namespace 

`readlink /proc/$$/ns/uts`

You'll get output similar to this:

`uts:[4026532160]`

Keep track of this ouput

**Step 7:** Get the namespace id associated with the current process in terms of the `network` resource namespace

`readlink /proc/$$/ns/net`

You'll get output similar to this:

`net:[4026531957]`

Keep track of this number.

**Step 8:** Open a new terminal window and take a look at the hostname.

`uname -n`

It will be the same name as the one the was originally displayed in the first terminal window before we created
the new namespace and the new hostname. This makes sense because the new terminal opened in the default (parent) namespace.

**Step 9:** Get the namespace id associated with the new terminal's current process in terms of the UTS resource namespace

`readlink /proc/$$/ns/uts`

You'll get output similar to this:

`uts:[4026531838]`

Keep track of this number.

**Step 10:** Get the namespace id associated with the new terminal's current process in terms of the Network resource namespace

`readlink /proc/$$/ns/net`

You'll get output similar to this:

`net:[4026531957]`

Keep track of this number.

**Analysis**

Let's review. The list below shows the values of the namespace IDs retreived in the earlier steps


|host|UTS ID (uts)|NET (net)|
|---|---|---|
|newHostNameOne (terminal 1)|4026532160 |4026531957|
|original (terminal 2)|4026531838|4026531957|

As you can see the namespace IDs for `uts` are different while the IDs for `net` are identical. Why?

The resource namespace `UTS` has "jurisdiction" over Hostname and NIS domain name activity. The resource namespace,
`NETWORK` encompasses network devices, stacks, ports, etc.

This can be mystifying to those new to low level Linux stuff. The important thing to understand we created a
new namespace using the `unshare` command and then right after that created a new `hostname`. Creating the new hostname 
affects the `UTC` resource namespace. The new namespace is then associated with the `UTC` resource namespace, hence the 
different ID.

However, when we created the new namespace using `unshare` we executed **NO** commands associated with networking.
Thus, both the new namespace and the original namespace share the same namespace associated with the `NETWORK` resource namespace.

Is this confusing? Yes, it is. The important thing to understand is that namespaces provide a way to isolate activities from one another
in the same Linux host.

## At the Container Level

**UNDER CONSTRUCTION**

