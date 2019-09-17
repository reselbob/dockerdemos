# Travel Agent

The purpose of this project is to demonstrate how to incorporate an ELK stack created using Docker Compose into another Docker Compose application.

The application we'll in corporate is Travel Agent. Travel agent is an HTTP url that returns a travel service at random.

After Travel Agent is brought up using Docker Compose, the application will be accessible on port 4000. (Assuming you use all the default
settings.)

## Example call:

`curl localhost:4000`

Will return a response similar to:

`{"serviceName":"lodging","item":"westin","agent":"Reselbob Travel"}`

**WHERE**

* `serviceName`, is one of the subordinate applications that provides service to the Travel Agency (`auto`, `airline`, `travel`).
* `item`, is one of the items that the 
* ``