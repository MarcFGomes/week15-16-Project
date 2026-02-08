document
  .querySelector("#new-product-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      name: document.querySelector("#name").value.trim(),
      barcode: document.querySelector("#barcode").value.trim() || null,
      category: document.querySelector("#category").value.trim() || null,
      unit: document.querySelector("#unit").value.trim() || null,
      reorder_level: Number(document.querySelector("#reorder_level").value) || 0,
      target_level: Number(document.querySelector("#target_level").value) || 0,
    };

    if (!body.name || !body.barcode || !body.category || !body.unit || !body.reorder_level || !body.target_level) {
      alert("All fields are required.");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      document.location.replace("/products");
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Failed to create product.");
    }
  });