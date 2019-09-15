#Security Blankets

The purpose of this project is to demonstrate how to create a Docker image that supports two users and how to work
between users.

```text
FROM alpine
RUN apk update && apk add curl && adduser -D -g '' micky_mouse && adduser -D -g '' donald_duck
USER micky_mouse
WORKDIR /home/micky_mouse
```
`cd blanket_1`

`docker build -t blanket:v1 .`

`docker image inspect blanket:v1`

`docker run -d --name myblanket -u donald_duck blanket:v1 top`

`docker exec -it myblanket /bin/sh`

`pwd`

You'll get `/home/micky_mouse` Try to create a file

`touch hi.there`

You'll get an error.

`touch: hi.there: Permission denied`

Why? Because the current user is`donald_duck`. To confirm execute:

`whoami` 
 
`donald_duck` does not have file create permission in the home directory of `micky_mouse`.

Navigate to the home directory of `donald_duck`.

`cd ~`

Check it out

`pwd`

You should see, `/home/donald_duck`

Now try to create a file and take a look.

`echo "I am Donald Duck" > hi.there && cat hi.there`

`exit`

`docker rm -f myblanket`



`
