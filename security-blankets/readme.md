#Security Blankets

## Scenario 1

The purpose of this project is to demonstrate how to create a Docker image that supports two users and how to work
between users.

```text
FROM alpine
RUN apk update && apk add curl && adduser -D -g '' micky_mouse && adduser -D -g '' donald_duck
USER micky_mouse
WORKDIR /home/micky_mouse
```

**Step 1:** Navigate to the directory, `blanket_1` which contains the Dockerfile we'll be working with.

`cd blanket_1`

**Step 2:** Build the Docker image. 

`docker build -t blanket:v1 .`

**Step 3:** Let's take a look at the details of the image.

`docker image inspect blanket:v1`

**Step 4:** Create a container based on the image giving the container the name, `myblanket`.

`docker run -d --name myblanket -u donald_duck blanket:v1 top`

**Step 5:** Navigate into the container.

`docker exec -it myblanket /bin/sh`

**Step 6:** Confirm the working directory. 

`pwd`

You'll see the current directory is the one that for the user declared in the `Dockerfile` and set as the `WORKDIR`:

`/home/micky_mouse`

**Step 7:** Try to create a file

`touch hi.there`

**Step 8:**  You'll get an error.

`touch: hi.there: Permission denied`

Why? Because the current user is `donald_duck`. To confirm the current user execute:

`whoami` 

You'll see that the current user is `donald_duck`.
 
Keep in mind that `donald_duck` does not have file create permission in the home directory of `micky_mouse`. So, let's move to the home directory for `donald_duck` and see what happens.

**Step 9:**  Navigate to the home directory of `donald_duck`.

`cd ~`

**Step 10:** Check it out the full path of home directory.

`pwd`

You should see, `/home/donald_duck`

**Step 11:** Now try to create a file and take a look.

`echo "I am Donald Duck" > hi.there && cat hi.there`

You'll be able to create the directory and write to it. And, the output will be as we expect, `I am Donald Duck`.

**Step 12:** Let's clean up. Get out of the container.

`exit`

**Step 13:** Remove the container.

`docker rm -f myblanket`

**Step 14:** Nuke the image.

`docker rmi -f blanket:v1`
