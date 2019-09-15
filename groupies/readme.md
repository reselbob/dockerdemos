# Groupies

The purpose of this project is to demonstrate various aspects of Linx `cgroup` in preparation to understanding
the underlying isolation technologies in Docker.

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



