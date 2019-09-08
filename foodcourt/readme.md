# Food Court

The purpose of this project is to demonstrate the internal DNS naming and implicit service discovery that `docker-compose`
internal DNS naming provides.

## Start up

`docker-compose -d up`

## Discussion

You'll notice in the file `docker-compose.yaml` defines four services:

* customer
* burgerqueen
* hobos
* iowafried

Each of these represents an HTTP server that returns a random order. For example, `bugerqueen` sells items called
`burger`, `fries`, `whooper`, `onion rings`. When the server is called, one of these items is returned at random.

All the restaurants, `burgerqueen`, `hobos` and `iowafried` work in a similar manner. Each restaurant has its own set of menu items.

The service, `customer` calls one of the restaurants at random and requests a menu item. Then, a random menu item is returned
according to the restaurant's menu items.

So, what does all of this have to do with implicit DNS naming that `docker-compose` provides? The relevance is in the way
that [`customer`](customer/index.js) accesses the service. Look at the following code:

```javascript
const services = ['burgerqueen', 'hobos', 'iowafried'];

const sample = (items) => {return items[Math.floor(Math.random()*items.length)];};

//some more code, then..

    const service = sample(services);

    http.get(`http://${service}:3000`, (resp) => {
    
```
Notice that `${service}` is a variable that refers to a DNS name. The DNS name is extracted from the array, `services`.
The values in the array, `services` correspond to the service names defined in the 
`docker-compose.yaml` file which you can view [here](docker-compose.yaml).
