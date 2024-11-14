#! /bin/sh

# build application
deno compile --allow-net --allow-read --allow-write --allow-env --allow-sys --allow-run --output postnl src/main.ts

# delete existing binary
sudo rm -f /usr/local/bin/postnl

# move binary to /usr/bin
sudo mv postnl /usr/local/bin/postnl