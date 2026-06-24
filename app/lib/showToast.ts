export const showToast = (msg: string) =>
  window.dispatchEvent(new CustomEvent("show-toast", { detail: msg }));
