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

`docker run -d --memory 150m --name hungry_container julman99/eatmemory 40M`

**WHERE**

* `docker run` is the command set we'll use to invoke the container
* `-d` is the option that makes the container run as a daemon in the background
* `--memory 150m` is the option to set the memory limit of the container. Is this case we'll set a memory
limit of 50 megabytes (`150MB`)
* `--name hungry_container` is the option to name the container, in this case `hungry_container`
* `julman99/eatmemory` is the container image well use, pulled from DockerHub
* `40M` Does an initial "memory eat" of 40MB

Let's take a look at the how the container is coping with the memory demand:

`docker stats --no-stream hungry_container`

You'll output the looks similar to the following:

```text
CONTAINER ID        NAME                CPU %               MEM USAGE / LIMIT   MEM %               NET I/O             BLOCK I/O           PIDS
a9613326e8b3        hungry_container    0.00%               41.74MiB / 150MiB   27.83%              836B / 0B           0B / 0B             1
```

The important thing to remember here is that the memory limit we've set for the running container is `50MB`.

**Step 2:** Let's delete the container and create a new one with the same memory
limit, but in this case we'll run memory behind the limit. First, delete the container.

`docker rm -f hungry_container`

Now, invoke the container again with a higher memory eating value.

`docker run -d --memory 150m --name hungry_container julman99/eatmemory 200M`

Take a look at the status:

`docker stats --no-stream hungry_container`

You'll output the looks similar to the following:

```
CONTAINER ID        NAME                CPU %               MEM USAGE / LIMIT   MEM %               NET I/O             BLOCK I/O           PIDS
40cc568adcae        hungry_container    0.00%               150MiB / 150MiB     99.97%              906B / 0B           81.9kB / 121MB      1
```
Notice that even though we tried to eat `200M` of memory Docker only allowed the program to eat the allocated maximum.

**Step 3:** Let's try once more below the memory limit. Delete the container.

`docker rm -f hungry_container`

Now instantiate the container again. This time eat only 100M of memory

`docker run -d --memory 150m --name hungry_container julman99/eatmemory 100M`

Take a look at the status:

`docker stats --no-stream hungry_container`

You'll output the looks similar to the following:

```text
CONTAINER ID        NAME                CPU %               MEM USAGE / LIMIT   MEM %               NET I/O             BLOCK I/O           PIDS
4a28d674d1bb        hungry_container    0.01%               103.7MiB / 150MiB   69.16%              976B / 0B           0B / 0B             1
```

We're back in good graces. Things are better now.

**NOTE**: In some environments having the container running `eatmemory` 
to go over the memory limit will cause the container to crash. . This is OK. Basically the 
container is saying, _"You're asking for more memory than I'm allocated to give so I am going 
to complain. Or, I might only go the the limit. Hey, I might even blow up!"_

Let's go one step further and take a look at the `cgroup` memory allocation stored in the host.

**Step 4:** First, we need to find the full `id` of the container. Get the short `id`,

`docker ps -as`

You'll get output similar to the following:

```text
CONTAINER ID        IMAGE                COMMAND                 CREATED             STATUS              PORTS               NAMES               SIZE
4a28d674d1bb        julman99/eatmemory   "/bin/eatmemory 100M"   4 minutes ago       Up 4 minutes                            hungry_container    0B (virtual 4.02MB)
```

In this case we can grab the `id`, `4a28d674d1bb`

**Step 5:** Let's inspect the container to get the long `id`.

`docker inspect 4a28d674d1bb | grep 4a28d674d1bb`

You'll get output similar to the following:

```text
        "Id": "4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610",
        "ResolvConfPath": "/var/lib/docker/containers/4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610/hostname",
        "HostsPath": "/var/lib/docker/containers/4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610/hosts",
        "LogPath": "/var/lib/docker/containers/4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610/4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610-json.log",
            "Hostname": "4a28d674d1bb"
```
In the output above you can see that the long `Id` is in the first line.

**Step 7:**  In a default Linux installation the `cgroup` memory declaration for container can be found at:

`/sys/fs/cgroup/memory/docker/CONTAINER_ID`

So let's see what's there

`ls /sys/fs/cgroup/memory/docker/4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610`

You'll get output similar to the following:

```text
cgroup.clone_children  memory.kmem.failcnt             memory.kmem.tcp.limit_in_bytes      memory.max_usage_in_bytes        memory.soft_limit_in_bytes  notify_on_release
cgroup.event_control   memory.kmem.limit_in_bytes      memory.kmem.tcp.max_usage_in_bytes  memory.move_charge_at_immigrate  memory.stat                 tasks
cgroup.procs           memory.kmem.max_usage_in_bytes  memory.kmem.tcp.usage_in_bytes      memory.numa_stat                 memory.swappiness
memory.failcnt         memory.kmem.slabinfo            memory.kmem.usage_in_bytes          memory.oom_control               memory.usage_in_bytes
memory.force_empty     memory.kmem.tcp.failcnt         memory.limit_in_bytes               memory.pressure_level            memory.use_hierarchy
```

These are the files that contain memory information for the Docker container according to it's `cgroup`. The name of the `cgroup` is the `longid` of the 
container,  in this case: `4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610`

We can get a digest of the memory configuration by reading the file, `memory_state`, like so:

`cat /sys/fs/cgroup/memory/docker/4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610/memory.stat`

You'll get output similar to the following:

```text
cache 0
rss 108167168
rss_huge 0
shmem 0
mapped_file 0
dirty 0
writeback 0
pgpgin 26997
pgpgout 589
pgfault 27280
pgmajfault 0
inactive_anon 0
active_anon 108167168
inactive_file 0
active_file 0
unevictable 0
hierarchical_memory_limit 157286400
total_cache 0
total_rss 108167168
total_rss_huge 0
total_shmem 0
total_mapped_file 0
total_dirty 0
total_writeback 0
total_pgpgin 26997
total_pgpgout 589
total_pgfault 27280
total_pgmajfault 0
total_inactive_anon 0
total_active_anon 108167168
total_inactive_file 0
total_active_file 0
total_unevictable 0
```
To view the memory limit we set on the container, we need to look at the file `memory.limit_in_bytes` like so:

`cat /sys/fs/cgroup/memory/docker/4a28d674d1bbb6ff8b3a96d4d4610e05fdb192fa294d810825e121f3c6baf610/memory.limit_in_bytes`

You'll get output similar to the following:

`157286400`

which is the actual byte count for the `150 MB` memory limit we set on the container, `hungry_container`.

As you see there a close relationship between Docker and the host it's running in. More on this later.

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



