globalThis.onload = () => {
  setTimeout(async () => {
    const response = await fetch("/login/redirect-login");
    globalThis.location.href = await response.url;
  }, 5000);
};
