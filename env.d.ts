declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHANNEL_ID: string;
      BOT_TOKEN: string;
      WEB_URL: string;
    }
  }
}

export {};
