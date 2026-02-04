const ORDER_NUMBER = "443-467-8955";

function copyNumber() {
  navigator.clipboard.writeText(ORDER_NUMBER)
    .then(() => alert("Copied: " + ORDER_NUMBER))
    .catch(() => alert("Copy failed — number is: " + ORDER_NUMBER));
}

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("copyNumberBtn")?.addEventListener("click", copyNumber);
document.getElementById("copyNumberBtn2")?.addEventListener("click", copyNumber);

// Click "Order This" buttons -> auto-fill form + jump to contact
document.querySelectorAll(".add").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.getAttribute("data-item") || "";
    const itemInput = document.getElementById("item");
    if (itemInput) itemInput.value = item;
    location.hash = "#contact";
  });
});

// Generate a ready-to-send text message
document.getElementById("orderForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const item = document.getElementById("item").value.trim();
  const size = document.getElementById("size").value.trim();
  const color = document.getElementById("color").value.trim();
  const notes = document.getElementById("notes").value.trim();

  const msg =
    `LOYAL NATION ORDER%0A` +
    `Item: ${item || "—"}%0A` +
    `Size: ${size || "—"}%0A` +
    `Color: ${color || "—"}%0A` +
    `Notes: ${notes || "—"}`;

  const out = document.getElementById("msgOut");
  out.textContent = "Message generated — tap to open SMS.";

  // Opens Messages app on iPhone/iPad
  window.location.href = `sms:4434678955&body=${msg}`;
});
