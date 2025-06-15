import { sortByField, GnroObjectType } from '@gnro/ui/core';
import { GnroColumnConfig, GnroGridConfig } from '@gnro/ui/grid';

export const DCRBrands = [
  { title: 'Audi', name: 'Audi' },
  { title: 'BMW', name: 'BMW' },
  { title: 'Mercedes', name: 'Mercedes' },
  { title: 'Renault', name: 'Renault' },
  { title: 'Volvo', name: 'Volvo' },
  { title: 'Fiat', name: 'Fiat' },
  { title: 'Chrysler', name: 'Chrysler' },
  { title: 'Ford', name: 'Ford' },
  { title: 'GM', name: 'GM' },
  { title: 'Honda', name: 'Honda' },
  { title: 'Jaguar', name: 'Jaguar' },
  { title: 'VW', name: 'VW' },
];

export const DCRBrandsList = [...DCRBrands].map((item) => item.name);

export const DCRColors = [
  { title: 'Black', name: 'Black' },
  { title: 'Blue', name: 'Blue' },
  { title: 'Brown', name: 'Brown' },
  { title: 'Green', name: 'Green' },
  { title: 'Maroon', name: 'Maroon' },
  { title: 'Orange', name: 'Orange' },
  { title: 'Red', name: 'Red' },
  { title: 'Silver', name: 'Silver' },
  { title: 'Yellow', name: 'Yellow' },
  { title: 'White', name: 'White' },
];

export const DCRColorsList = [...DCRColors].map((item) => item.name);

console.log(' DCRColorsList=', DCRColorsList);

export const DCRGridConfig: Partial<GnroGridConfig> = {
  columnSort: true,
  columnFilter: true,
  columnResize: true,
  columnReorder: true,
  columnMenu: true,
  columnHidden: true,
  remoteColumnsConfig: true,
  remoteGridData: true,
  sortFields: [
    {
      field: 'ID',
      dir: 'asc',
    },
  ],
  columnFilters: [
    { name: 'vin', value: '9' },
    { name: 'brand', value: [{ title: 'Fiat', name: 'Fiat' }] },
    { name: 'color', value: [{ name: 'Orange', title: 'Orange' }] },
  ],
  rowSelection: true,
};

export const CARSDATA0 = {
  data: [
    {
      vin: 'ee8a89d8 ee8a89d8 ee8a89d8 ee8a89d8 ee8a89d8 ee8a89d8 ee8a89d8 ee8a89d8',
      brand: 'Fiat',
      year: 1987,
      color: 'Maroon',
    },
    {
      vin: '642b3edc',
      brand: 'Renault',
      year: 1968,
      color: 'White',
    },
    {
      vin: '19ec7580',
      brand: 'Renault',
      year: 1981,
      color: 'Black',
    },
    {
      vin: '39980f30',
      brand: 'VW',
      year: 1986,
      color: 'Red',
    },
    {
      vin: 'ec9cc4e4',
      brand: 'Fiat',
      year: 1981,
      color: 'Brown',
    },
    {
      vin: '09a06548',
      brand: 'VW',
      year: 1965,
      color: 'Green',
    },
    {
      vin: '05c47246',
      brand: 'Mercedes',
      year: 2007,
      color: 'Blue',
    },
    {
      vin: 'a9cb87aa',
      brand: 'Fiat',
      year: 1962,
      color: 'Green',
    },
    {
      vin: 'eae758fa',
      brand: 'BMW',
      year: 1999,
      color: 'Yellow',
    },
    {
      vin: '1241c403',
      brand: 'Jaguar',
      year: 1964,
      color: 'Yellow',
    },
    {
      vin: '13f853a7',
      brand: 'Honda',
      year: 2006,
      color: 'White',
    },
    {
      vin: '447d9ed9',
      brand: 'Jaguar',
      year: 2005,
      color: 'Orange',
    },
    {
      vin: '78fa052e',
      brand: 'Jaguar',
      year: 1990,
      color: 'Orange',
    },
    {
      vin: '8b77772a',
      brand: 'Mercedes',
      year: 1991,
      color: 'Blue',
    },
    {
      vin: '23ba7e86',
      brand: 'Honda',
      year: 1975,
      color: 'Yellow',
    },
    {
      vin: '9bacb32d',
      brand: 'Volvo',
      year: 1968,
      color: 'Brown',
    },
    {
      vin: '62094d91',
      brand: 'Mercedes',
      year: 1962,
      color: 'Green',
    },
    {
      vin: 'dc7003f4',
      brand: 'Jaguar',
      year: 1976,
      color: 'Maroon',
    },
    {
      vin: '08607aef',
      brand: 'Mercedes',
      year: 1987,
      color: 'Maroon',
    },
    {
      vin: '45eee33a',
      brand: 'BMW',
      year: 1980,
      color: 'Silver',
    },
    {
      vin: 'f199ec5c',
      brand: 'Jaguar',
      year: 1961,
      color: 'Green',
    },
    {
      vin: 'b34cd9e8',
      brand: 'VW',
      year: 1993,
      color: 'Silver',
    },
    {
      vin: '54b20b02',
      brand: 'Renault',
      year: 1967,
      color: 'Brown',
    },
    {
      vin: '5dd8766e',
      brand: 'Honda',
      year: 1998,
      color: 'Orange',
    },
    {
      vin: 'df50ce22',
      brand: 'Mercedes',
      year: 1964,
      color: 'White',
    },
    {
      vin: 'ecb3e9e1',
      brand: 'Honda',
      year: 2003,
      color: 'Silver',
    },
    {
      vin: '750d731d',
      brand: 'Renault',
      year: 1962,
      color: 'Blue',
    },
    {
      vin: 'bec38cf4',
      brand: 'Renault',
      year: 1960,
      color: 'Blue',
    },
    {
      vin: 'b7752002',
      brand: 'Jaguar',
      year: 1964,
      color: 'Black',
    },
    {
      vin: '315fe9c4',
      brand: 'Fiat',
      year: 1985,
      color: 'Red',
    },
    {
      vin: 'be65f786',
      brand: 'Mercedes',
      year: 1963,
      color: 'Orange',
    },
    {
      vin: '786a7d57',
      brand: 'Mercedes',
      year: 2003,
      color: 'Black',
    },
    {
      vin: 'a3aee412',
      brand: 'Volvo',
      year: 2003,
      color: 'Maroon',
    },
    {
      vin: '749e6bdd',
      brand: 'Audi',
      year: 1995,
      color: 'Brown',
    },
    {
      vin: '8cc40f50',
      brand: 'BMW',
      year: 1961,
      color: 'Brown',
    },
    {
      vin: '5de63a6f',
      brand: 'Renault',
      year: 1961,
      color: 'White',
    },
    {
      vin: 'bdae1e20',
      brand: 'Jaguar',
      year: 2008,
      color: 'Blue',
    },
    {
      vin: '290cc891',
      brand: 'VW',
      year: 1992,
      color: 'Brown',
    },
    {
      vin: '007e1014',
      brand: 'Renault',
      year: 1966,
      color: 'Black',
    },
    {
      vin: '429c502d',
      brand: 'Honda',
      year: 1995,
      color: 'Silver',
    },
    {
      vin: 'c336f9b6',
      brand: 'Honda',
      year: 1991,
      color: 'Maroon',
    },
    {
      vin: 'a6783ba3',
      brand: 'Honda',
      year: 2004,
      color: 'Yellow',
    },
    {
      vin: '2ddaf8d5',
      brand: 'Volvo',
      year: 1982,
      color: 'Blue',
    },
    {
      vin: 'c09c4b15',
      brand: 'VW',
      year: 1991,
      color: 'Blue',
    },
    {
      vin: '4609844c',
      brand: 'Honda',
      year: 1972,
      color: 'Black',
    },
    {
      vin: '8db7df27',
      brand: 'Audi',
      year: 1982,
      color: 'Blue',
    },
    {
      vin: 'dcc58086',
      brand: 'Audi',
      year: 2001,
      color: 'Brown',
    },
    {
      vin: 'f1274cbe',
      brand: 'Fiat',
      year: 1995,
      color: 'Silver',
    },
    {
      vin: '0858a5d4',
      brand: 'Renault',
      year: 1992,
      color: 'Green',
    },
    {
      vin: 'c2d42bb6',
      brand: 'Volvo',
      year: 1972,
      color: 'Green',
    },
    {
      vin: '5535cd5a',
      brand: 'Renault',
      year: 1980,
      color: 'Silver',
    },
    {
      vin: 'e3313e1e',
      brand: 'Honda',
      year: 2009,
      color: 'Orange',
    },
    {
      vin: 'f4dea691',
      brand: 'BMW',
      year: 2002,
      color: 'Brown',
    },
    {
      vin: 'ec15a449',
      brand: 'Honda',
      year: 1990,
      color: 'Yellow',
    },
    {
      vin: '80b74a0e',
      brand: 'BMW',
      year: 1979,
      color: 'Yellow',
    },
    {
      vin: '513fe268',
      brand: 'Honda',
      year: 1987,
      color: 'White',
    },
    {
      vin: '6934c8f8',
      brand: 'Renault',
      year: 1989,
      color: 'Red',
    },
    {
      vin: '6a4c3ad0',
      brand: 'Honda',
      year: 1994,
      color: 'Yellow',
    },
    {
      vin: 'e0acd7b5',
      brand: 'Mercedes',
      year: 1965,
      color: 'Red',
    },
    {
      vin: '2f31ac35',
      brand: 'Jaguar',
      year: 1991,
      color: 'Brown',
    },
    {
      vin: '36104237',
      brand: 'VW',
      year: 1992,
      color: 'Silver',
    },
    {
      vin: '5be099b4',
      brand: 'BMW',
      year: 1991,
      color: 'Yellow',
    },
    {
      vin: 'e2f55f31',
      brand: 'BMW',
      year: 1967,
      color: 'Silver',
    },
    {
      vin: '11274338',
      brand: 'Mercedes',
      year: 1999,
      color: 'Blue',
    },
    {
      vin: 'f710e177',
      brand: 'Fiat',
      year: 2007,
      color: 'White',
    },
    {
      vin: 'd8375b4b',
      brand: 'Volvo',
      year: 1977,
      color: 'Blue',
    },
    {
      vin: 'a27ddfe3',
      brand: 'VW',
      year: 1978,
      color: 'Blue',
    },
    {
      vin: 'd8848162',
      brand: 'BMW',
      year: 2008,
      color: 'Black',
    },
    {
      vin: 'e9cb3677',
      brand: 'BMW',
      year: 2004,
      color: 'Black',
    },
    {
      vin: 'c9dc321d',
      brand: 'BMW',
      year: 1989,
      color: 'Red',
    },
    {
      vin: '4c75c610',
      brand: 'Volvo',
      year: 1972,
      color: 'Yellow',
    },
    {
      vin: '1c90c93d',
      brand: 'Audi',
      year: 2004,
      color: 'Silver',
    },
    {
      vin: '5ccc9f7f',
      brand: 'Jaguar',
      year: 1961,
      color: 'Red',
    },
    {
      vin: '94498bc0',
      brand: 'Fiat',
      year: 1965,
      color: 'Silver',
    },
    {
      vin: '1d1a21f3',
      brand: 'Honda',
      year: 1985,
      color: 'Red',
    },
    {
      vin: 'ea463ad3',
      brand: 'BMW',
      year: 1992,
      color: 'Blue',
    },
    {
      vin: 'c24bdeb2',
      brand: 'Honda',
      year: 1991,
      color: 'Red',
    },
    {
      vin: 'af3b744b',
      brand: 'Audi',
      year: 1998,
      color: 'Green',
    },
    {
      vin: 'bebd5a96',
      brand: 'Jaguar',
      year: 1989,
      color: 'Black',
    },
    {
      vin: '6ef9dbf3',
      brand: 'Fiat',
      year: 1962,
      color: 'Orange',
    },
    {
      vin: 'eede8f1e',
      brand: 'Jaguar',
      year: 1977,
      color: 'Brown',
    },
    {
      vin: '9d11b02d',
      brand: 'BMW',
      year: 1971,
      color: 'Yellow',
    },
    {
      vin: '1d4223a1',
      brand: 'Mercedes',
      year: 1975,
      color: 'Brown',
    },
    {
      vin: '4d118346',
      brand: 'Mercedes',
      year: 1985,
      color: 'Brown',
    },
    {
      vin: 'cce76f06',
      brand: 'Honda',
      year: 1980,
      color: 'Maroon',
    },
    {
      vin: '2af398ed',
      brand: 'Renault',
      year: 1970,
      color: 'Yellow',
    },
    {
      vin: 'c0ddab4c',
      brand: 'Audi',
      year: 2003,
      color: 'Silver',
    },
    {
      vin: 'a27ea639',
      brand: 'Mercedes',
      year: 1968,
      color: 'Yellow',
    },
    {
      vin: 'e6441f09',
      brand: 'Jaguar',
      year: 1982,
      color: 'Green',
    },
    {
      vin: 'c4c59d58',
      brand: 'Fiat',
      year: 2005,
      color: 'Orange',
    },
    {
      vin: '9d31fc0a',
      brand: 'Mercedes',
      year: 1974,
      color: 'Brown',
    },
    {
      vin: 'b0ffce2d',
      brand: 'Volvo',
      year: 1966,
      color: 'Yellow',
    },
    {
      vin: 'ca7e52e3',
      brand: 'Honda',
      year: 1971,
      color: 'Orange',
    },
    {
      vin: '56b36f0e',
      brand: 'Mercedes',
      year: 2008,
      color: 'Orange',
    },
    {
      vin: 'ba045e1e',
      brand: 'Jaguar',
      year: 1968,
      color: 'White',
    },
    {
      vin: 'fd579989',
      brand: 'BMW',
      year: 1975,
      color: 'Black',
    },
    {
      vin: '084850a3',
      brand: 'Audi',
      year: 1990,
      color: 'Red',
    },
    {
      vin: 'e39245ab',
      brand: 'BMW',
      year: 1969,
      color: 'White',
    },
    {
      vin: '41ab14a1',
      brand: 'Jaguar',
      year: 1987,
      color: 'Silver',
    },
    {
      vin: '7ec4c1c0',
      brand: 'Jaguar',
      year: 1980,
      color: 'Black',
    },
    {
      vin: 'bf1c14aa',
      brand: 'Audi',
      year: 1984,
      color: 'Yellow',
    },
    {
      vin: 'adeff567',
      brand: 'Volvo',
      year: 2000,
      color: 'Brown',
    },
    {
      vin: '61e5e07d',
      brand: 'Mercedes',
      year: 1978,
      color: 'Orange',
    },
    {
      vin: '7555e46a',
      brand: 'Audi',
      year: 1966,
      color: 'Blue',
    },
    {
      vin: '95babbd1',
      brand: 'Honda',
      year: 1998,
      color: 'Black',
    },
    {
      vin: 'ff6885f7',
      brand: 'Audi',
      year: 1996,
      color: 'White',
    },
    {
      vin: '5b5a0031',
      brand: 'Audi',
      year: 1968,
      color: 'Brown',
    },
    {
      vin: 'de63c575',
      brand: 'Mercedes',
      year: 1989,
      color: 'Yellow',
    },
    {
      vin: '6bf3bfbc',
      brand: 'Audi',
      year: 1968,
      color: 'Green',
    },
    {
      vin: 'd2d2e8d4',
      brand: 'Fiat',
      year: 1985,
      color: 'Green',
    },
    {
      vin: 'edcab1f7',
      brand: 'VW',
      year: 1979,
      color: 'Silver',
    },
    {
      vin: '03234e20',
      brand: 'Mercedes',
      year: 1962,
      color: 'Orange',
    },
    {
      vin: 'de2a7b08',
      brand: 'Honda',
      year: 2007,
      color: 'Blue',
    },
    {
      vin: '717b8282',
      brand: 'BMW',
      year: 1999,
      color: 'Yellow',
    },
    {
      vin: '790e7f03',
      brand: 'Volvo',
      year: 1983,
      color: 'White',
    },
    {
      vin: '8eefb223',
      brand: 'Jaguar',
      year: 1983,
      color: 'Silver',
    },
    {
      vin: '5e524acd',
      brand: 'Jaguar',
      year: 1994,
      color: 'Maroon',
    },
    {
      vin: '26b1aff9',
      brand: 'BMW',
      year: 1965,
      color: 'Black',
    },
    {
      vin: 'c007a623',
      brand: 'Renault',
      year: 1968,
      color: 'Maroon',
    },
    {
      vin: '76733e83',
      brand: 'Honda',
      year: 1991,
      color: 'White',
    },
    {
      vin: 'ef3c14f7',
      brand: 'Fiat',
      year: 1987,
      color: 'Brown',
    },
    {
      vin: '2b4ca005',
      brand: 'Honda',
      year: 2009,
      color: 'Silver',
    },
    {
      vin: '8191dbb6',
      brand: 'BMW',
      year: 2005,
      color: 'Black',
    },
    {
      vin: 'f6b3bd94',
      brand: 'Renault',
      year: 1967,
      color: 'Yellow',
    },
    {
      vin: 'abb19f41',
      brand: 'Volvo',
      year: 1975,
      color: 'Blue',
    },
    {
      vin: '7470c95f',
      brand: 'Renault',
      year: 1996,
      color: 'Black',
    },
    {
      vin: '5f1b57a3',
      brand: 'Volvo',
      year: 1986,
      color: 'Red',
    },
    {
      vin: 'ed47a74b',
      brand: 'BMW',
      year: 2007,
      color: 'Brown',
    },
    {
      vin: 'ed6030f7',
      brand: 'Honda',
      year: 1990,
      color: 'Red',
    },
    {
      vin: '944c71dc',
      brand: 'Mercedes',
      year: 1991,
      color: 'Silver',
    },
    {
      vin: 'c7d838a5',
      brand: 'VW',
      year: 1980,
      color: 'Yellow',
    },
    {
      vin: '712db898',
      brand: 'Audi',
      year: 1965,
      color: 'Red',
    },
    {
      vin: '99acc06f',
      brand: 'BMW',
      year: 1995,
      color: 'Silver',
    },
    {
      vin: '6c68ffa5',
      brand: 'Jaguar',
      year: 1999,
      color: 'Green',
    },
    {
      vin: '63893922',
      brand: 'Renault',
      year: 1991,
      color: 'Brown',
    },
    {
      vin: 'dca5f739',
      brand: 'Jaguar',
      year: 2002,
      color: 'Blue',
    },
    {
      vin: '16da6dcb',
      brand: 'Jaguar',
      year: 2006,
      color: 'Blue',
    },
    {
      vin: 'fe9ca30c',
      brand: 'Fiat',
      year: 1967,
      color: 'Maroon',
    },
    {
      vin: 'f0193ac7',
      brand: 'Mercedes',
      year: 1979,
      color: 'Orange',
    },
    {
      vin: '145f5551',
      brand: 'Jaguar',
      year: 1993,
      color: 'Brown',
    },
    {
      vin: '24714317',
      brand: 'Mercedes',
      year: 1971,
      color: 'White',
    },
    {
      vin: '1a9c6e4e',
      brand: 'Jaguar',
      year: 1997,
      color: 'Yellow',
    },
    {
      vin: 'c9b7ef72',
      brand: 'Fiat',
      year: 1992,
      color: 'Maroon',
    },
    {
      vin: 'b1b6c375',
      brand: 'Fiat',
      year: 1963,
      color: 'Silver',
    },
    {
      vin: '7254a003',
      brand: 'Audi',
      year: 1982,
      color: 'White',
    },
    {
      vin: '6f0de80f',
      brand: 'Renault',
      year: 1987,
      color: 'Blue',
    },
    {
      vin: 'e3048f87',
      brand: 'Fiat',
      year: 1989,
      color: 'Blue',
    },
    {
      vin: '361e435a',
      brand: 'BMW',
      year: 1973,
      color: 'Green',
    },
    {
      vin: '59e6a9f3',
      brand: 'BMW',
      year: 1964,
      color: 'Maroon',
    },
    {
      vin: 'b791fe05',
      brand: 'Mercedes',
      year: 1993,
      color: 'Yellow',
    },
    {
      vin: '68b0dd88',
      brand: 'BMW',
      year: 2002,
      color: 'Green',
    },
    {
      vin: '5b439d1f',
      brand: 'BMW',
      year: 1964,
      color: 'Maroon',
    },
    {
      vin: '9a7ac9e3',
      brand: 'Renault',
      year: 1988,
      color: 'White',
    },
    {
      vin: 'd214751d',
      brand: 'Honda',
      year: 1997,
      color: 'White',
    },
    {
      vin: '72229390',
      brand: 'Mercedes',
      year: 1996,
      color: 'White',
    },
    {
      vin: 'b5fbbeee',
      brand: 'VW',
      year: 1999,
      color: 'Brown',
    },
    {
      vin: '8972b543',
      brand: 'Audi',
      year: 1973,
      color: 'Black',
    },
    {
      vin: '7bc21024',
      brand: 'Renault',
      year: 1980,
      color: 'Yellow',
    },
    {
      vin: '5d661964',
      brand: 'Renault',
      year: 2005,
      color: 'Silver',
    },
    {
      vin: 'a6ccc2d8',
      brand: 'Honda',
      year: 1994,
      color: 'Blue',
    },
    {
      vin: 'c1f15f28',
      brand: 'Volvo',
      year: 1999,
      color: 'Black',
    },
    {
      vin: '161512ce',
      brand: 'VW',
      year: 1962,
      color: 'Black',
    },
    {
      vin: '16e0b448',
      brand: 'Fiat',
      year: 1990,
      color: 'Green',
    },
    {
      vin: 'f0734442',
      brand: 'Audi',
      year: 1966,
      color: 'Orange',
    },
    {
      vin: '5e233279',
      brand: 'Audi',
      year: 1964,
      color: 'Green',
    },
    {
      vin: '1de720b2',
      brand: 'Renault',
      year: 2003,
      color: 'Orange',
    },
    {
      vin: '46efaeb2',
      brand: 'Jaguar',
      year: 1993,
      color: 'Green',
    },
    {
      vin: '88f2354c',
      brand: 'Jaguar',
      year: 2006,
      color: 'Black',
    },
    {
      vin: '04819fd6',
      brand: 'Mercedes',
      year: 1983,
      color: 'White',
    },
    {
      vin: '401771c8',
      brand: 'Volvo',
      year: 1962,
      color: 'Silver',
    },
    {
      vin: '8600877b',
      brand: 'VW',
      year: 1996,
      color: 'Black',
    },
    {
      vin: '946bd645',
      brand: 'Honda',
      year: 1991,
      color: 'Red',
    },
    {
      vin: 'ad078e69',
      brand: 'Fiat',
      year: 1991,
      color: 'Brown',
    },
    {
      vin: '93138901',
      brand: 'Mercedes',
      year: 1961,
      color: 'Silver',
    },
    {
      vin: 'f365dfa4',
      brand: 'Mercedes',
      year: 1980,
      color: 'Black',
    },
    {
      vin: '22647161',
      brand: 'Audi',
      year: 2007,
      color: 'Blue',
    },
    {
      vin: '92d1ee27',
      brand: 'Jaguar',
      year: 1977,
      color: 'Silver',
    },
    {
      vin: '137c2b3a',
      brand: 'Honda',
      year: 1970,
      color: 'Blue',
    },
    {
      vin: 'b05b5235',
      brand: 'BMW',
      year: 1967,
      color: 'Yellow',
    },
    {
      vin: '1afbf400',
      brand: 'Audi',
      year: 1966,
      color: 'Maroon',
    },
    {
      vin: '8530ae50',
      brand: 'BMW',
      year: 1979,
      color: 'Brown',
    },
    {
      vin: 'c9a487a3',
      brand: 'Volvo',
      year: 1981,
      color: 'Silver',
    },
    {
      vin: '5cb0bed6',
      brand: 'Honda',
      year: 1962,
      color: 'Orange',
    },
    {
      vin: 'cf7d0b45',
      brand: 'Fiat',
      year: 1997,
      color: 'Green',
    },
    {
      vin: 'bc762dd0',
      brand: 'Jaguar',
      year: 2000,
      color: 'Yellow',
    },
    {
      vin: '97207a61',
      brand: 'VW',
      year: 1976,
      color: 'Blue',
    },
    {
      vin: '17680899',
      brand: 'Mercedes',
      year: 2006,
      color: 'Silver',
    },
    {
      vin: 'd8a98d30',
      brand: 'Renault',
      year: 1990,
      color: 'Green',
    },
    {
      vin: 'ff01ead0',
      brand: 'Audi',
      year: 1962,
      color: 'Blue',
    },
    {
      vin: '38b30a61',
      brand: 'Fiat',
      year: 1977,
      color: 'White',
    },
    {
      vin: '9a6793c1',
      brand: 'Renault',
      year: 1983,
      color: 'Red',
    },
    {
      vin: 'b1f27273',
      brand: 'Mercedes',
      year: 2007,
      color: 'Brown',
    },
    {
      vin: '0fa8c1aa',
      brand: 'Jaguar',
      year: 1982,
      color: 'Blue',
    },
    {
      vin: 'a7520f42',
      brand: 'Volvo',
      year: 2008,
      color: 'Maroon',
    },
    {
      vin: '494eba81',
      brand: 'BMW',
      year: 1966,
      color: 'Silver',
    },
    {
      vin: '683535b8',
      brand: 'Renault',
      year: 2003,
      color: 'White',
    },
    {
      vin: '62e5d216',
      brand: 'Audi',
      year: 1962,
      color: 'Orange',
    },
    {
      vin: '16a65b56',
      brand: 'Jaguar',
      year: 2009,
      color: 'Blue',
    },
    {
      vin: 'd00250a3',
      brand: 'BMW',
      year: 1978,
      color: 'Blue',
    },
    {
      vin: 'f3c3909d',
      brand: 'Renault',
      year: 2003,
      color: 'Green',
    },
  ],
};

export const CARSDATA = {
  data: CARSDATA0.data.map((item: any, index) => {
    const ndate = new Date();
    item['ID'] = index + 1;
    item['MakeDate'] = new Date(item.year, ndate.getMonth() - index, index);
    return item;
  }),
};

function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export const CARSDATA3 = {
  data: CARSDATA0.data.map((item: any, index) => {
    const ndate = new Date();
    item['ID'] = index + 1;
    if (index < 0) {
      item['MakeDate'] = '';
    } else {
      item['MakeDate'] = new Date(item.year, ndate.getMonth() - index, index);
    }
    item['image'] = 'assets/test-image.jpg';
    item['Price'] = getRandomFloat(100, 20000);

    const makecolor = `${item['brand']}-${item['color']}`;
    item['MakerColor'] = {
      name: makecolor.toLowerCase(),
      title: `${item['brand']}: ${item['color']}`,
    };
    return item;
  }),
  totalCounts: 200,
};

interface optionSelect {
  name: number;
  title: string;
}

function getUniqueObjects(arr: optionSelect[], key: keyof optionSelect): optionSelect[] {
  const seen = new Set();
  return arr.filter((obj) => {
    const value = obj[key];
    if (seen.has(value)) {
      return false;
    } else {
      seen.add(value);
      return true;
    }
  });
}

const items = [...CARSDATA3.data].map((item: any) => {
  return item['MakerColor'];
});

export const MakerColorList = sortByField(getUniqueObjects(items, 'name'), 'name', 'asc');

//console.log(' MakerColorList=', MakerColorList);
//console.log(' CARSDATA3=', CARSDATA3);

export const DCRColumnConfig: GnroColumnConfig[] = [
  {
    name: 'ID',
    width: 50,
    align: 'center',
    groupField: false,
    filterField: GnroObjectType.Number,
    draggable: false,
  },
  {
    name: 'vin',
    width: 150,
    groupField: false,
    cellEditable: true,
    allowHide: false,
    //align: 'center',
  },
  {
    name: 'brand',
    title: 'this s s     sssssssssssssssssss sssssssssssssss',
    //cellEditable: true,
    rendererType: GnroObjectType.Select,
    filterFieldConfig: {
      fieldType: 'select',
      multiSelection: true,
    },
    width: 150,
  },
  {
    name: 'MakeDate',
    title: 'Manufacture Date',
    width: 100,
    cellEditable: true,
    rendererType: GnroObjectType.Date,
    rendererFieldConfig: {
      dateFormat: 'longDate',
    },
    filterField: GnroObjectType.DateRange,
    align: 'center',
  },
  {
    name: 'Price',
    width: 70,
    cellEditable: true,
    rendererType: GnroObjectType.Number,
    rendererFieldConfig: {
      decimals: 2,
    },
    filterField: GnroObjectType.Number,
    align: 'right',
  },
  {
    name: 'MakerColor',
    cellEditable: true,
    rendererType: GnroObjectType.Select,
    rendererFieldConfig: {
      optionKey: 'name',
      optionLabel: 'title',
    },
    filterFieldConfig: {
      fieldType: 'select',
      multiSelection: true,
      remoteOptions: false,
      options: MakerColorList,
      optionKey: 'name',
      optionLabel: 'title',
    },
    width: 80,
  },
  {
    name: 'year',
    width: 50,
    align: 'right',
  },
  {
    name: 'color',
    width: 80,
    //cellEditable: true,
    //rendererType: GnroObjectType.Select,
    /*
    rendererFieldConfig: {
      //optionKey: 'name',
      //optionLabel: 'title',
      options: DCRColors,
    },*/
    filterFieldConfig: {
      fieldType: 'select',
      isEmpty: true,
      notEmpty: true,
    },
    align: 'center',
  },
];
