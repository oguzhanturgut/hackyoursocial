const swReg = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
      console.log('Service worker registered!');
    } catch (error) {
      console.error(error);
    }
  }
};

swReg();
