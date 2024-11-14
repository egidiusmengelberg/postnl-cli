
# 📬 PostNL CLI

An unofficial PostNL CLI to easily create shipping labels.


## Features

- 🔎 Easy address search based on postalcode + housenumber
- 📂 Automatically open generated label
- ⚡️ Built in configuration assistant


## Setup

After downloading and adding to your path you can start the cli by running the following command:

```sh
postnl
```

On first startup (or when no config can be found) the cli will ask for your details. You will need to enter the following:

- PostNL APIKEY (read below for info)
- PostNL APIURL (When registering for a production api key you have to first use the sandbox api)
- PostNL Customer Code (4 letters)
- PostNL Customer Number (Multiple Digits)
- Open label after creation (save location is desktop by default)
- Sender info

The config location is:

```
{homedir}/.postnl
```

To restart the configuration assistant you will need to remove this file and restart the cli.


## How to get a APIKEY

1. Register for PostNL Business

2. Register for sandbox api key

3. Use CLI to generate sandbox label

4. Follow PostNL instruction of obtaining a production key (emailing a photo of your generated label to them)

5. 🚀 Great Succes 🚀
## Roadmap

- Configure where to save label (and label name)

- Add different sending options (Signature on delivery, only deliver at specified address, etc.)

- Internationalisation?

- Feel free to create issues with other ideas.

