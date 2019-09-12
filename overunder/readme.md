# Over Under

The purpose of this project is to demonstrate the Linux overlay filesystem. The Linux overlay filesystem is a precursor
upon which the concept and implementation of Docker layers is built.

An overlay sits on top of an existing filesystem. When you do a overlay, you combine an upper and a lower
directory tree (which can be from different filesystems) which results in a unified representation of
both directory trees. Should objects with the same name exist in both directory trees, then their
treatment depends on the object type.

If the upper directory has a file with the same name as one in the lower directory, the the file in the lower
directory will be hidden. Otherwise, the contents of each directory object are merged to create a
combined directory object in the overlay.

## Syntax

`mount -t overlay  -o lowerdir=./lower,upperdir=./upper,workdir=./working overlay ./merged`

**WHERE**

`mount` is the linux command that executes the overlay

`-t overlay` indicates the type of the mount, in this case it's an `overlay`

`-o` indicates the option parameters for the mount

`lowerdir=./lower` indicates the location of the upper `read-write` directory on the host filesystem.
In this case the `lowerdir` is `./lower`.

`upperdir=./upper` indicates the location of the lower `read-only` directory on the host filesystem.
In this case the `upperdir` is `./upper`.

`workdir=./working` is required option. The working directory is used to prepare files before they are switched
to the overlay destination in an atomic action. (The `workdir` needs to be on the same filesystem as the `upperdir`.)

`overlay ./merged` indicates the directory in which the entire overlay will be realized.

## Implementation

The following steps describe how to create a filesystem overlay. Also, there are steps that provide analytic review
relevant to understanding the concepts behind a filesystem overlay.

**Step 1:** Set the user to super user. (Only the users with `root` persmissions can do an overaly.)

`sudo su -`

**Step 2:** Make a directory the demonstration project.

`mkdir /home/over-under`

**Step 3:** Navigate to the demonstration project directory.

`cd /home/over-under`

**Step 4:** Make sub-directories in the demonstration project directory that we'll need to facilitate
the file system overlay.

`mkdir ./{lower,upper,working,merged}`

**Step 5:** Take a look at the directory structure. (You might have to `apt install tree` on your host system if not installed.)

`tree /home/over-under`

```text
/home/over-under
├── lower
├── merged
├── upper
└── working
```

**Step 6:** Write a line of content into a file in the `lower` directory.

`echo "I am lower 1" > lower/lower1.txt`

**Step 7:** Write a line of content into a file in the `upper` directory.

`echo "I am upper 1" > upper/upper1.txt`

**Step 8:** Execute the overlay

`mount -t overlay  -o lowerdir=./lower,upperdir=./upper,workdir=./working overlay ./merged`

**Step 9:** Take a look at the results as a tree

`tree /home/over-under`

```text
home/over-under
├── lower
│   └── lower1.txt
├── merged
│   ├── lower1.txt
│   └── upper1.txt
├── upper
│   └── upper1.txt
└── working
    └── working
```

**Step 10:** Add another line of text to the file, `lower/lower1.txt`

`echo "I am another line in lower 1" >> lower/lower1.txt`

**Step 11:** Take a look at the contents of file, `lower/lower1.txt`.

`cat lower/lower1.txt`

You should see the added line, like so:

```text
I am lower 1
I am another line in lower 1
```

**Step 12:** Take a look at the contents of file, `merged/lower1.txt

`cat merged/lower1.txt`

You should also see the added line, like so:

```text
I am lower 1
I am another line in lower 1
```

This makes sense because you made a change to the file, `lower1.txt` in lower layer 
directory and that change cascaded to up to the `merged/lower1.txt`.

**Step 13:** Add another line of text to the file, `lower1.txt` in the `read-write` directory, `./merged`.

`echo "I am yet another amazing, incredible line in lower 1" >> merged/lower1.txt`


**Step 14:** Read the contents of, ` merged/lower1.txt`.

`cat merged/lower1.txt` 

You should now see three lines of text, like so:

```text
I am lower 1
I am another line in lower 1
I am yet another amazing, incredible line in lower 1
```

**Step 15:** Read the contents of the file in the read-only directory, ` lower/lower1.txt`.

`cat lower/lower1.txt`

You should see only two lines of text, like so:

```text
I am lower 1
I am another line in lower 1
```

You are now observing the mechanics of the file system overlay. Remember in Step 14 you made a 
change to the file in the `merged` directory. The directory `merged` represents the result of the 
file system overlay. Any change made to the file, `./merged/lower1.txt will` will have NO impact on 
`./lower/lower1.txt` because the directory `./lower` is the `read-only` directory i the overlay.

**Step 16:** Now, let's go one step further. Let's delete the file, `lower1.txt` in the directory `./merged`.

`rm ./merged/lower1.txt`

**Step 17:** Take a look at the tree that is the result of deleting file.

`tree /home/over-under`

You should see something like the following:

```text
/home/over-under
├── lower
│   └── lower1.txt
├── merged
│   └── upper1.txt
├── upper
│   ├── lower1.txt
│   └── upper1.txt
└── working
    └── working
```
Notice that the file `./merged/lower.txt` has been deleted, but that `./lower/lower1.txt` remains.

**Step 18:** Take a look at the contents of the `./upper` directory.

`ls -lh ./upper`

You will see results like so:

```text
c--------- 1 root root 0, 0 Sep 12 00:58 lower1.txt
-rw-r--r-- 1 root root   13 Sep 12 00:56 upper1.txt
```

The `c` in `./upper/lower1.txt` indicates that the file is a character device.

When a file or directory that originates in the upper directory is removed from the overlay,
it's also removed from the upper directory.  When a file or directory that originates in the
lower directory is removed from the overlay, it remains in the lower directory, but a 'whiteout'
is created in the upper directory.  A whiteout takes the form of a character
device with device number 0/0, and a  name identical to the removed object.
The result of the whiteout creation means that the object in the lower directory
is ignored, while the whiteout itself is not visible in the overlay.

**Step 18:** Let's try to remove the entire project directory, `/home/over-under`.

`rm -rf /home/over-under`

You'll get an error message because the `merged` directory is still mounted. So, we need to unmount
it order to delete `/home/over-under`.

**Step 19:**  Unmount the `merged` directory

`umount /home/over-under/merged`

Once the `/home/over-under/merged` directory is unmounted, we can delete
the demonnstration project.

**Step 20:**  Delete the directory, `/home/over-under`.

`rm -rf /home/over-under`

**Congratulations!** The demonstration is complete.