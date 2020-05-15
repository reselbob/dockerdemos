# Food Court

## Running under Docker Compose

The purpose of this project is to demonstrate the implicit service discovery that `docker-compose`
internal DNS naming provides.

Before starting, review the Docker Compose file:

```yaml
version: '3'
services:
  customer:
    build: ./customer
    ports:
      - "4000:3000"
    networks:
      - westfield_mall
  burgerqueen:
    build: ./burgerqueen
    networks:
      - westfield_mall
  hobos:
    build: ./hobos
    networks:
      - westfield_mall
  iowafried:
    build: ./iowafried
    networks:
      - westfield_mall
networks:
  westfield_mall:
```
Notice that the entry point to the application is the service, `customer` which binds the host
port, `4000` to the container port, `3000`. After we get the application up and running we'll
access the application via `localhost:4000`.

### Installation and Initial Operation

**Step 1:** Go to the Katacoda Ubuntu Playground

`https://katacoda.com/courses/ubuntu/playground`

**Step 2:** Clone the code from the GitHub respository.

`git clone https://github.com/reselbob/dockerdemos.git`

**Step 3:** Navigate to this Food Court project

`cd dockerdemos/foodcourt/`

**Step 4:** Bring up the application under Docker Compose

`docker-compose up -d`

It will take a minute or two for the application's images to build and the containers
to run.

When  the process completes you'll get output similar to the following

```text
Creating foodcourt_hobos_1 ...
Creating foodcourt_iowafried_1 ...
Creating foodcourt_customer_1 ...
Creating foodcourt_burgerqueen_1 ...
Creating foodcourt_hobos_1
Creating foodcourt_iowafried_1
Creating foodcourt_customer_1
Creating foodcourt_iowafried_1 ... done
```

**Step 5:** Once `docker-compose` is up and running, try the following bash `for` loop
 that runs a `curl` command against the Food Court Service running under HTTP.
 


`for i in {1..20}; do curl localhost:4000 -w "\n"; done`

You'll get output similar to the following:

```text{"restaurant":"Burger Queen","order":"burger","customer":"Friendly Shopper"}
       {"restaurant":"Iowa Fried Chicken","order":"Chix Pack","customer":"Friendly Shopper"}
       {"restaurant":"Howard Bonsons","order":"double burger","customer":"Friendly Shopper"}
       {"restaurant":"Burger Queen","order":"onion rings","customer":"Friendly Shopper"}
       {"restaurant":"Iowa Fried Chicken","order":"Spicy Wings","customer":"Friendly Shopper"}
       {"restaurant":"Howard Bonsons","order":"fried shrimp","customer":"Friendly Shopper"}
       {"restaurant":"Burger Queen","order":"fries","customer":"Friendly Shopper"}
       {"restaurant":"Iowa Fried Chicken","order":"Chix Pack","customer":"Friendly Shopper"}
       {"restaurant":"Burger Queen","order":"onion rings","customer":"Friendly Shopper"}
       {"restaurant":"Burger Queen","order":"whooper","customer":"Friendly Shopper"}
       {"restaurant":"Iowa Fried Chicken","order":"Chix Pack","customer":"Friendly Shopper"}
       {"restaurant":"Iowa Fried Chicken","order":"Chicken Pot Pie","customer":"Friendly Shopper"}
       {"restaurant":"Burger Queen","order":"whooper","customer":"Friendly Shopper"}
       {"restaurant":"Iowa Fried Chicken","order":"Chicken Pot Pie","customer":"Friendly Shopper"}
       {"restaurant":"Iowa Fried Chicken","order":"Chicken Pot Pie","customer":"Friendly Shopper"}
       {"restaurant":"Howard Bonsons","order":"soda and fries","customer":"Friendly Shopper"}
       {"restaurant":"Burger Queen","order":"fries","customer":"Friendly Shopper"}
       {"restaurant":"Howard Bonsons","order":"double burger","customer":"Friendly Shopper"}
       {"restaurant":"Howard Bonsons","order":"grilled cheese","customer":"Friendly Shopper"}
       {"restaurant":"Burger Queen","order":"onion rings","customer":"Friendly Shopper"}
```
Notice the response changes each time a call is made to the service.
### Discussion

You'll notice in the file [`docker-compose.yaml`](docker-compose.yaml) defines four services:

* customer
* burgerqueen
* hobos
* iowafried

Each of these represents an HTTP server that returns a random order. For example, `bugerqueen` sells items called
`burger`, `fries`, `whooper`, `onion rings`. When the server is called, one of these items is returned at random.

All the restaurants, `burgerqueen`, `hobos` and `iowafried` work in a similar manner. Each restaurant has its own set of menu items.

The service, `customer` calls one of the restaurants at random and requests a menu item. Then, a random menu item is returned
according to the restaurant's menu items.

So, what does all of this have to do with the implicit DNS naming that `docker-compose` provides? The relevance is in the way
that [`customer`](customer/index.js) accesses the given service. Look at the following code:

```javascript
const services = ['burgerqueen', 'hobos', 'iowafried'];

const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

//some more code, then..

    const service = sample(services);

    http.get(`http://${service}:3000`, (resp) => {

//the code goes on....

```
Notice that `${service}` is a variable that refers to a DNS name. The DNS name is a string that's extracted from the array, `services`.
The values in the array, `services` correspond to the service names defined in the 
`docker-compose.yaml` file which you can view [here](docker-compose.yaml).

## Running under Docker Swarm

**Step 1:** Go to the Katacoda Swarm Playground

`https://katacoda.com/courses/docker-orchestration/playground`

**Step 2:** Get the source code

`git clone https://github.com/reselbob/dockerdemos.git`

**Step 3:** Navigate to the working directory

`cd dockerdemos/foodcourt/`

**Step 4:** Seed a local Docker registry

`sh docker-seed.sh`

**Step 5:** Seed a create the network overlay

`docker network create -d overlay westfield_mall`

**Step 6:** Deploy Food Court to the Swarm

`docker stack deploy --compose-file docker-swarm-compose.yaml foodcourt`

**Step 7:** Take a look at the services running in the Swarm

`docker stack services foodcourt`

**NOTE:** Be patient. It takes a while for the containers to spin up.

**Step 8:** Take a look at the Nodes running in the Swarm

`docker node ls`

**Step 9:** Exercise the exposed Customer services

`for i in {1..20}; do curl host01:4000 -w "\n"; done`