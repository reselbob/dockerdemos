# Monitors

The purpose of this project is to demonstrate how to install the Docker monitoring utilities
cAdvisor and Portainer on a host.

## Installing cAdvisor

**Step 1:** Run the following command in a terminal window:

```text
docker run \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --volume=/dev/disk/:/dev/disk:ro \
  --publish=8080:8080 \
  --detach=true \
  --name=cadvisor \
  google/cadvisor:latest
```
**Step 2:** Go to a browser and enter the following in the address bar:

`http://localhost:8080`

Please be advised that the installation above assume that port `8080` is not in use
on the host machine.

## Installing Portainer

**Step 1:** Run the following command in a terminal window:

`docker run -d -p 8082:9000 --privileged -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer `

**Step 2:** Go to a browser and enter the following in the address bar:

`http://localhost:8080`

Please be advised that the installation above assume that port `8082` is not in use
on the host machine.