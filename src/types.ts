export type TPDOKAddress = {
  straatnaam: string;
  huisnummer: number;
  huisletter?: string;
  postcode: string;
  woonplaatsnaam: string;
};

export type TAddress = {
  street: string;
  houseNumber: string;
  houseNumberAddition: string;
  postalCode: string;
  city: string;
};

export type TParty = {
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  address: TAddress;
};

export type Shipment = {
  barcode: string;
  label: string;
};

export type TCustomerInfo = {
  code: string;
  number: string;
};

export type TConfig = {
  apiurl: string;
  apikey: string;
  customerInfo: TCustomerInfo;
  sender: TParty;
  openLabel: boolean;
};
