(async () => {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { server } = await import('./browser');
    server.start();
  }
})();

export {};
