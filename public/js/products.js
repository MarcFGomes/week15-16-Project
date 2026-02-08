document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".js-delete-product");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  const ok = confirm("Delete this product?");
  if (!ok) return;

  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

  if (res.ok) {
    // remove the LI from the page immediately
    const li = document.querySelector(`[data-product-id="${id}"]`);
    if (li) li.remove();
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data.message || "Failed to delete product.");
  }
});