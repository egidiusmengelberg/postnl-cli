import consola from 'npm:consola';
import { homedir } from 'node:os';
import path from 'node:path';
import { exit } from 'node:process';
import { parse, stringify } from '@std/yaml';
import { decodeBase64 } from '@std/base64';

import { ask, askConfirm, askSelect } from './ask.ts';
import { getAddresses } from './address.ts';
import { createShipment } from './shipment.ts';
import { TAddress, TConfig, TCustomerInfo, TParty } from './types.ts';

const configPath = path.join(homedir(), '.postnl');
const labelPath = path.join(homedir(), 'Desktop');

if (import.meta.main) {
  consola.box('PostNL Shipment CLI');

  try {
    await Deno.lstat(configPath);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }

    consola.warn('No config found, running setup');
    await setup();
  }

  await main();
}

async function setup() {
  const apikey: string = await ask('What is your PostNL apikey?');

  const apiurl: string = await askSelect(
    'What is the PostNL api url?',
    [
      {
        label: 'Sandbox (https://api-sandbox.postnl.nl)',
        value: 'https://api-sandbox.postnl.nl',
      },
      {
        label: 'Production (https://api.postnl.nl)',
        value: 'https://api.postnl.nl',
      },
    ],
  )

  const customerCode: string = await ask('What is your PostNL customer code?');
  const customerNumber: string = await ask('What is your PostNL customer number?');
  const openLabel: boolean = await askConfirm('Do you want to open the label after creation?');
  const senderCompanyName: string = await ask("What is the sender's business name? (if left empty, first and last name are required)");
  const senderFirstName: string = await ask("What is the sender's first name? (if left empty, business name is required)");
  const senderLastName: string = await ask("What is the sender's last name? (if left empty, business name is required)");
  const senderEmail: string = await ask("What is the sender's email?");
  const senderPostalCodeQuery: string = await ask("What is the sender's postal code?");
  const senderHouseNumberQuery: string = await ask("What is the sender's house number?");

  const senderAddresses: Array<TAddress> = await getAddresses(
    senderPostalCodeQuery,
    senderHouseNumberQuery,
  );

  const senderAddress: string = await askSelect(
    'Which address do you want to use?',
    senderAddresses.map((address) => {
      return {
        label: `${address.street} ${address.houseNumber}${address.houseNumberAddition}, ${address.postalCode} ${address.city}`,
        value: JSON.stringify(address),
      };
    }),
  );

  const customerInfo: TCustomerInfo = {
    code: customerCode,
    number: customerNumber,
  };

  const sender: TParty = {
    company_name: senderCompanyName,
    first_name: senderFirstName,
    last_name: senderLastName,
    email: senderEmail,
    address: JSON.parse(senderAddress),
  };

  const config: TConfig = {
    apiurl,
    apikey,
    customerInfo,
    sender,
    openLabel,
  };

  await Deno.writeTextFile(
    configPath,
    stringify(config),
  );

  consola.success('Config saved, exiting...');
  consola.info('You can change the config by editing the file at', configPath);
  exit(0);
}

async function main() {
  const decoder = new TextDecoder('utf-8');
  const config: TConfig = parse(
    decoder.decode(await Deno.readFile(configPath)),
  ) as TConfig;

  const defaultReference: string = `PKG${Math.floor(1000 + Math.random() * 9000)}`;

  const recieverCompanyName: string = await ask("What is the reciever's business name? (if left empty, first and last name are required)");
  const recieverFirstName: string = await ask("What is the reciever's first name? (if left empty, business name is required)");
  const recieverLastName: string = await ask("What is the reciever's last name? (if left empty, business name is required)");
  const recieverEmail: string = await ask("What is the reciever's email?");
  const reference: string = await ask('What is the reference of the shipment?', defaultReference) ?? defaultReference;
  const recieverPostalCodeQuery: string = await ask("What is the reciever's postal code?");
  const recieverHouseNumberQuery: string = await ask("What is the reciever's house number?");

  const recieverAddresses: Array<TAddress> = await getAddresses(
    recieverPostalCodeQuery,
    recieverHouseNumberQuery,
  );

  const recieverAddress: string = await askSelect(
    'Which address do you want to use?',
    recieverAddresses.map((address) => {
      return {
        label: `${address.street} ${address.houseNumber}${address.houseNumberAddition}, ${address.postalCode} ${address.city}`,
        value: JSON.stringify(address),
      };
    }),
  );

  const reciever: TParty = {
    company_name: recieverCompanyName,
    first_name: recieverFirstName,
    last_name: recieverLastName,
    email: recieverEmail,
    address: JSON.parse(recieverAddress),
  };

  const { barcode, label } = await createShipment(
    config,
    reciever,
    reference,
  );

  await Deno.writeFile(
    path.join(labelPath, `postnl-${barcode}.pdf`),
    decodeBase64(label),
  );

  if (config.openLabel) {
    const openCommand = new Deno.Command('open', {
      args: [path.join(labelPath, `postnl-${barcode}.pdf`)],
      stdin: 'piped',
      stdout: 'piped',
    });

    const openCommandProcess = openCommand.spawn();
    await openCommandProcess.stdin.close();
  }
}
