const setupDevice = () => {
  const userAgent = window.navigator.userAgent;
  const device: Record<string, boolean> = {
    mobile:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ),
    tablet: /iPad/i.test(userAgent),
    desktop:
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ),
    android: /Android/i.test(userAgent),
    ios: /iPhone|iPad|iPod/i.test(userAgent),
  };
  Object.keys(device).forEach((key) => {
    if (device[key]) {
      document.body.classList.add(key);
    }
  });
};

setupDevice();
