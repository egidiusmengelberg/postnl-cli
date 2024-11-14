import { TAddress, TPDOKAddress } from './types.ts';

export async function getAddresses(
  postalCode: string,
  houseNumber: string,
): Promise<Array<TAddress>> {
  const res = await fetch(
    `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?` +
      new URLSearchParams({
        q: `${postalCode} ${houseNumber}`,
        fl: 'straatnaam huisnummer huisletter postcode woonplaatsnaam',
        fq: 'type:adres',
      }),
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  const data = await res.json();

  return data.response.docs.map((address: TPDOKAddress): TAddress => {
    return {
      street: address.straatnaam,
      houseNumber: address.huisnummer.toString(),
      houseNumberAddition: address.huisletter ?? '',
      postalCode: address.postcode,
      city: address.woonplaatsnaam.toUpperCase(),
    };
  });
}
