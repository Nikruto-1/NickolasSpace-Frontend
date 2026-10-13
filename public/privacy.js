const button = document.getElementById("clear-language");
const status = document.getElementById("storage-status");
if (button && status) {
  button.hidden = false;
  button.addEventListener("click", () => {
    try {
      window.localStorage.removeItem("nickolas-language");
      status.textContent = status.dataset.cleared;
    } catch {
      status.textContent = status.dataset.error;
    }
  });
}
