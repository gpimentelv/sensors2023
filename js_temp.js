const fs = require('fs');

const sensorsPath = '/sys/bus/w1/devices/';

function readSensor(sensorId) {
  const sensorPath = sensorsPath + sensorId + '/w1_slave';
  try {
    const data = fs.readFileSync(sensorPath, 'utf-8');
    const match = data.match(/t=(-?\d+)/);
    if (match) {
      const temperature = parseInt(match[1]) / 1000.0;
      return temperature;
    }
    else {
      console.error(`Error: No se pudo leer la temperatura del sensor ${sensorId}.`);
      return null;
    }
  }
  catch (err) {
    console.error(`Error: No se pudo leer el archivo del sensor ${sensorId}.`);
    console.error(err);
    return null;
  }
}

function listSensors() {
  try {
    const sensors = fs.readdirSync(sensorsPath);
    const sensorIds = sensors.filter(sensor => sensor.startsWith('28-'));
    console.log(`IDs de sensores encontrados: ${sensorIds.join(', ')}`);
  }
  catch (err) {
    console.error('Error: No se pudo leer la carpeta de sensores.');
    console.error(err);
  }
}

// Lee todos los IDs de sensores y lista los disponibles
listSensors();

// Lee la temperatura del primer sensor encontrado
const sensorIds = fs.readdirSync(sensorsPath).filter(sensor => sensor.startsWith('28-'));
if (sensorIds.length > 0) {
  const temperature = readSensor(sensorIds[0]);
  console.log(`Temperatura del sensor ${sensorIds[0]}: ${temperature.toFixed(2)}°C`);
}
else {
  console.error('Error: No se encontraron sensores DS18B20.');
}
