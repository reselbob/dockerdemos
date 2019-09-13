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



**Step 2:** Execute the following command to navigate into a container and arrive
at a command prompt

`docker run -it --net none alpine /bin/sh`

**Step 3:** Get some network information about the container

`ifconfig`

You should see only the loopback interface

```text
lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Makes sense because the option, `--net node` declares that the container should have no network
interface to the outside world.

**Step 4:** Let's see if we can get to the outside world by pinging Google's IP address. Execute:

`ping 8.8.8.8`

You should get something similar to the following:

`connect: Network is unreachable`

Again, it makes sense because the option `--net none` denies the container access to the outside world.

**Step 5:** Exit out of the container

`exit`

## Bridged

This part of the demo shows you how to create a bridged network.

**Step 1:** Execute the following command to navigate into a container and arrive
at a command prompt

`docker run -it --net bridge alpine /bin/sh`

**Step 2:** Get some network information about the container

`ifconfig`

You should see the loopback interface as well as the `eth0` interface to the bridge network
and thus to the outside world, like so

```text
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.18.0.2  netmask 255.255.255.0  broadcast 172.18.0.255
        ether 02:42:ac:12:00:02  txqueuelen 0  (Ethernet)
        RX packets 10  bytes 828 (828.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

**Step 3:** Let's see if we can get to the outside world by pinging Google's IP address. Execute:

`ping 8.8.8.8`

You'll have success because the container can see the outside world

```text
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=56 time=1.19 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=56 time=1.53 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=56 time=1.50 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=56 time=1.36 ms
```

**Step 4:** Exit out of the container

`exit`

**Step 5:** What is the Docker bridge network's IP? Let find out by running `ifconfig` on the host.

`ifconfig`

You will get output similar to the following

```text
docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.18.0.1  netmask 255.255.0.0  broadcast 172.18.255.255
        ether 02:42:9d:d3:03:8a  txqueuelen 0  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.86.217  netmask 255.255.255.0  broadcast 192.168.86.255
        inet6 fe80::a00:27ff:fef4:372  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:f4:03:72  txqueuelen 1000  (Ethernet)
        RX packets 737997  bytes 439515092 (439.5 MB)
        RX errors 0  dropped 246022  overruns 0  frame 0
        TX packets 158410  bytes 14744273 (14.7 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 602  bytes 56200 (56.2 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 602  bytes 56200 (56.2 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Notice that network interface, `docker0`. That's the bridge.


## Shared

In this demonstration we'll spin up two containers. The second container will use the netowork
interface of the first.

**Step 1:** Let's spin up the first container using a bridge connection. We don't have to
set the option `--net bridge` because this is the default.

`docker run -d --name containerOne alpine top`

**Step 2:** In a second terminal window we'll set up a second container that's sharing
the first container's network interface.

`docker run -d --name containerTwo --net container:containerOne alpine top`

**Step 3:** Let's take a look at the network configuration of `containerOne`

`docker exec -it containerOne ifconfig`

You will see output similar to the following:

```text
eth0      Link encap:Ethernet  HWaddr 02:42:AC:12:00:02
          inet addr:172.18.0.2  Bcast:172.18.0.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:10 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:828 (828.0 B)  TX bytes:0 (0.0 B)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```

**Step 4:** Let's take a look at the network configuration of `containerOne`

`docker exec -it containerTwo ifconfig`

You will see output similar to the following:

```text
eth0      Link encap:Ethernet  HWaddr 02:42:AC:12:00:02
          inet addr:172.18.0.2  Bcast:172.18.0.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:10 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:828 (828.0 B)  TX bytes:0 (0.0 B)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```

Notice that both `containerOne` and `containerTwo` have the same IP address attached to `eth0`.
This makes sense because `containerTwo` is sharing the network interface of `containerOne`.

**Step 5:** Let's delete `containerTwo`

`docker rm -f containerTwo`

**Step 6:** We'll run a new instance of containerTwo using the default, `bridge`

`docker run -d --name containerTwo alpine top`

**Step 7:** Let's the network configuration for the new instance of `containerTwo`

`docker exec -it containerTwo ifconfig`

You'll see some output similar to this"

```text
eth0      Link encap:Ethernet  HWaddr 02:42:AC:12:00:03
          inet addr:172.18.0.3  Bcast:172.18.0.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:7 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:578 (578.0 B)  TX bytes:0 (0.0 B)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```

Notice that `eth0` has a new IP address special to the container

## Open Container

In this demonstration we'll use the Open Container method is which a container will use the IP
address of the host.

**Step 1:** Get the IP address of the host:

`ifconfig`

You'll see output similar to this:

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
       valid_lft 79579sec preferred_lft 79579sec
    inet6 fe80::a00:27ff:fef4:372/64 scope link
       valid_lft forever preferred_lft forever
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 02:42:9d:d3:03:8a brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
```

Keep track of the IP address of host, in this case `192,168.86.217`.

**Step 2:** Let's fire up a container using `--net host`.

`docker run -d --name hostIPContainer --net host alpine top`

**Step 3:** Let's navigate into the container and get a shell

`docker exec -it hostIPContainer /bin/sh`

**Step 4:** Get the network information for the container

`ifconfig`

You'll get output similar to the following

```text
docker0   Link encap:Ethernet  HWaddr 02:42:9D:D3:03:8A
          inet addr:172.17.0.1  Bcast:172.17.255.255  Mask:255.255.0.0
          UP BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

enp0s3    Link encap:Ethernet  HWaddr 08:00:27:F4:03:72
          inet addr:192.168.86.217  Bcast:192.168.86.255  Mask:255.255.255.0
          inet6 addr: fe80::a00:27ff:fef4:372/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:742488 errors:0 dropped:246022 overruns:0 frame:0
          TX packets:159394 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:442660545 (422.1 MiB)  TX bytes:14843026 (14.1 MiB)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:634 errors:0 dropped:0 overruns:0 frame:0
          TX packets:634 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:59664 (58.2 KiB)  TX bytes:59664 (58.2 KiB)
```

Notice that the host network inteface is exposed inexit the contiainer like so:

```text
enp0s3    Link encap:Ethernet  HWaddr 08:00:27:F4:03:72
          inet addr:192.168.86.217  Bcast:192.168.86.255  Mask:255.255.255.0
```

**Step 5:** Exit the container

`exit`