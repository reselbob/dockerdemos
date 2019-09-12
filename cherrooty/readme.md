# Cherrooty

**UNDER CONSTRUCTION**

The purpose of this project is to demonstrate various aspects of `chroot` and relate how the concepts behind
the command apply to `containers`.

`sudo su -`

`apt update`

`apt install tree`

`mkdir /home/jail`

`mkdir /home/jail/{bin,lib,lib64}`

`J=/home/jail `

`cd $J`

`cp -v /bin/{bash,ls} $J/bin`

`tree $J`

`ldd /bin/bash/`

`cp -v  /lib/x86_64-linux-gnu/libtinfo.so.5 /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libc.so.6 $J/lib/`

`cp -v /lib64/ld-linux-x86-64.so.2 $J/lib64/`

`tree $J`

`ldd /bin/ls`

`cp -v /lib/x86_64-linux-gnu/libselinux.so.1 /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/libpcre.so.3 /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libpthread.so.0 $J/lib/`

`cp -v 	/lib64/ld-linux-x86-64.so.2 $J/lib64/`

Cool alternative to all the file copying.

```text
list="$(ldd /bin/ls | egrep -o '/lib.*\.[0-9]')"
for i in $list; do cp  -v "$i" "${J}${i}"; done
```

`tree $J`

`chroot $J /bin/bash`

`ls /`

`ls /etc/`

`tree /`

Get out of the `chroot`

`exit`

