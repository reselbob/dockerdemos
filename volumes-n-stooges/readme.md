# Volumes and Stooges


**UNDER CONSTRUCTION**

The purpose of this project is to demonstrate how to create a Docker volume and attach it to a contiainer.
The example data is derived from information concerning the mid 20th Century comedy group
[The Three Stooges](https://www.youtube.com/watch?v=vHTXDP_Sr6U).

**Step 1:**: 

`docker volume create stooges`

**Step 2:**: 

`docker volume inspect stooges`

```text
[
    {
        "CreatedAt": "2019-09-14T23:47:44Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/stooges/_data",
        "Name": "stooges",
        "Options": {},
        "Scope": "local"
    }
]
```

**Step 3:**: 

`cd /var/lib/docker/volumes/stooges/_data`

**Step 4:**: 

`echo " I am Moe!" > moe.txt`

`echo " I am Larry!" > larry.txt`

`echo " I am Curly!" > curly.txt`

**Step 5:**: 

`docker run -d --name myalpine alpine top`

**Step 6:**: 

`docker exec -it myalpine /bin/sh`

`ls -ls`
```text
drwxr-xr-x    2 root     root        4.0K Jul 11 17:29 bin
drwxr-xr-x    5 root     root         340 Sep 15 00:06 dev
drwxr-xr-x    1 root     root        4.0K Sep 15 00:06 etc
drwxr-xr-x    2 root     root        4.0K Jul 11 17:29 home
drwxr-xr-x    5 root     root        4.0K Jul 11 17:29 lib
drwxr-xr-x    5 root     root        4.0K Jul 11 17:29 media
drwxr-xr-x    2 root     root        4.0K Jul 11 17:29 mnt
drwxr-xr-x    2 root     root        4.0K Jul 11 17:29 opt
dr-xr-xr-x  109 root     root           0 Sep 15 00:06 proc
drwx------    1 root     root        4.0K Sep 15 00:07 root
drwxr-xr-x    2 root     root        4.0K Jul 11 17:29 run
drwxr-xr-x    2 root     root        4.0K Jul 11 17:29 sbin
drwxr-xr-x    2 root     root        4.0K Jul 11 17:29 srv
dr-xr-xr-x   13 root     root           0 Sep 15 00:06 sys
drwxrwxrwt    2 root     root        4.0K Jul 11 17:29 tmp
drwxr-xr-x    7 root     root        4.0K Jul 11 17:29 usr
drwxr-xr-x   11 root     root        4.0K Jul 11 17:29 var
```

**Step 7:**: 

`exit`

**Step 8:**: 

`docker rm -f myalpine`

**Step 9:**: 

`docker run --name myalpine -d -v stooges:/tmp alpine top`

**WHERE** 

**Step 10:**: 

`docker exec -it myalpine /bin/sh`

**Step 11:**: 

`ls -lh /tmp`
```text
-rw-r--r--    1 root     root          13 Sep 14 23:49 curly.txt
-rw-r--r--    1 root     root          13 Sep 14 23:49 larry.txt
-rw-r--r--    1 root     root          11 Sep 14 23:49 moe.txt
```

**Step 12:**: 

`cat /tmp/moe.txt`

**Step 13:**: 

`exit`

`docker rm -f myalpine`
