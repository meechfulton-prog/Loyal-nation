const phoneNumber = "443-467-8955";

function copyNumber() {
  navigator.clipboard.writeText(phoneNumber).then(() => {
    alert("Phone number copied: " + phoneNumber);
  });
}

const copyBtn1 = document.getElementById("copyNumberBtn");
const copyBtn2 = document.getElementById("copyNumberBtn2");

if (copyBtn1) copyBtn1.addEventListener("click", copyNumber);
if (copyBtn2) copyBtn2.addEventListener("click", copyNumber);

document.querySelectorAll(".add").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.dataset.item || "Loyal Nation item";
    const smsMessage = `Hi, I want to order: ${item}`;
    window.location.href = `sms:4434678955?body=${encodeURIComponent(smsMessage)}`;
  });
});

const orderForm = document.getElementById("orderForm");
const msgOut = document.getElementById("msgOut");

if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const item = document.getElementById("item").value.trim();
    const size = document.getElementById("size").value.trim();
    const color = document.getElementById("color").value.trim();
    const notes = document.getElementById("notes").value.trim();

    const message = `Hi, I want to order from Loyal Nation.%0AItem: ${item || "-"}%0ASize: ${size || "-"}%0AColor: ${color || "-"}%0ANotes: ${notes || "-"}`;

    msgOut.innerHTML = `<a href="sms:4434678955?body=${message}">Tap here to open your text message</a>`;
  });
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
