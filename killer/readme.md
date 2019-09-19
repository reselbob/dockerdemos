# Killer

The purpose of this project is to demonstrate the most efficient way to configure a Dockerfile so that killing
a container that is based on the Dockerfile exits fast and clean.


Make a Good Dog Dockerfile in a Good Dog directory, like so

`mkdir good_dog && cd good_dog`

Create a Dockerfile for editing

`vi Dockerfile`

Add the following text to the Dockerfile

```text
FROM alpine
RUN echo "while [ 1==1 ]; do echo 'I am Good Dog'; sleep 1s;done" > good_dog.sh
ENTRYPOINT [sh", "good_dog.sh"]
```

Go back from whence you came 

`cd ..`


Make a Bad Dog Dockerfile in a Bad Dog directory, like so

`mkdir bad_dog && cd bad_dog`

Create a Dockerfile for editing

`vi Dockerfile`

Add the following text to the Dockerfile

```text
FROM alpine
RUN echo "while [ 1==1 ]; do echo 'I am Bad Dog'; sleep 1s;done" > bad_dog.sh
ENTRYPOINT sh bad_dog.sh
```

Go back from whence you came, again 

`cd ..`

Create the Good Dog image

`docker build -t gooddog . -f good_dog/Dockerfile`

Create the Bad Dog image

`docker build -t baddog . -f bad_dog/Dockerfile`

Spin up the Good Dog container

`docker run --name mygooddog gooddog`

In a **new** terminal window, spin up the Bad Dog container

`docker run --name mybaddog baddog`

In **another new** terminal window, do a timed stop of Good Dog

`time docker stop mygooddog`

Do a timed stop of Bad Dog

`time docker stop mybaddog`



