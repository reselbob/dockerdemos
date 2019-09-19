`sudo vagrant ssh reselswarm1`


`sudo docker swarm init --advertise-addr 192.168.86.224`

`sudo vagrant ssh reselswarm2`

`exit`

`sudo docker swarm join --token SWMTKN-1-34155k9gn764e6f9xbl9pma9mzhoeogv2oepu7p62tvud8ixcf-1dzucrxt8uyuo83owe19awbt0 192.168.86.224:2377`

`exit`

`sudo vagrant ssh reselswarm3`

`sudo docker swarm join --token SWMTKN-1-34155k9gn764e6f9xbl9pma9mzhoeogv2oepu7p62tvud8ixcf-1dzucrxt8uyuo83owe19awbt0 192.168.86.224:2377`

`exit`

`sudo vagrant ssh reselswarm1`

`docker service create --replicas 1 --name helloworld alpine ping docker.com`