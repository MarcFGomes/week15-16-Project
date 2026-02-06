const logout = async () => {
  const response = await fetch("/api/users/logout", { method: "POST" });
  if (response.ok) document.location.replace("/");
};

const btn = document.querySelector("#logout");
if (btn) btn.addEventListener("click", logout);
