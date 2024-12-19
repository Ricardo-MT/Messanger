const setupDevice = () => {
  const userAgent = window.navigator.userAgent;
  const device: Record<string, boolean> = {
    Mobile:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ),
    Tablet: /iPad/i.test(userAgent),
    Desktop:
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ),
    Android: /Android/i.test(userAgent),
    iOS: /iPhone|iPad|iPod/i.test(userAgent),
  };
  Object.keys(device).forEach((key) => {
    if (device[key]) {
      document.body.classList.add(key);
    }
  });
};

setupDevice();
