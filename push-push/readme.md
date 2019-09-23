# Push Push

The purpose of this project is to demonstrate how to push a Docker image up to DockerHub.

**Step 1:** Build the image against the `Dockerfile`

`docker build -t YOUR_IMAGE_NAME .`

Example:

`docker build -t my_cool_image .`

**Step 2:** Tag your image with a DockHub tag

`docker tag YOUR_IMAGE_NAME YOUR_REPO_NAME/YOUR_IMAGE_NAME:TAG`

** WHERE**

* `docker tag` is the Docker tag command set
* `YOUR_IMAGE_NAME` is the name you assigned to the image when building it using `docker build`
* `YOUR_REPO_NAME` is the name of your repo in DockerHub
* `YOUR_IMAGE_NAME` is the name you assigned to the image at build
* `TAG` is a version tag for you image, for example `v:1.0`. (Tag names are arbitrary.)

Example:

`docker tag coolapp reselbob/coolapp:v1.0`

**Step 3:** Login into DockerHub

`docker login`

You be prompted for a username and password

**Step 4:** Push the image up to DockerHub

`docker push YOUR_REPO_NAME/YOUR_IMAGE_NAME:TAG`

Example:

`docker push reselbob/coolapp:v1.0`

**Step 5:** Got your repo on DockerHub, you should see the image in the repo