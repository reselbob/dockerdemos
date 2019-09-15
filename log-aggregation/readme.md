# Log Aggregation

## Simple Log Aggregation

The purpose of this project is to demonstrate how to do log aggregation using [fluentD](https://docs.fluentd.org/).

In this scenario we're going to install `fluentd` as a container and then deploy a number of other containers. All the
other containers will send log information to `stdout`. The `fluentd` container will pick up and aggregate all the output
from all the containers.

**Step 1:** Create a configuration file named `demo.conf` using the contents of shown below.  Store the file in the 
current directory.

`vi demo.conf`

Strike the `i` key to go into edit mode

Enter the following text into the `vi` editor

```text
<source>
  @type forward
  port 24224
  bind 0.0.0.0
</source>

<match *>
  @type stdout
</match>
```

Strike the `esc` key then type

`:` followed by `wq`

**Step 3:** Confirm that the file write went according to plan

`cat demon.conf`

You should see the output of the text above.

**Step 2:** Spin up the `fluentd` container like so:

`docker run -it -p 24224:24224 -v $(pwd)/demo.conf:/fluentd/etc/demo.conf -e FLUENTD_CONF=demo.conf fluent/fluentd:latest`

You'll see output similar to the following:

```text
2019-09-15 20:15:13 +0000 [info]: parsing config file is succeeded path="/fluentd/etc/demo.conf"
2019-09-15 20:15:13 +0000 [info]: using configuration file: <ROOT>
  <source>
    @type forward
    port 24224
    bind "0.0.0.0"
  </source>
  <match *>
    @type stdout
  </match>
</ROOT>
2019-09-15 20:15:13 +0000 [info]: starting fluentd-1.3.2 pid=7 ruby="2.5.2"
2019-09-15 20:15:13 +0000 [info]: spawn command to main:  cmdline=["/usr/bin/ruby", "-Eascii-8bit:ascii-8bit", "/usr/bin/fluentd", "-c", "/fluentd/etc/demo.conf", "-p", "/fluentd/plugins", "--under-supervisor"]
2019-09-15 20:15:13 +0000 [info]: gem 'fluentd' version '1.3.2'
2019-09-15 20:15:13 +0000 [info]: adding match pattern="*" type="stdout"
2019-09-15 20:15:13 +0000 [info]: adding source type="forward"
2019-09-15 20:15:13 +0000 [info]: #0 starting fluentd worker pid=17 ppid=7 worker=0
2019-09-15 20:15:13 +0000 [info]: #0 listening port port=24224 bind="0.0.0.0"
2019-09-15 20:15:13 +0000 [info]: #0 fluentd worker is now running worker=0"
```

**Step 3:** In a new terminal window, spin up another container using the `fluentd` container a the log-driver

`docker run --log-driver=fluentd ubuntu echo "Hello Fluentd from [YOUR_NAME_HERE]!"`

for example: `docker run --log-driver=fluentd ubuntu echo "Hello Fluentd from Bob!"`

output:

`Hello Fluentd from Bob!`

**Step 4:** Go back to the first terminal window. You'll see the output shown above aggregated tp the `fluentd` output, like so:

```text
.
.
2019-09-15 20:15:13 +0000 [info]: #0 listening port port=24224 bind="0.0.0.0"
2019-09-15 20:15:13 +0000 [info]: #0 fluentd worker is now running worker=0"
2019-09-15 20:18:16.000000000 +0000 ca3d9a543a63: {"container_id":"ca3d9a543a63af4b27cef2de9e78b592f5ac669557d3464dd6a35777c4a1f361","container_name":"/pensive_bassi","source":"stdout","log":"Hello Fluentd from Bob"}
```

##Log Aggregation Under Docker Compose