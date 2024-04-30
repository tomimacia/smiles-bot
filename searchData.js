import { dateToMilliseconds } from './helpers/dateToMiliseconds.js';

const originAirportCode = 'CDG';
const destinationAirportCode = 'EZE';
const departureDate = '13-09-2024';
const adults = '1';
const children = '0';
const infants = '0';
const isFlexibleDateChecked = 'false';
const tripType = '2';
const cabinType = 'all';
const currencyCode = 'BRL';
const destructuredDate = dateToMilliseconds(departureDate);

export const URL = `https://www.smiles.com.ar/emission?originAirportCode=${originAirportCode}&destinationAirportCode=${destinationAirportCode}&departureDate=${destructuredDate}&adults=${adults}&children=${children}&infants=${infants}&isFlexibleDateChecked=${isFlexibleDateChecked}&tripType=${tripType}&cabinType=${cabinType}&currencyCode=${currencyCode}`;
