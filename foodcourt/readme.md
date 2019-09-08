# Food Court

The purpose of this project is to demonstrate the implicit service discovery that `docker-compose`
internal DNS naming provides.

## Start up

`docker-compose up -d`

## Discussion

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

## Checking It Out

Once `docker-compose` is up and running, try the following `curl` command to observe how behavior
changes each time a call is made to the service.

`for i in {1..20}; do curl localhost:4000 -w "\n"; done`
