# Killer App

The purpose of this project is to demonstrate signal capturing under Docker and graceful
shut down.

**Step 1:** In the current terminal window (1), turn on `docker events`,

`docker events`

**Step 2:**  In a **new terminal window** (2), create a Docker image tagged, `GOOD_DOG`

`docker build -t good_dog .`

**Step 2:** Create a Docker image tagged, `BAD_DOG`

`docker build -t bad_dog . -f badDockerfile`

**Step 3:** Start up a container, `mygood_dog`. We'll start it in the forefront so that you
can observe the runtime behavior

`docker run --name mygood_dog good_dog`

**Step 4:** In yet **another new terminal window** (3) Spin up a container, `mybad_dog`.
We'll also start it in the forefront so that you can observe the runtime behavior

`docker run --name mybad_dog bad_dog`

**Step 4:** In still **another new terminal window** (4) open a ** third terminal window** . Let's stop `mygood_dog`.

`docker stop mygood_dog`

**Step 5:** Go back to the terminal window (2) in which you started `mygood_dog`.

You should see output similar to the following:

```text
GOOD_DOG pulse 2019-09-19_23:06:08
GOOD_DOG pulse 2019-09-19_23:06:09
GOOD_DOG pulse 2019-09-19_23:06:10
GOOD_DOG pulse 2019-09-19_23:06:11
GOOD_DOG pulse 2019-09-19_23:06:12
GOOD_DOG is stopping at 2019-09-19_23:06:13 signal: 15
```

**Step 6:** Go back to the terminal window (4) and `kill` the container `mybad_dog`.

`docker kill mybad_dog`

**Step 7:** Go back to the terminal window (3) in which you started `mybad_dog`.

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

**Step 8:** Go back to the first terminal window (1) an review `docker events`

You'll see output similar to the following

```text
2019-09-19T23:36:15.517993336Z container kill ea9f0b66a6235a9bee55cacf6a19190d9bff0bc5b51faef37f96758e57dfaa66 (image=good_dog, name=mygood_dog, signal=15)
2019-09-19T23:36:15.587763943Z container die ea9f0b66a6235a9bee55cacf6a19190d9bff0bc5b51faef37f96758e57dfaa66 (exitCode=0, image=good_dog, name=mygood_dog)
2019-09-19T23:36:15.667670303Z network disconnect db3d1f35c20cbb57854f214ab0375b420987b6d48708f3e8e59c3d200776909d (container=ea9f0b66a6235a9bee55cacf6a19190d9bff0bc5b51faef37f96758e57dfaa66, name=bridge, type=bridge)
2019-09-19T23:36:15.696012167Z container stop ea9f0b66a6235a9bee55cacf6a19190d9bff0bc5b51faef37f96758e57dfaa66 (image=good_dog, name=mygood_dog)
2019-09-19T23:36:39.621984668Z container kill c2bae9196988677a65583af8b768f08588ec86745c2cc429e59f734fa3f2e2cf (image=bad_dog, name=mybad_dog, signal=9)
2019-09-19T23:36:39.709344777Z container die c2bae9196988677a65583af8b768f08588ec86745c2cc429e59f734fa3f2e2cf (exitCode=137, image=bad_dog, name=mybad_dog)
2019-09-19T23:36:39.791669170Z network disconnect db3d1f35c20cbb57854f214ab0375b420987b6d48708f3e8e59c3d200776909d (container=c2bae9196988677a65583af8b768f08588ec86745c2cc429e59f734fa3f2e2cf, name=bridge, type=bridge)
```

**Step 8:** Review the Linux Signal Code shown blow,

**Linux Signal Codes**
```text
0 - ? 
1 - SIGHUP - ?, controlling terminal closed, 
2 - SIGINT - interupt process stream, ctrl-C 
3 - SIGQUIT - like ctrl-C but with a core dump, interuption by error in code, ctl-/ 
4 - SIGILL 
5 - SIGTRAP 
6 - SIGABRT 
7 - SIGBUS 
8 - SIGFPE 
9 - SIGKILL - terminate immediately/hard kill, use when 15 doesn't work or when something disasterous might happen if process is allowed to cont., kill -9 
10 - SIGUSR1 
11 - SIGEGV 
12 - SIGUSR2
13 - SIGPIPE 
14 - SIGALRM
15 - SIGTERM - terminate whenever/soft kill, typically sends SIGHUP as well? 
16 - SIGSTKFLT 
17 - SIGCHLD 
18 - SIGCONT - Resume process, ctrl-Z (2nd)
19 - SIGSTOP - Pause the process / free command line, ctrl-Z (1st)
20 - SIGTSTP 
21 - SIGTTIN 
22 - SIGTTOU
23 - SIGURG
24 - SIGXCPU
25 - SIGXFSZ
26 - SIGVTALRM
27 - SIGPROF
28 - SIGWINCH
29 - SIGIO 
29 - SIGPOLL 
30 - SIGPWR - shutdown, typically from unusual hardware failure 
31 - SIGSYS 
```

`2019-09-19T23:36:15.517993336Z container kill ea9f0b66a6235a9bee55cacf6a19190d9bff0bc5b51faef37f96758e57dfaa66 (image=good_dog, name=mygood_dog, signal=15)`

Notice the container  `mygood_dog` exited with a signal of 15 which is `SIGTERM`. This makes sense because we shut down `mygood_dog` using `docker stop`.

Notice the container  `mybad_dog` exited with a signal of 9 which is `SIGKILL`. This makes sense because we shut down `mybad_dog` using `docker kill`.

The takeaway? When shutting down a container, try to use `docker stop`. The `SIGTERM` signal can get to the application and thus, shutdown can be graceful.