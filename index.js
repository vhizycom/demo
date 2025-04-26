const express = require('express');
const net = require('net');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.text({ type: '*/*' }));

app.post('/spinpay', async (req, res) => {
  const spinHost = 'spin.spinpos.net';
  const spinPort = 5555;
  const xmlBody = req.body;

  const client = new net.Socket();
  let responseData = '';

  client.connect(spinPort, spinHost, () => {
    console.log('Connected to SpinPOS proxy');
    client.write(xmlBody);
  });

  client.on('data', (data) => {
    responseData += data.toString();
  });

  client.on('end', () => {
    console.log('Disconnected from SpinPOS');
    res.set('Content-Type', 'text/xml');
    res.status(200).send(responseData);
  });

  client.on('error', (err) => {
    console.error('SpinPOS TCP error:', err);
    res.status(500).send('TCP connection failed: ' + err.message);
  });
});

app.listen(PORT, () => {
  console.log(`SpinPOS Proxy API is running on port ${PORT}`);
});
