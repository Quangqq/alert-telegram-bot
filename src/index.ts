import * as dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot/bot';
import cron from 'node-cron';

let lastState: 'AVAILABLE' | 'UNAVAILABLE' = 'UNAVAILABLE';

cron.schedule('* * * * *', async () => {
  const url = process.env.WEB_URL || '';
  const hour = new Date().toISOString();

  try {
    const res = await fetch(url);
    if (res.status !== 200) return;
    if (lastState !== 'UNAVAILABLE') return;

    lastState = 'AVAILABLE';
    bot.sendMessage(
      process.env.CHANNEL_ID as any,
      `${hour} \nSistema de citas DISPONIBLE. 🟢 \n${url}`,
    );
  } catch (e) {
    if (lastState === 'UNAVAILABLE') return;
    lastState = 'UNAVAILABLE';
    bot.sendMessage(
      process.env.CHANNEL_ID as any,
      `${hour} \nSistema de citas NO disponible. 🔴 \n${url}`,
    );
  }
});
