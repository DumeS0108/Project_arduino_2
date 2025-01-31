const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const app = express();
const PORT = 3000;

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en ligne sur http://192.168.65.219:${PORT}`);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion au port série de l'Arduino
const arduinoPort = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser = arduinoPort.pipe(new Readline({ delimiter: '\n' }));

// Variables d'état
let drawerState = 'CLOSED'; // 'OPEN' ou 'CLOSED'
let alarmArmed = true; // Alarme activée par défaut

// Écoute des messages de l'Arduino
parser.on('data', (data) => {
    console.log('Reçu de l’Arduino :', data);
    
    if (data.includes('OPEN')) {
        drawerState = 'OPEN';
    } else if (data.includes('CLOSED')) {
        drawerState = 'CLOSED';
    }
});

// Route pour récupérer l'état actuel
app.get('/status', (req, res) => {
    res.json({ drawerState, alarmArmed });
});

// Route pour changer l'état de l'alarme
app.post('/toggle-alarm', (req, res) => {
    alarmArmed = !alarmArmed;
    console.log(`Alarme ${alarmArmed ? 'armée' : 'désarmée'}`);

    // Envoyer la commande à l'Arduino
    arduinoPort.write(alarmArmed ? 'ARM\n' : 'DISARM\n');

    res.json({ alarmArmed });
});