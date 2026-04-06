globalThis.onload = () => {
  setTimeout(async () => {
    const response = await fetch("/redirect-login");
    globalThis.location.href = await response.url;
  }, 3000);
};
