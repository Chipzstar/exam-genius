import winston from 'winston';

import { Logtail } from '@logtail/node';

import { LogtailTransport } from '@logtail/winston';


// Create a Logtail client
const logtail = new Logtail(String(process.env.LOGTAIL_SOURCE_TOKEN), {
    endpoint: 'https://s1268746.eu-nbg-2.betterstackdata.com',
});

// Create a Winston logger - passing in the Logtail transport
export const log = winston.createLogger({
    transports: [new LogtailTransport(logtail)],
    silent: process.env.DOPPLER_ENVIRONMENT !== 'prd',
});
