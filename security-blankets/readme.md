# Security Blankets

The purpose of this project is to demonstrate how to create a Docker image that supports two users and how to work
between users.

You can use the Kataboda Ubuntu Playground to run this demo;

**Step 1:** Go the the Kataboda Ubuntu Playground:

`https://katacoda.com/courses/kubernetes/playground` 


**Step 2:** Clone the code from GitHub

`git clone https://github.com/reselbob/dockerdemos.git`

**The Secure Docker File**


**Step 3:** Navigate to the directory, `blanket_1` which contains the Dockerfile we'll be working with.

`cd /security-blankets/blanket_1`

Notice that the instructions in the `Dockerfile` below creates two users, `micky_mouse` and `donald_duck`. Also, the Dockerfile sets `mickey_mouse` to be the default user and the working directory to the home directory of `mickey_mouse`.

```text
FROM alpine
RUN apk update && apk add curl && adduser -D -g '' micky_mouse && adduser -D -g '' donald_duck
USER micky_mouse
WORKDIR /home/micky_mouse
```

**Step 4:** Build the Docker image. 

`docker build -t blanket:v1 .`

**Step 5:** Let's take a look at the details of the image.

`docker image inspect blanket:v1`

**Step 6:** Create a container based on the image giving the container the name, `myblanket`.

`docker run -d --name myblanket -u donald_duck blanket:v1 top`

**Step 7:** Navigate into the container.

`docker exec -it myblanket /bin/sh`

**Step 8:** Confirm the working directory. 

`pwd`

You'll see the current directory is the one that for the user declared in the `Dockerfile` and set as the `WORKDIR`:

`/home/micky_mouse`

**Step 9:** Try to create a file

`touch hi.there`

**Step 10:**  You'll get an error.

`touch: hi.there: Permission denied`

Why? Because the current user is `donald_duck`. To confirm the current user execute:

`whoami` 

You'll see that the current user is `donald_duck`.
 
Keep in mind that `donald_duck` does not have file create permission in the home directory of `micky_mouse`. So, let's move to the home directory for `donald_duck` and see what happens.

**Step 11:**  Navigate to the home directory of `donald_duck`.

`cd ~`

**Step 12:** Check it out the full path of home directory.

`pwd`

You should see, `/home/donald_duck`

**Step 13:** Now try to create a file and take a look.

`echo "I am Donald Duck" > hi.there && cat hi.there`

You'll be able to create the directory and write to it. And, the output will be as we expect, `I am Donald Duck`.

**Step 14:** Let's clean up. Get out of the container.

`exit`

**Step 15:** Remove the container.

`docker rm -f myblanket`

**Step 16:** Nuke the image.

`docker rmi -f blanket:v1`
