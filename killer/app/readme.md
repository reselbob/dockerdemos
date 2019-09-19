# Killer App

The purpose of this project is to demonstrate signal capturing under Docker and graceful
shut down.

**Step 1:**  Create a Docker image tagged, `GOOD_DOG`

`docker build -t good_dog .`

**Step 2:** Create a Docker image tagged, `BAD_DOG`

`docker build -t bad_dog . -f badDockerfile`

**Step 3:** Start up a container, `mygood_dog`. We'll start it in the forefront so that you
can observe the runtime behavior

`docker run --name mygood_dog good_dog`

**Step 4:** In **another terminal window** spin up a container, `mybad_dog`.
We'll also start it in the forefront so that you can observe the runtime behavior

`docker run --name mybad_dog bad_dog`

**Step 4:** Open a ** third terminal window** . Let's stop `mygood_dog`.

`docker stop mygood_dog`

**Step 5:** Go back to the terminal window in which you started `mygood_dog`.

You should see output similar to the following:

```text
GOOD_DOG pulse 2019-09-19_23:06:08
GOOD_DOG pulse 2019-09-19_23:06:09
GOOD_DOG pulse 2019-09-19_23:06:10
GOOD_DOG pulse 2019-09-19_23:06:11
GOOD_DOG pulse 2019-09-19_23:06:12
GOOD_DOG is stopping at 2019-09-19_23:06:13 signal: 15
```

**Step 6:** Go back to the third terminal window and `kill` the container `mybad_dog`.

`docker kill mybad_dog`

**Step 7:** Go back to the terminal window in which you started `mybad_dog`.

You should see output similar to the following:

```text
BAD_DOG pulse 2019-09-19_23:15:55
BAD_DOG pulse 2019-09-19_23:15:56
BAD_DOG pulse 2019-09-19_23:15:57
BAD_DOG pulse 2019-09-19_23:15:58
BAD_DOG pulse 2019-09-19_23:15:59
BAD_DOG pulse 2019-09-19_23:16:00
BAD_DOG pulse 2019-09-19_23:16:01
BAD_DOG pulse 2019-09-19_23:16:02
```

Why is there no shutdown signal?

_The SIGTERM signal is sent to a process to request its termination.
Unlike the SIGKILL signal, it can be caught and interpreted or ignored by the process.
This allows the process to perform nice termination releasing resources and saving state if appropriate.
It should be noted that SIGINT is nearly identical to SIGTERM._
