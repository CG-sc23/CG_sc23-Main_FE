(async () => {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen({ onUnhandledRequest: 'bypass' });
  } else {
    const { server } = await import('./browser');
    // server.start({ onUnhandledRequest: 'bypass' });
  }
})();

export {};
