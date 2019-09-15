# Cherrooty

**UNDER CONSTRUCTION**

The purpose of this project is to demonstrate various aspects of `chroot` and relate how the concepts behind
the command apply to `containers`.

In this project we're going to create a directory `/home/jail` and make it so that the system thinks that
the file within `/home/jail` is the root filesystem using `chroot`.

**Step 1:** Become the super user:

`sudo su -`

**Step 2:** Install `tree` because you're going to need it.

`apt update && apt install tree -y`

**Step 3:** We'll make it so that we'll be able to execute `bash` and `ls` from the new root file system.
In order to do this we need to understand the dependencies that each command has. We'll use the command,
[`ldd`](http://man7.org/linux/man-pages/man1/ldd.1.html) to discover these dependencies.

First, get the dependency list for bash:

`ldd /bin/bash`

You'll be output similar to the following (but things will vary by machine):

```text
	linux-vdso.so.1 (0x00007ffe0b487000)
	libtinfo.so.5 => /lib/x86_64-linux-gnu/libtinfo.so.5 (0x00007fd7af86a000)
	libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007fd7af666000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fd7af275000)
	/lib64/ld-linux-x86-64.so.2 (0x00007fd7afdae000)
```

Then, discover the dependencies for `ls`

`ldd /bin/ls`

```text
	linux-vdso.so.1 (0x00007ffcb3c43000)
	libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x00007f8cf20c9000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f8cf1cd8000)
	libpcre.so.3 => /lib/x86_64-linux-gnu/libpcre.so.3 (0x00007f8cf1a66000)
	libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007f8cf1862000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f8cf2513000)
	libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007f8cf1643000)
```

We're going to need to make sure that all the files shown above are copied into the respective directories
with the new root file system.

**Step 4:** Create the necessary directories and file that will become part of the new root file system.

`mkdir /home/jail`

`mkdir /home/jail/{bin,lib,lib64,lib/x86_64-linux-gnu}`

For convenience, set the anticipated new root directory, `/home/jail` to process variable `J`

`J=/home/jail `

And navigate to the directory

`cd $J`

**Step 5:**  Copy the executable files for `bash` and `ls` into the the respective `/bin` directory in
the anticipated new root directory, `/home/jail`.

`cp -v /bin/{bash,ls} $J/bin`

**Step 6:**  Take a look at the `tree` to make sure all is well.

`tree $J`

You'll get output similar to the following:

```text
/home/jail
├── bin
│   ├── bash
│   └── ls
├── lib
│   └── x86_64-linux-gnu
└── lib64
```

**Step 7:** Execute the following Linux `for loop` to copy the dependency files for `ls` into the
anticipated new root directory, `/home/jail` 

`list="$(ldd /bin/ls | egrep -o '/lib.*\.[0-9]')"; for i in $list; do cp  -v "$i" "${J}${i}"; done`

`list="$(ldd /bin/bash | egrep -o '/lib.*\.[0-9]')"; for i in $list; do cp  -v "$i" "${J}${i}"; done`

**Step 8:** Run `tree` to get a look at things. You'll see something similar to the following:

``tree $J``

You should get output that looks similar to the following:

```text
.
├── bin
│   ├── bash
│   └── ls
├── lib
│   └── x86_64-linux-gnu
│       ├── libc.so.6
│       ├── libdl.so.2
│       ├── libpcre.so.3
│       ├── libpthread.so.0
│       ├── libselinux.so.1
│       └── libtinfo.so.5
└── lib64
    └── ld-linux-x86-64.so.2
```

**Step 8:** Now it's time to do the `chroot` and make the system think that `/home/jail` is the root files system.

`chroot $J /bin/bash`

**Step 9:** The directory, `/home/jail` is now the root file system of system. Do a simple `ls` to see the subdirectories
in the root directory.

`ls /`

You'll get output similar to the following:

`bin  lib  lib64`

Why? Because there are the only directories in  `/home/jail`.

**Step 10:** Try to read the directory `/etc/` which was previously visible when the root filesystem was `/`.

`ls /etc/`

You'll get an error as follows:

`ls: cannot access '/etc/': No such file or directory`

Why? Because the "root directory" is `home/jail` and only files that are subordinate to that directory are visible.
`chroot` makes it impossible to see anything else. In fact if you run:

`tree /`

You'll get an error:

`bash: tree: command not found`

Why? Because `tree` is in `/bin/tree` and that file is not in the `/bin` directory of the current root file system. When
the old root file system was `/` then `tree` was visible.

**Step 11:** But, we've had enough, let's get out of `chroot`

`exit`

**Step 12:** Now do a `ls -lh` on `/`.

`ls -lh`

You'll get output similar to the following:

```text

total 96K
drwxr-xr-x   2 root root 4.0K Aug  8 10:23 bin
drwxr-xr-x   3 root root 4.0K Aug  8 10:23 boot
drwxr-xr-x  16 root root 3.8K Sep 14 21:22 dev
drwxr-xr-x  97 root root 4.0K Aug  8 10:26 etc
drwxr-xr-x   4 root root 4.0K Sep 14 21:58 home
lrwxrwxrwx   1 root root   33 Aug  8 10:23 initrd.img -> boot/initrd.img-4.4.0-157-generic
lrwxrwxrwx   1 root root   32 Aug  8 10:23 initrd.img.old -> boot/initrd.img-4.4.0-62-generic
drwxr-xr-x  20 root root 4.0K Aug  8 10:25 lib
drwxr-xr-x   2 root root 4.0K Aug  8 10:24 lib32
drwxr-xr-x   2 root root 4.0K Aug  8 10:21 lib64
drwxr-xr-x   2 root root 4.0K Aug  8 10:24 libx32
drwx------   2 root root  16K Aug  8 10:18 lost+found
drwxr-xr-x   4 root root 4.0K Aug  8 10:18 media
drwxr-xr-x   2 root root 4.0K Feb 15  2017 mnt
drwxr-xr-x   5 root root 4.0K Aug  8 10:26 opt
dr-xr-xr-x 108 root root    0 Sep 14 21:22 proc
drwx------   4 root root 4.0K Sep 14 21:23 root
drwxr-xr-x  23 root root  820 Sep 14 22:24 run
drwxr-xr-x   2 root root  12K Aug  8 10:25 sbin
drwxr-xr-x   2 root root 4.0K Aug  8 10:24 snap
drwxr-xr-x   2 root root 4.0K Feb 15  2017 srv
dr-xr-xr-x  13 root root    0 Sep 14 21:22 sys
drwxrwxrwt   7 root root 4.0K Sep 14 22:17 tmp
drwxr-xr-x  12 root root 4.0K Aug  8 10:24 usr
drwxr-xr-x  12 root root 4.0K Aug  8 10:23 var
lrwxrwxrwx   1 root root   30 Aug  8 10:23 vmlinuz -> boot/vmlinuz-4.4.0-157-generic
lrwxrwxrwx   1 root root   29 Aug  8 10:23 vmlinuz.old -> boot/vmlinuz-4.4.0-62-generic
```
You're back to the days for `chroot`. Now the root directory is indeed, `/`.
