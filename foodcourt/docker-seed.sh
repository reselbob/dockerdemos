#!/usr/bin/env bash

#Create the local repo
docker run -d -p 5000:5000 --restart=always --name registry registry:2

#Create the burgerqueen container image
cd burgerqueen

docker build -t burgerqueen .

docker tag burgerqueen localhost:5000/burgerqueen

docker push localhost:5000/burgerqueen

cd ..

#Create the customer container image
cd customer

docker build -t customer .

docker tag customer localhost:5000/customer

docker push localhost:5000/customer

cd ..

#Create the hobos container image
cd hobos

docker build -t hobos .

docker tag hobos localhost:5000/hobos

docker push localhost:5000/hobos

cd ..

#Create the iowafried container image
cd iowafried

docker build -t iowafried .

docker tag iowafried localhost:5000/iowafried

docker push localhost:5000/iowafried

cd ..