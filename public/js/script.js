globalThis.onload = () => {
  setTimeout(async () => {
    const response = await fetch("/login/redirect-login");
    globalThis.location.href = response.url;
  }, 2000);
};
