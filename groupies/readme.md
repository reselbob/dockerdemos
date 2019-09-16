# Groupies

**UNDER CONSTUCTION**

The purpose of this project is to demonstrate various aspects of Linux `cgroup` in terms of direct use under Docker and
also at a lower level in terms of the Linux operating system.

## At the Container Level

We're going to install a docker container that does nothing more than eating memory on demand. It's
will user the Docker image [julman99/eatmemory](https://hub.docker.com/r/julman99/eatmemory). We'll get the container up and running
according to a memory limit parameter. Then, well go inside the container make some memory demands within and outside of the 
declared memory limit.

**Step 1:** Get the container up and running

`docker run -d --memory 50m --name hungry_container julman99/eatmemory 40M`

**WHERE**

* `docker run` is the command set we'll use to invoke the container
* `-d` is the option that makes the container run as a daemon in the background
* `--memory 50M` is the option to set the memory limit of the container. Is this case we'll set a memory
limit of 50 megabytes (`50MB`)
* `--name hungry_container` is the option to name the container, in this case `hungry_container`
* `julman99/eatmemory` is the container image well use, pulled from DockerHub
* `40M` Does an initial "memory eat" of 40MB

Let's take a look at the how the container is coping with the memory demand:

`docker stats --no-stream=true hungry_container`

You'll output the looks similar to the following:

```text
CONTAINER ID      NAME              CPU %     MEM USAGE / LIMIT   MEM %          NET I/O        BLOCK I/O      PIDS
47c342943e18      hungry_container  0.00%     41.65MiB / 50MiB    83.30%         6.4kB / 90B    0B / 0B        1
```
You can see we're up against the memory limit of the container, but haven't gone overboard.

The important thing to remember here is that the memory limit we've set for the running container is `50MB`.

**Step 2:** Navigate into the running container

`docker exec -it hungry_container /bin/sh`

**Step 3:** Do some memory eating from within the container. First eat `10 MB`.

`eatmemory 10 MB`

You'll get output similar to the following:

```text
Currently total memory: 2095968256
Currently avail memory: 150065152
Eating 10485760 bytes in chunks of 1024...
Done, press any key to free the memory
```

Press a key.

You're doing just fine.

**Step 4:*** Now let's go beyond the memory limit:

`eatmemory 60M`

Things won't go so well. You'll get output similar to the following:

```text
Currently total memory: 2095968256
Currently avail memory: 153452544
Eating 62914560 bytes in chunks of 1024...
Killed
```
You're in trouble. Why? Because you're trying to eat `60MB` of memory while the allocation is for a limit of `50MB`.

**Step 5:*** Let's try again with a memory amount that is beneath the memory limit.

`eatmemory 49MB`

You'll get output similar to the following:

```text
Currently total memory: 2095968256
Currently avail memory: 190251008
Eating 51380224 bytes in chunks of 1024...
Done, press any key to free the memory
```

We're back in good graces. Things are better now.

**NOTE**: In some environments having the container running `eatmemory` 
to go over the memory limit will cause the container to crash. Also in some cases
the docker engine will only write memory to the declared limite. This is OK. Basically the 
container is saying, _"You're ask for more memory than I'm allocated to give so I am going to complain. Or, I might only go the the limit. Hey, I might even blow up!"_

## At the Linux Level

**Step 1:** Become the super user

`sudo su -`

**Step 2:** Make sure you have `memhog`.

Check to see if memhog is installed.

`which memhog`

If you get no path to the executable file, run the following:

`curl -s -o /usr/local/bin/memhog https://storage.googleapis.com/kistek-training/memhog-amd64`

then

`chmod +x /usr/local/bin/memhog`

**Step 3:** Make sure you have `cgcreate`.

`which cgcreate`

If you get no path to the executable file, run the following:

`apt-get install cgroup-bin cgroup-lite libcgroup1 -y`

**Step 3:** Create the a new user

`useradd -m dockerstudent `

and set a password

`passwd dockerstudent [dockerstudent]`

**Step 4:** Create a `cgroup`

`cgcreate -a dockerstudent -g memory:playground`

**Step 5:** Let's see what's in the new cgroup

`ls -la /sys/fs/cgroup/memory/playground/`

You'll get output similar to the following:

```text
drwxr-xr-x 2 dockerstudent root 0 Sep 13 22:53 .
dr-xr-xr-x 6 root          root 0 Sep 13 22:03 ..
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 cgroup.clone_children
--w--w--w- 1 dockerstudent root 0 Sep 13 22:53 cgroup.event_control
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 cgroup.procs
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.failcnt
--w------- 1 dockerstudent root 0 Sep 13 22:53 memory.force_empty
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.failcnt
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.limit_in_bytes
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.max_usage_in_bytes
-r--r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.slabinfo
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.tcp.failcnt
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.tcp.limit_in_bytes
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.tcp.max_usage_in_bytes
-r--r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.tcp.usage_in_bytes
-r--r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.kmem.usage_in_bytes
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.limit_in_bytes
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.max_usage_in_bytes
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.move_charge_at_immigrate
-r--r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.numa_stat
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.oom_control
---------- 1 dockerstudent root 0 Sep 13 22:53 memory.pressure_level
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.soft_limit_in_bytes
-r--r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.stat
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.swappiness
-r--r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.usage_in_bytes
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 memory.use_hierarchy
-rw-r--r-- 1 dockerstudent root 0 Sep 13 22:53 notify_on_release
-rw-r--r-- 1 root          root 0 Sep 13 22:53 tasks
```

**Step 6:** Let's take a look at the content of `memory.limit_in_bytes`.

`cat /sys/fs/cgroup/memory/playground/memory.limit_in_bytes`

You'll get some output that will describe the memory limit of the group like so:

`9223372036854771712`


**Step 7:** Let's set a 10MiB memory limit for the cgroup

`echo 10485760 | tee /sys/fs/cgroup/memory/playground/memory.limit_in_bytes`

**Step 8:** Let's see if the modification stuck

`cat /sys/fs/cgroup/memory/playground/memory.limit_in_bytes`

You'll see output like the following:

`10485760`

**Step 9:** We'll eat up some memory from the default cgroup using the program `memhog`

`memhog 104857600 1`

You'll see output similar to the following:

```text
allocating 104857600 bytes...
writing 104857600 bytes...
reading 104857600 bytes...
sleeping for 1 seconds...
```

**Step 10:** Now we'll navigate into the memory restricted cgroup

`cgexec -g memory:playground bash`

**Step 11:** Become `dockerstudent` 

`su - dockerstudent`

**Step 12:** We'll try to eat up some memory 
             
`memhog 104857600 1`


**Step :** Let's be good citizens and change the the new user `dockerstudent`

``


**Step 3:** Alter `/etc/default/adduser` to make it so that the new user is given a home directory



