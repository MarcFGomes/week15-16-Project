// Delete project
async function delButtonHandler(event) {
  const btn = event.target.closest(".js-delete-product");



  if (!btn) return;

  const id = btn.dataset.id;

  console.log("Clicked delete. id =", id, "btn =", btn);

  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    document.location.reload(); // refresh profile list
  } else {
    const data = await response.json().catch(() => ({}));
    console.log("Delete error:", data);
    alert(data.message || "Failed to delete project");
  }
}

// Listen for delete clicks (event delegation)
document
  .querySelector(".list-group")
  ?.addEventListener("click", delButtonHandler);