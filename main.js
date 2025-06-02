setTimeout(() => {
  const main = document.getElementById("main");
  main.style.visibility = "visible";
  main.style.animation = "fadeIn 1s ease-in-out forwards";

  const loader = document.getElementById("loader");
  loader.style.display = "none";

  document.body.classList.add("show-background");
}, 2000);

const wheel = document.getElementById("wheel");
const button = document.getElementById("spinBtn");
const message = document.getElementById("message");
const closeMsg = document.getElementById("closeMsg");

const SIX_HOURS = 6 * 60 * 60 * 1000;
const LAST_SPIN_KEY = "lastSpinTime";
let currentRotation = 0;

function puedeGirar() {
  const lastSpin = localStorage.getItem(LAST_SPIN_KEY);
  if (!lastSpin) return true;
  return Date.now() - parseInt(lastSpin) > SIX_HOURS;
}

button.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();

  if (username === "" || email === "") {
    alert("Por favor, ingresa tu nombre de usuario y correo electrónico.");
    return;
  }

  if (!puedeGirar()) {
    alert("Solo puedes girar una vez cada 6 horas. Intenta más tarde.");
    return;
  }

  const opciones = [45, 135];
  const gradosExtra = opciones[Math.floor(Math.random() * opciones.length)];
  const vueltas = 10;
  const totalGrados = vueltas * 360 + gradosExtra;

  currentRotation = totalGrados;
  wheel.style.transform = `rotate(${currentRotation}deg)`;
  localStorage.setItem(LAST_SPIN_KEY, Date.now().toString());

  // Enviar datos a PHP para registrar
  fetch("registrar.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(
      email
    )}`,
  });

  wheel.addEventListener("transitionend", mostrarMensaje, { once: true });
});

function mostrarMensaje() {
  message.style.display = "block";
}

closeMsg.addEventListener("click", () => {
  message.style.display = "none";
});
