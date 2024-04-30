import puppeteer from 'puppeteer';
import { delay } from '../helpers/delay.js';
import playAlert from '../helpers/soundAlert.js';
import { waitAndClick } from '../helpers/waitAndClick.js';
import { utils, writeFile } from 'xlsx';
const getMilesData = async (page, index) => {
  await delay(2000);
  await page.waitForSelector('div.miles .list-group-item.club', {
    timeout: 15000,
  });
  const buttons = await page.$$('div.miles .list-group-item.club');
  await buttons[index].click();
  await page.waitForSelector('body.modal-open', { timeout: 15000 });
  await page.waitForSelector('body.modal-open', {
    hidden: true,
    timeout: 5000,
  });
  const ticketData = await page.$eval('.tb-booking.total tbody', (tbody) => {
    const rows = tbody.querySelectorAll('tr');
    let miles = null;
    let taxes = null;

    rows.forEach((row) => {
      const itemName = row.querySelector('td:first-child').innerText.trim();
      const itemValue = row.querySelector('td:nth-child(2)').innerText.trim();

      if (itemName === 'Pasajes') {
        miles = itemValue;
      } else if (itemName === 'Tasas e impuestos') {
        taxes = itemValue;
      }
    });

    return {
      miles,
      taxes,
    };
  });
  await waitAndClick(page, 'div.miles .list-group-item.club', 15000);

  return ticketData;
};

export const getFlightData = async (url) => {
  playAlert(1);
  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: ['--mute-audio'],
    args: ['--autoplay-policy=no-user-gesture-required'],
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const [page] = await browser.pages();
  await page.setViewport({ width: 1366, height: 766 });
  await page.goto(url);
  await page.waitForSelector('.resume-filters', { timeout: 100000 });
  await waitAndClick(page, '#acept-cookies', 4000);
  try {
    const FlightsData = await page.$$('.group-info-flights');
    const data = [];
    for (let i = 0; i < FlightsData.length - 1; i++) {
      const flight = FlightsData[i];
      console.log(i);
      const origin = {
        airport: await flight.$eval(
          '.travel-origin div.travel-airport',
          (e) => e.textContent
        ),
        departureTime: await flight.$eval(
          '.travel-origin div.travel-date-info',
          (e) => e.textContent
        ),
      };
      const destination = {
        airport: await flight.$eval(
          '.travel-arrival div.travel-airport',
          (e) => e.textContent
        ),
        arrivalTime: await flight.$eval(
          '.travel-arrival div.travel-date-info',
          (e) => e.textContent
        ),
      };
      const duration = {
        stops: await flight.$eval('.travel-stops', (e) => e.textContent),
        time: await flight.$eval('.travel-duration', (e) => e.textContent),
      };
      const clase = await flight.$eval('.info-cabin', (e) => e.textContent);

      const content = await getMilesData(page, i);
      console.log(origin, destination, duration, clase, content);
      data.push({
        originAirport: origin.airport,
        destinationAirport: destination.airport,
        departureTime: origin.departureTime,
        arrivalTime: destination.arrivalTime,
        stops: duration.stops,
        duration: duration.time,
        clase,
        millas: Number(content.miles),
        taxesMiles: Number(content.taxes),
        total: Math.round(Number(content.miles) + Number(content.taxes)),
      });
    }
    const sortedData = data.sort((a, b) => a.total - b.total);
    const workSheet = utils.json_to_sheet(sortedData);
    const workBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
    writeFile(workBook, 'vuelos.xlsx');
    playAlert(3);
    browser.close();
    return data;
  } catch (e) {
    console.log(e.message);
    playAlert(2);
    browser.close();
  }
};
