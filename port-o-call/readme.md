# Port-o-Call

The purpose of the project is to demonstrate various apsects to Docker port assignemnt and forwarding.

## Mapping a service port on the host to the container default port

**Step 1:** Sping up a instance of an `nginx` container using the `-P` option.

`docker run -d -P --name mynginx nginx:latest`

**WHERE**

* `docker` is the command execute a command against the Docker API
* `run` is the subcommand that create a docker container
* `-d` is the option that indicates to run the container in the background as a daemon
* `-P` is the option that maps exposed ports to all host interfaces
* `--name mynginx` is the option to give the container a specific name that can be used instead of the container's `id`. in this case the name is, `mynginx`.
* `nginx:latest` is the image to use to create the container. By default Docker will look for the container image on DockerHub if it not in the local Docker cache.

**Step 2:** Once the container is up and running let's look at it runtime configuration data. Execute the following command:

`grep mynginx | docker ps -a`

You'll get output that looks similar to the following:

```text
CONTAINER ID        IMAGE                   COMMAND                  CREATED              STATUS              PORTS                                              NAMES
046d450a80ba        nginx:latest            "nginx -g 'daemon of…"   About a minute ago   Up About a minute   0.0.0.0:32768->80/tcp         
```
Notice the entry, `0.0.0.0:32768->80/tcp`

This indicates that by using the option, `-P` we're asking the Docker Engier to create a port number at random on the host that maps onto the default port of the container. The randomly assigned port number is, `32768` which maps to the default container port for `nginx` which is port `80`.

**Step 3:**  Let's call the nginx server running in the container named, `mynginx` using the randomly assigned port number. Execute the following command.

`curl localhost:32768`

You'll see output similar to the following:

```text
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>

```
This output is the welcome HTML from nginx. You're in contact with the nginx server running in the container.

**Step 4:** Nuke the container

`docker rm -f mynginx`

## Mapping a random port on the host to a specific container port
 
**Step 1:** Start a container using the option `-p`

`docker run -d -p 83 --name mynginx nginx:latest`

**Step 2:** Get the container's configuration information

`docker ps -a`

You'll get output similar to the following:

```text
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                                              NAMES
1f0b08a899ca        nginx:latest            "nginx -g 'daemon of…"   14 seconds ago      Up 11 seconds       80/tcp, 0.0.0.0:32769->83/tcp 
```
In this case Docker assigned a random host port number to the container's port 83. Also, Docker is reporting that the container has an external port number, 80.

**Step 3:** Try to access the container using the randomly assigned port number.

`curl localhost:32769

You'll get an error, `curl: (56) Recv failure: Connection reset by peer`.

Why? Because there is nothing in the container listening on port 83 nor does the nginx image expose port 83. Still, let's navigate into the congtainer and try to run on port 80.

**Step 4:** Navigate into the shell of the container, `mynginx`.

`docker exec -it mynginx /bin/sh`

**Step 5:** Once in the container we'll need to install `curl`. It's not part of the `nginx` image. Execute the following commands to install curl:

`apt update && apt install curl -y`

**Step 6:** Now, `curl` against `localhost:80`

`curl localhost:80`

You'll get the output shown above in Step 3.

While we're inside the container, let's try to access port 83 and see what happens.

`curl localhost:83`

We'll still get an error similar to the one we had when we were tyrin get access outside the container.

**Step 7:** .Let's clean things up. First exit the container,

`exit`

Then once back at the host's command line, let's delete the container,

`docker rm -f mynginx`

## Mapping a host port to a container port

**Step 1:** Start up a container mapping the host port 80 to the container port 80:

`docker run -d -p 80:80 --name mynginx nginx:latest`

Notice that the option, `-p` now has a mapping `80:80`. The format for this mapping is `HOST_PORT:CONTAINER_PORT`.

**Step 2:** Get the container's configuration information

`docker ps -a`

You'll get output similar to the following:

```text
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                                              NAMES
dde902d99270        nginx:latest            "nginx -g 'daemon of…"   54 seconds ago      Up 51 seconds       0.0.0.0:80->80/tcp                                 myncurl localhostginx
```
Notice the entry:

`0.0.0.0:80->80/tcp`

Now the host's port 80 is mapped to the container port 80. Since port 80 is the default port to the nginx web server all we need to do is call `localhost` to get a response.

**Step 3:**  Call the nginx web server using `localhost`.

`curl localhost`

Again, you'll get the nginx Welcome output shown above in Step 3.

**Step 4:** Clean up by nuking the container

`docker rm -f mynginx`

## Map the IP address and default port of the host to a container port

**Step 1:** Let's find the IP address of the host machine

`ifconfig`

The response will contain your machines's IP address, like so:

```text
docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:9d:d3:03:8a  txqueuelen 0  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.86.32  netmask 255.255.255.0  broadcast 192.168.86.255
        inet6 fe80::a00:27ff:fef4:372  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:f4:03:72  txqueuelen 1000  (Ethernet)
        RX packets 781324  bytes 445897074 (445.8 MB)
        RX errors 0  dropped 246022  overruns 0  frame 0
        TX packets 161144  bytes 15017580 (15.0 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 692  bytes 65138 (65.1 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 692  bytes 65138 (65.1 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Notice the entry:

```text
enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.86.32  netmask 255.255.255.0  broadcast 192.168.86.25
```

In this case, the IP address is `192.168.86.32`.

**Step 2:** Let's spin up a container and bind the host's  port 80 to the container's port 80.

`docker run -d -p 192.168.86.32:80:80 --name mynginx nginx:latest`

**Step 3:** Now let's go up against the host's IP address:

`curl 192.168.86.32`

You'll get the following output, which is the HTML for the nginx Welcome page:

```text
<DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>

```

**Step 4:** Let's clean up

`docker rm -f mynginx`
















