import * as dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import fetch from 'node-fetch';
import { bot } from './bot/bot';

let lastState: 'AVAILABLE' | 'UNAVAILABLE' = 'UNAVAILABLE';

console.log('Starting...');

cron.schedule('*/1 * * * *', async () => {
  console.log('Initiated cron task...');

  const url = process.env.WEB_URL || '';
  const hour = new Date().toISOString();

  try {
    const res = await fetch(url);
    if (res.status !== 200) return;
    if (lastState === 'AVAILABLE') return;

    lastState = 'AVAILABLE';
    const msg = `${hour} \nSistema de citas DISPONIBLE. 🟢 \n${url}`;

    bot.sendMessage(process.env.CHANNEL_ID as any, msg);
    console.log('Service available...');
  } catch (e) {
    console.log('Handling error...', e);
    if (lastState === 'UNAVAILABLE') return;
    lastState = 'UNAVAILABLE';
    const msg = `${hour} \nSistema de citas NO disponible. 🔴 \n${url}`;

    bot.sendMessage(process.env.CHANNEL_ID as any, msg);
  }
});
