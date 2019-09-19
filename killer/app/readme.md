# Killer App

The purpose of this project is to demonstrate signal capturing under Docker and graceful
shut down.

**Step 1:**  Create a Docker image tagged, `GOOD_DOG`

`docker build -t good_dog .`

**Step 2:** Create a Docker image tagged, `BAD_DOG`

`docker build -t bad_dog .`

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

```

**Step 6:** Go back to the third terminal window and just nuke the container `mybad_dog`.

`docker rm -f mybad_dog`

**Step 7:** Go back to the terminal window in which you started `mybad_dog`.

You should see output similar to the following:

```text

```
