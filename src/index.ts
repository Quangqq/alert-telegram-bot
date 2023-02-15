import * as dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot/bot';
import cron from 'node-cron';

let lastState: 'AVAILABLE' | 'UNAVAILABLE' = 'UNAVAILABLE';

console.log('Starting...');

cron.schedule('*/1 * * * *', async () => {
  console.log('Initiated cron task...');

  const url = process.env.WEB_URL || '';
  const hour = new Date().toISOString();

  console.log(url);
  console.log(hour);

  try {
    console.log('Fetching...');

    const res = await fetch(url);
    if (res.status !== 200) return;
    if (lastState === 'AVAILABLE') return;

    lastState = 'AVAILABLE';
    const msg = `${hour} \nSistema de citas DISPONIBLE. 🟢 \n${url}`;

    bot.sendMessage(process.env.CHANNEL_ID as any, msg);
    console.log(msg);
  } catch (e) {
    console.log('Handling error...');

    if (lastState === 'UNAVAILABLE') return;
    lastState = 'UNAVAILABLE';
    const msg = `${hour} \nSistema de citas NO disponible. 🔴 \n${url}`;

    bot.sendMessage(process.env.CHANNEL_ID as any, msg);
    console.log(msg);
  }
});
