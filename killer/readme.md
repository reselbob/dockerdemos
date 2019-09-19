# Killer

The purpose of this project is to demonstrate the most efficient way to configure a Dockerfile so that killing
a container that is based on the Dockerfile exits fast and clean.


Make an evil, lazy Dockerfile that will take its time exiting

```text
FROM alpine
RUN echo "while [ 1==1 ]; do echo 'Bad Boy'; done" > bad.sh
CMD ["sh bad.sh"]
```

Make a nice, non-lazy Dockerfile that will exit clean

```text
FROM alpine
CMD ["top", "-o"]
```