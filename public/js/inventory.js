document.addEventListener("click", async (event) => {
  const btn = event.target.closest(".js-delete-inventory");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  const ok = confirm("Delete this inventory record?");
  if (!ok) return;

  const response = await fetch(`/api/inventory/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    document.location.reload()
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data.message || "Failed to delete inventory record.");
  }
});