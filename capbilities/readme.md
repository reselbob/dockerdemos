# Capabilities

The purpose of this project is to demonstrate Linux [capabilities](https://en.wikibooks.org/wiki/Grsecurity/Appendix/Capability_Names_and_Descriptions)
as the concept relates to  Docker containers.

## Controlling capabilities in a container

**Step 1:** Execute the following to see the capabilities of the host

`sudo /sbin/capsh --print`

**Step 2:** Execute the following to spin up the container with the default
capabilities.

`docker run -it debian /bin/sh -c "apt-get update && apt-get install -qq libcap2-bin && bash"`

**Step 3:** From inside the container, execute:

`/sbin/capsh --print | grep "cap_net_raw"`

You'll see output similar to:

`
Current: = cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap+eip
Bounding set =cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap
`
Because the capability, `cap_net-raw` is in force in the container.

**Step 4:** Run another container that drops the capability, `cap_net_raw`

`docker run --cap-drop=net_raw  -it debian /bin/sh -c "apt-get update && apt-get install -qq libcap2-bin && bash"`

then

`/sbin/capsh --print | grep "cap_net_raw"`

You'll see nothing in output because the capability, `cap_net_raw` has been dropped
from the container.