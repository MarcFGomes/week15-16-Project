const form = document.querySelector("#inventory-form");
const msg = document.querySelector("#inv-msg");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    const salon_id = Number(document.querySelector("#salon_id").value);
    const product_id = Number(document.querySelector("#product_id").value);
    const quantity = Number(document.querySelector("#quantity").value);

    if (!salon_id || !product_id || Number.isNaN(quantity) || quantity < 0) {
      msg.textContent = "Please select a salon, a product, and a valid quantity.";
      return;
    }

    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salon_id, product_id, quantity }),
    });

    if (res.ok) {
      alert("Inventory updated");
      document.location.replace("/inventory");
    } else {
      const data = await res.json().catch(() => ({}));
      msg.textContent = data.message || "Failed to save inventory.";
    }
  });
}