# Networks Are Us

The purpose of this project is do demonstrate the various aspects of Docker networking.

We'll take a look at the four styles of networking:

* Isolated
* Bridged
* Shared
* Open Container


## Isolated

Let's take a look at the host network environment.

**Step 1:** On your host type:

`ip addr`

You will get output the looks similar to :

```text
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:f4:03:72 brd ff:ff:ff:ff:ff:ff
    inet 192.168.86.217/24 brd 192.168.86.255 scope global dynamic enp0s3
       valid_lft 85812sec preferred_lft 85812sec
    inet6 fe80::a00:27ff:fef4:372/64 scope link
       valid_lft forever preferred_lft forever

```

Let's create a simple container using the option, `--net none`

**Step 2:** First, we'll build a container based on the accompanying Dockerfile.

`docker build -t nettystuff .`

**Step 2:** Execute the following command on the host

`docker run -it --net none nettystuff /bin/bash`

**Step 3:** Get the ID of the container

`docker ps -a`

**Step 4:** Navigate into the container

`docker exec -it <CONTAINER_ID> /bin/bash`

**Step 5:** Install `net-tools`

`sudo apt install net-tools`