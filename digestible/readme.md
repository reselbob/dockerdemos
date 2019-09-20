# Digestible

The purpose of this project is to demonstrate how to use a Docker digest to create secure
Dockerfile.

**Step 1:** Pull down the `alpine` image from DockerHub.

`docker pull alpine`

You'll get output similar to the following:

```text
Using default tag: latest
latest: Pulling from library/alpine
9d48c3bd43c5: Pull complete
Digest: sha256:72c42ed48c3a2db31b7dafe17d275b634664a708d901ec9fd57b1529280f01fb
Status: Downloaded newer image for alpine:latest
```

**Step 2:** Just to confirm, get the digest signature by running the following:

`docker images --digests`

You'll get output is a similar format to the following:

```text
REATED             SIZE
alpine              latest         sha256:72c42ed48c3a2db31b7dafe17d275b634664a708d901ec9fd57b1529280f01fb   961769676411        4 weeks ago         5.58MB
redis               latest         sha256:854715f5cd1b64d2f62ec219a7b7baceae149453e4d29a8f72cecbb5ac51c4ad   857c4ab5f029        7 weeks ago         98.2MB
weaveworks/scope    1.11.4         sha256:8c44d6761e197cc5c901d8b017d3afc528d3437aa057d5f2dee7fab39a9bfb3f   a082d48f0b39        7 weeks ago         78.5MB
ubuntu              latest         sha256:c303f19cfe9ee92badbbbd7567bc1ca47789f79303ddcef56f77687d4744cd7a   3556258649b2        8 weeks ago         64.2MB
alpine              <none>         sha256:6a92cd1fcdc8d8cdec60f33dda4db2cb1fcdcacf3410a8e05b3741f44a9b5998   b7b28af77ffe        2 months ago        5.58MB```
```
Notice that in this case there are two entries for `alpine`. One is 4 weeks old. The other is 2 months old. We pulled
the one that is 4 weeks old.

**Step 3:** Create a Dockerfile as followings, using the recent digest

`vi Dockerfile`

```text
FROM alpine@sha256:72c42ed48c3a2db31b7dafe17d275b634664a708d901ec9fd57b1529280f01fb
ENTRYPOINT ["echo", "Mimicking: "]
CMD ["There is nothing to mimic."]
```
Exit `vi`.

**Step 3:** Build a Docker image.

`docker build -t mimic .`

**Step 4:** Create a container using the `--rm` option so the container is destroyed right after running.

`docker run --rm mimic 'I am using the digest'`

You'll get output similar to the following:

`Mimicking:  I am using the digest`

**Step 5:** Just for fun, run the container again. Only, this time without passing in a message.

`docker run --rm mimic`

You'll get output similar to the following:

`Mimicking:  There is nothing to mimic.`

Why? Because without a parameter passed in at container creation time, the `[CMD]` clause in the Dockerfile
is respected.

