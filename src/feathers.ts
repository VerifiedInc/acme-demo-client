import feathers from '@feathersjs/client';
import socketio from 'socket.io-client';
import feathersSocketio from '@feathersjs/socketio-client';

import { config } from './config';

const verifierClient = feathers();
const issuerClient = feathers();

// const verifierSocket = socketio(config.verifierServerUrl);
// const issuerSocket = socketio(config.issuerServerUrl);

const verifierSocket = socketio(config.verifierServerUrl, {transports: ['polling']});
const issuerSocket = socketio(config.issuerServerUrl, {transports: ['polling']});

verifierClient.configure(feathersSocketio(verifierSocket));

verifierClient.on('connection', () => {
  console.log('connection');
});

verifierClient.on('disconnect', () => {
  console.log('disconnect');
});

issuerClient.configure(feathersSocketio(issuerSocket));
issuerClient.configure(feathers.authentication({
  storage: window.localStorage
}));

export { verifierClient, issuerClient };
