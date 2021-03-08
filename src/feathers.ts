import feathers from '@feathersjs/client';
import socketio from 'socket.io-client';
import feathersSocketio from '@feathersjs/socketio-client';

import { config } from './config';

const verifierClient = feathers();

const socket = socketio(config.verifierServerUrl);

verifierClient.configure(feathersSocketio(socket));

export { verifierClient };
