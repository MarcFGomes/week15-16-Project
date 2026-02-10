async function postJSON(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

const loginFormHandler = async (event) => {
  event.preventDefault();
  const email = document.querySelector("#email-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();
  const msg = document.querySelector("#login-msg");
  msg.textContent = "";

  if (email && password) {
    const response = await postJSON("/api/users/login", { email, password });
    if (response.ok) {
      document.location.replace("/");
    } else {
      const data = await response.json().catch(() => ({}));
      msg.textContent = data.message || "Login failed.";
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();
  const name = document.querySelector("#name-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();
  const msg = document.querySelector("#signup-msg");
  msg.textContent = "";

  if (name && email && password) {
    const response = await postJSON("/api/users", { name, email, password });
    if (response.ok) {
      document.location.replace("/");
    } else {
      const data = await response.json().catch(() => ({}));
      msg.textContent = data.message || "Signup failed.";
    }
  }
};

document
  .querySelector(".login-form")
  .addEventListener("submit", loginFormHandler);
document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler);