import consola from 'npm:consola';
import { TConfig, TParty } from './types.ts';

export async function createShipment(
  config: TConfig,
  reciever: TParty,
  reference: string,
) {
  const res = await fetch(`${config.apiurl}/shipment/v2_2/label`, {
    method: 'POST',
    headers: {
      'apikey': config.apikey,
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Customer: {
        CollectionLocation: '100548', /* https://developer.postnl.nl/support/api-general/what-value-should-i-use-for-collectionlocation-or-bls-code/ */
        CustomerCode: config.customerInfo.code,
        CustomerNumber: config.customerInfo.number,
        Email: config.sender.email,
        Address: {
          AddressType: '02',
          CompanyName: config.sender.company_name,
          FirstName: config.sender.first_name,
          Name: config.sender.last_name,
          Street: config.sender.address.street,
          houseNumber: config.sender.address.houseNumber,
          ZipCode: config.sender.address.postalCode,
          City: config.sender.address.city,
          Countrycode: 'NL',
        },
      },
      Message: {
        MessageID: '1',
        MessageTimeStamp: new Date().toLocaleString('nl-NL').replace(',', ''),
        Printertype: 'GraphicFile|PDF',
      },
      Shipments: [
        {
          Addresses: [
            {
              AddressType: '01',
              CompanyName: reciever.company_name,
              FirstName: reciever.first_name,
              Name: reciever.last_name,
              Street: reciever.address.street,
              HouseNr: reciever.address.houseNumber,
              HouseNrExt: reciever.address.houseNumberAddition,
              ZipCode: reciever.address.postalCode,
              City: reciever.address.city,
              Countrycode: 'NL',
            },
          ],
          Contacts: {
            ContactType: '01',
            Email: reciever.email,
          },
          Dimension: {
            Weight: 2000,
          },
          ProductCodeDelivery: '3085',
          Reference: reference,
        },
      ],
    }),
  });

  const data = await res.json();

  const barcode = data.ResponseShipments[0].Barcode;
  const label = data.ResponseShipments[0].Labels[0].Content;
  const errors = data.ResponseShipments[0].Errors;
  const warnings = data.ResponseShipments[0].Warnings;

  if (errors.length > 0) {
    consola.error(errors);
  }

  if (warnings.length > 0) {
    console.warn(warnings);
  }

  return { barcode, label };
}
