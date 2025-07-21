const logger = {
  log: (msg: string, ...args: any[]) => {
    console.log(`[LOG] ${msg}`, ...args);
  },

  error: (msg: string, ...args: any[]) => {
    console.error(`[ERROR] ${msg}`, ...args);
  },
};

export default logger;
