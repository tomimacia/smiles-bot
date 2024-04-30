import { URL } from './searchData.js';
import { getFlightData } from './service/getFlightData.js';
// Usage
// Empieza la funcion: 1 beep
// Error en la funciona: 2 beep
// Funcion completada: 3 beep

const runBot = async () => {
  try {
    await getFlightData(URL);
  } catch (e) {
    console.error(e.message);
    await getFlightData(URL);
  }
};
runBot();
