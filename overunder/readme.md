# Over Under

The purpose of this project is to demonstrate the Linux overlay filesystem. The Linux overlay filesystem is a precursor
upon which the concept and implementation of Docker layers is built. 

## At the Docker Level
First let's start with a demonstration of layers in action in Docker. In these set of steps we're going
to make additions, changes, and deletions to the a file system in a Docker container. We'll use the Docker
command, [diff](https://docs.docker.com/engine/reference/commandline/diff/) to observe the changes to the filesystem.

**Step 1:** Pull an Docker container from the Docker Hub repository.

`docker pull reselbob/pinger`

**Step 2:** Take a look the configuration information associate with the image.

`docker inspect reselbob/pinger`

There's nothing to be done. Just take a look at the information to get a sense of it.

**Step 3:** Let's spin up a container from the image.

`docker run -d -p 3001:3000 --name pinger reselbob/pinger`

**Step 4:** The container is a running web server that returns information about the container's environment
at run time.

Execute the following command:

`curl localhost:3001`

You'll get information similar to the following:

```text
{
    "APIVersion": "UNKNOWN",
    "startTime": "2019-09-16T18:47:57.492Z",
    "secretMessage": "UNKNOWN",
    "processId": 7,
    "memoryUsage": {
        "rss": 29696000,
        "heapTotal": 7708672,
        "heapUsed": 4622168,
        "external": 8608
    },
    "networkInfo": {
        "lo": [
            {
                "address": "127.0.0.1",
                "netmask": "255.0.0.0",
                "family": "IPv4",
                "mac": "00:00:00:00:00:00",
                "internal": true,
                "cidr": "127.0.0.1/8"
            }
        ],
        "eth0": [
            {
                "address": "172.18.0.2",
                "netmask": "255.255.255.0",
                "family": "IPv4",
                "mac": "02:42:ac:12:00:02",
                "internal": false,
                "cidr": "172.18.0.2/24"
            }
        ]
    },
    "requestHeaders": {
        "host": "localhost:3001",
        "user-agent": "curl/7.47.0",
        "accept": "*/*"
    },
    "currentTime": "2019-09-16T18:48:06.825Z",
    "requestUrl": "/",
    "remoteAddress": "::ffff:172.18.0.1"
}
```
**Step 5:** Let's take a look at the history of container using the command set, `docker diff`:

`docker diff pinger`

You'll get empty output because we have yet to do anything.

**Step 6:** Let's create a file that we'll use in a bit.

`echo "hi there" > hello.txt`

**Step 7:** Let's copy the file into the container's filesystem using the following command:

`docker cp hello.txt pinger:/hello.txt`

**WHERE**

* `docker cp` is the command set for copying a file into a running container
* `hello.txt` is the file in question
* `pinger` is the name of the container into which we're copying the file. (You can also think of `pinger` as
the container's namespace.)
* `/hello.txt` is the destination path and filename in the container's filesystem that is the target of the copy.

**Step 8:**  Let's take another look the the history of the container.

`docker diff pinger`

You'll get output similar to the following.

`A /hello.txt`

The history is reporting that you've added (A) a file, `hello.txt` to the container at the root `/`.

**Step 9:** Navigate into the container:

`docker exec -it pinger sh`

**Step 10:** Let's change the content of the file, `hello.txt` from inside the container.

`echo "Greetings really cool class" >> hello.txt`

Take a look at the file's contents.

`cat /hello.txt`

**Step 11:** Exit the container

`exit`

**Step 12:** Take another look at the history

`docker diff pinger`

You'll get output similar to the following"

```text
C /root
A /root/.ash_history
A /hello.txt
```
The output reflects that the files, `/root/.ash_history` and `/hello.txt` have been added and that there has been a change (C) in the directory
`/root`

**Step 13:** Create a new file

`echo "I am getting ready to go" > goodbye.txt`

**Step 14:** Copy the new ile, `hello.txt` to the directory `/etc/` within the container.

`docker cp goodbye.txt pinger:/etc/goodbye.txt`

**Step 15:** Take yet, another look at the history

`docker diff pinger`

You'll get output similar to the following:

```text
C /etc
A /etc/goodbye.txt
C /root
A /root/.ash_history
A /hello.txt
```

You'll see that the history is reporting that the file, `/etc/goodbye.txt` has been added (A) and that the
directory `/etc` has been changed (C). (Something to think about is that the directory, `/etc` is supposed to be "read-only".)

**Step 16:** Let's try to delete a file in the container that is supposed to be in the container's read-only layer.
We'll delete the file, `/etc/localtime`.

`docker exec pinger rm -rf /etc/localtime`

**Step 17:** Yep, you got it. Take another look at the history

`docker diff pinger`

```text
A /hello.txt
C /etc
A /etc/goodbye.txt
D /etc/localtime
C /root
A /root/.ash_history
```
Notice there is now an entry in the history, `D /etc/localtime` that indicates that the file, `/etc/localtime` has been deleted (D).

But has it?

**Step 18:** Inspect the container:

`docker inspect pinger`

In the output you'll see something similar to the following:

```text
.
.
  "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay/0804af2c0680484ee054f6c72a83a0ecb6f2d77604025268f8c23e73ec2d3a30/root",
                "MergedDir": "/var/lib/docker/overlay/6039f970d1108124161a69ad0880810d2262e343d38b30df948ecb5821450345/merged",
                "UpperDir": "/var/lib/docker/overlay/6039f970d1108124161a69ad0880810d2262e343d38b30df948ecb5821450345/upper",
                "WorkDir": "/var/lib/docker/overlay/6039f970d1108124161a69ad0880810d2262e343d38b30df948ecb5821450345/work"
            },
            "Name": "overlay"
        },
.
.
```

Docker is reporting that there an overlay filesystem in play, `Name": "overlay`. Also, it's reporting the location in the host where the
directories `LowerDir`, `MergedDir`,`UpperDir` and `WorkDir` are to be found. (We'll cover the meaning of this all in the next section, At the Linux File System Level.
But, for now, just play along.)

**Step 19:** Let's inspect the contents of the directory, `LowerDir` on the host:

`ls /var/lib/docker/overlay/0804af2c0680484ee054f6c72a83a0ecb6f2d77604025268f8c23e73ec2d3a30/root`

You'll output similar to the following:

```text
bin  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  server.js  srv  sys  tmp  usr  var
```

WOW! **That's the filesystem of the container but without the hello.txt stuff!**

Let's try something interesting. Let's see what happens when we do an `cat` on the file `/etc/localtime` we were supposed to have
deleted:

`sudo cat /var/lib/docker/overlay/0804af2c0680484ee054f6c72a83a0ecb6f2d77604025268f8c23e73ec2d3a30/root/etc/localtime`

We get output as follows:

```text
TZif2UTCTZif2�UTC
UTC0
```

Is that strange or what? I thought we deleted the file. Wow, we really need to find out what's going on there.

**Step 20:** Let's take a look at the `UpperDir`

`ls /var/lib/docker/overlay/6039f970d1108124161a69ad0880810d2262e343d38b30df948ecb5821450345/upper`

We'll get output similar to the following:

```text
dev  etc  hello.txt  root
```
So there's the `hello.txt` file. Also, there are directories, `dev`, `etc`, and `root`.

**Step 21:** Let's take a look at what's in the `etc` directory of `UpperDir`.

`sudo ls -ls /var/lib/docker/overlay/6039f970d1108124161a69ad0880810d2262e343d38b30df948ecb5821450345/upper/etc`

We'll get output like the following:

```text
total 4
4 -rw-r--r-- 1 root root   25 Sep 16 19:11 goodbye.txt
0 -rwxr-xr-x 1 root root    0 Sep 16 18:47 hostname
0 -rwxr-xr-x 1 root root    0 Sep 16 18:47 hosts
0 c--------- 1 root root 0, 0 Sep 16 19:19 localtime
0 lrwxrwxrwx 1 root root   12 Sep 16 18:47 mtab -> /proc/mounts
0 -rwxr-xr-x 1 root root    0 Sep 16 18:47 resolv.conf
```
There's the file, `goodbye.txt` we wrote earlier. But, also there's the file we were supposed to have deleted, `localtime`.
But, where the file, `localTime` in the directory`LowerDir` has a few bytes of content, the file, `localTime` in the 
directory`UpperDir` has zero bytes and it has an attribute of [`c`](https://linux-kernel-labs.github.io/master/labs/device_drivers.html).

What's going on? We're experiencing the Linux Overlay Filesystem which is what we're going to cover next.

## At the Linux File System Level

An overlay sits on top of an existing filesystem. When you do a overlay, you combine an upper and a lower
directory tree (which can be from different filesystems) which results in a unified representation of
both directory trees. Should objects with the same name exist in both directory trees, then their
treatment depends on the object type.

If the upper directory has a file with the same name as one in the lower directory, the the file in the lower
directory will be hidden. Otherwise, the contents of each directory object are merged to create a
combined directory object in the overlay.

### Syntax

`mount -t overlay  -o lowerdir=./lower,upperdir=./upper,workdir=./working overlay ./merged`

**WHERE**

`mount` is the linux command that executes the overlay

`-t overlay` indicates the type of the mount, in this case it's an `overlay`

`-o` indicates the option parameters for the mount

`lowerdir=./lower` indicates the location of the upper `read-write` directory on the host filesystem.
In this case the `lowerdir` is `./lower`.

`upperdir=./upper` indicates the location of the lower `read-only` directory on the host filesystem.
In this case the `upperdir` is `./upper`.

`workdir=./working` is required option. The working directory is used to prepare files before they are switched
to the overlay destination in an atomic action. (The `workdir` needs to be on the same filesystem as the `upperdir`.)

`overlay ./merged` indicates the directory in which the entire overlay will be realized.

### Implementation

The following steps describe how to create a filesystem overlay. Also, there are steps that provide analytic review
relevant to understanding the concepts behind a filesystem overlay.

**Step 1:** Set the user to super user. (Only the users with `root` persmissions can do an overaly.)

`sudo su -`

**Step 2:** Make a directory the demonstration project.

`mkdir /home/over-under`

**Step 3:** Navigate to the demonstration project directory.

`cd /home/over-under`

**Step 4:** Make sub-directories in the demonstration project directory that we'll need to facilitate
the file system overlay.

`mkdir ./{lower,upper,working,merged}`

**Step 5:** Take a look at the directory structure. (You might have to `apt install tree` on your
host system if not installed.)

`tree /home/over-under`

```text
/home/over-under
├── lower
├── merged
├── upper
└── working
```

**Step 6:** Write a line of content into a file in the `lower` directory.

`echo "I am lower 1" > lower/lower1.txt`

**Step 7:** Write a line of content into a file in the `upper` directory.

`echo "I am upper 1" > upper/upper1.txt`

**Step 8:** Execute the overlay

`mount -t overlay  -o lowerdir=./lower,upperdir=./upper,workdir=./working overlay ./merged`

**Step 9:** Take a look at the results as a tree

`tree /home/over-under`

```text
home/over-under
├── lower
│   └── lower1.txt
├── merged
│   ├── lower1.txt
│   └── upper1.txt
├── upper
│   └── upper1.txt
└── working
    └── working
```

**Step 10:** Add another line of text to the file, `lower/lower1.txt`

`echo "I am another line in lower 1" >> lower/lower1.txt`

**Step 11:** Take a look at the contents of file, `lower/lower1.txt`.

`cat lower/lower1.txt`

You should see the added line, like so:

```text
I am lower 1
I am another line in lower 1
```

**Step 12:** Take a look at the contents of file, `merged/lower1.txt

`cat merged/lower1.txt`

You should also see the added line, like so:

```text
I am lower 1
I am another line in lower 1
```

This makes sense because you made a change to the file, `lower1.txt` in lower layer 
directory and that change cascaded to up to the `merged/lower1.txt`.

**Step 13:** Add another line of text to the file, `lower1.txt` in the `read-write` directory, `./merged`.

`echo "I am yet another amazing, incredible line in lower 1" >> merged/lower1.txt`


**Step 14:** Read the contents of, ` merged/lower1.txt`.

`cat merged/lower1.txt` 

You should now see three lines of text, like so:

```text
I am lower 1
I am another line in lower 1
I am yet another amazing, incredible line in lower 1
```

**Step 15:** Read the contents of the file in the read-only directory, ` lower/lower1.txt`.

`cat lower/lower1.txt`

You should see only two lines of text, like so:

```text
I am lower 1
I am another line in lower 1
```

You are now observing the mechanics of the file system overlay. Remember in Step 14 you made a 
change to the file in the `merged` directory. The directory `merged` represents the result of the 
file system overlay. Any change made to the file, `./merged/lower1.txt will` will have NO impact on 
`./lower/lower1.txt` because the directory `./lower` is the `read-only` directory i the overlay.

**Step 16:** Now, let's go one step further. Let's delete the file, `lower1.txt` in the directory `./merged`.

`rm ./merged/lower1.txt`

**Step 17:** Take a look at the tree that is the result of deleting file.

`tree /home/over-under`

You should see something like the following:

```text
/home/over-under
├── lower
│   └── lower1.txt
├── merged
│   └── upper1.txt
├── upper
│   ├── lower1.txt
│   └── upper1.txt
└── working
    └── working
```
Notice that the file `./merged/lower.txt` has been deleted, but that `./lower/lower1.txt` remains.

**Step 18:** Take a look at the contents of the `./upper` directory.

`ls -lh ./upper`

You will see results like so:

```text
c--------- 1 root root 0, 0 Sep 12 00:58 lower1.txt
-rw-r--r-- 1 root root   13 Sep 12 00:56 upper1.txt
```

The `c` in `./upper/lower1.txt` indicates that the file is a character device.

When a file or directory that originates in the upper directory is removed from the overlay,
it's also removed from the upper directory.  When a file or directory that originates in the
lower directory is removed from the overlay, it remains in the lower directory, but a 'whiteout'
is created in the upper directory.  A whiteout takes the form of a character
device with device number 0/0, and a  name identical to the removed object.
The result of the whiteout creation means that the object in the lower directory
is ignored, while the whiteout itself is not visible in the overlay.

**Step 18:** Let's try to remove the entire project directory, `/home/over-under`.

`rm -rf /home/over-under`

You'll get an error message because the `merged` directory is still mounted. So, we need to unmount
it order to delete `/home/over-under`.

**Step 19:**  Unmount the `merged` directory

`umount /home/over-under/merged`

Once the `/home/over-under/merged` directory is unmounted, we can delete
the demonnstration project.

**Step 20:**  Delete the directory, `/home/over-under`.

`rm -rf /home/over-under`

**Congratulations!** The demonstration is complete.