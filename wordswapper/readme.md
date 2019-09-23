# Word Swapper

**UNDER CONSTRUCTION**

The purpose of this demonstration is to implement and observe 
the results of various Docker behaviors.

Using [Katacoda's Ubuntu Playground](https://katacoda.com/courses/ubuntu/playground)
is probably the best way to do the exercises in this demonstration.
The advantage is that you "wipe" the Playground's virtual machine
clean after an exercise by refreshing the Katacoda and thus reset the computing environment
to a pristine state.

## About the Demonstration Code, WordSwapper

`wordswapper` is a small utility application written in Node.js that replaces every word in the files,
`file1.txt` and `file1.txt` with the word `cheese`. Of course, it's a silly program and it's meant to
be. Its overall purpose is twofold. First, the provide files of significant size, (`file1.txt` and `file2.txt`
are each almost 1 MB size), that will need to be included as data in a container.

The second pupose is to provide data files in the container's file system which, after processing will result
in the creation of two more data files saved to the container's file system. This feature will become
useful when we look at the [container volumes](https://docs.docker.com/storage/volumes/)
later in this demonstration.

## Setting up Code Execution Environment

Go to Katacoda's Ubuntu Playground [here](https://katacoda.com/courses/ubuntu/playground).

Clone this code in the Katacoda virtual machine:

`git clone https://github.com/reselbob/dockerdemos.git`

Navigate to the source code directory:

`cd dockerdemos/wordswapper/`

## Exercises

### Building a Docker Image Without Caching

`time docker build -t badwrapper --no-cache . -f Dockerfile_bad `

### Building a Docker Image With Caching

`time docker build -t badwrapper -f Dockerfile_bad .`

You should see output similar to the following.

```text
real    0m9.332s
user    0m0.032s
sys     0m0.040s
```


### Building a Docker Image Using Caching

Let's `build` the image again. Only this time because the required layers are in cache, the build should
take significantly less time.

Run the following command:

`time docker build -t badwrapper . -f Dockerfile_bad `

You should see output similar to the following:

```text
real    0m0.133s
user    0m0.032s
sys     0m0.004s
```

Take a look at the images that are installed on Katacode virtual machine:

`docker images`

Let's use the Docker sub-command, [`history`](https://docs.docker.com/engine/reference/commandline/history/) to take a look at the history of the image

`docker history badwrapper`

Let's take a look at the Docker sub-command, [`inspect`](https://docs.docker.com/engine/reference/commandline/inspect/)
to view details about the image.

`docker inspect badwrapper`

docker run -it badwrapper ls -lh

### Building a Docker Image Using a Well Formed Docker File

`time docker build -t goodwrapper -f Dockerfile_good .`

```text
real    0m12.158s
user    0m0.040s
sys     0m0.016s

```


### Building a Docker Image Using Cache

`time docker build -t goodwrapper . -f Dockerfile_good`

```text
real    0m0.150s
user    0m0.024s
sys     0m0.020s
```


`docker images`

`docker history goodwrapper`

`docker inspect goodwrapper`

`docker run -it goodwrapper ls -lh`

#Take out the container after it runs
docker run --rm -it goodwrapper ls -lh

### Creating Volumes from the Hosts File System to the Docker Container

You might be asking, where are the files that result from running `wordswapper`? The reason you are not able to view the results
of running the `wordswapper` code is becuase the resulting output files are saved in the container's file
system. When the code runs the containers exits from memory and its file system "disappears". In order
to persist the file system, we need to mount a directory in the host to a container.

The following command mounts the Katacoda host directory, `/root/dockerdemos/wordswapper` to the `app`
directory in the container. 

Let's build the Docker image again, just in case you jumped directly to this section
and neglected to do the build earlier.

`docker build -t goodwrapper . -f Dockerfile_good`

Execute the command to run the container with a bound volume.

`docker run -v /root/dockerdemos/wordswapper:/app goodwrapper`

Now, let's take a look at the host's directory, `/root/dockerdemos/wordswapper`

`ls -lh /root/dockerdemos/wordswapper`

You'll see out put similar to the following:

```text
-rw-r--r-- 1 root root 1.1K Sep  8 17:10 cheat-sheet.txt
-rw-r--r-- 1 root root   97 Sep  8 17:10 Dockerfile_bad
-rw-r--r-- 1 root root  167 Sep  8 17:10 Dockerfile_good
-rw-r--r-- 1 root root 983K Sep  8 17:10 file1.txt
-rw-r--r-- 1 root root 985K Sep  8 17:10 file2.txt
-rw-r--r-- 1 root root  733 Sep  8 17:10 index.js
-rw-r--r-- 1 root root  238 Sep  8 17:10 package.json
-rw-r--r-- 1 root root 836K Sep  8 17:13 resultFile1.txt
-rw-r--r-- 1 root root 837K Sep  8 17:13 resultFile2.txt
```

Let's take a look at the contents of one of the result files.

`cat /root/dockerdemos/wordswapper/resultFile1.txt`

You should see a lot of cheese:

`cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheesecheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheesecheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheesecheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheesecheese cheese cheese cheese cheese cheese cheese cheese cheese cheese`

