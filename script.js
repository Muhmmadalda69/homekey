// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBa2YVGT0dQiP3nNt99oS6IENezcg1RsQk",
  authDomain: "homekey-31457.firebaseapp.com",
  databaseURL: "https://homekey-31457-default-rtdb.firebaseio.com/", // PASTIKAN INI ADA!
  projectId: "homekey-31457",
  storageBucket: "homekey-31457.appspot.com",
  messagingSenderId: "649922089814",
  appId: "1:649922089814:web:fe1dee3cbfb5a16f4a7cf7",
  measurementId: "G-S1PBGCMG7H",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Hardcoded username dan password
const hardcodedUsername = "admin";
const hardcodedPassword = "123456";

// Fungsi Login
window.login = function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === hardcodedUsername && password === hardcodedPassword) {
    localStorage.setItem("isLoggedIn", "true");
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    listenPintuStatus(); // Jalankan listener untuk status pintu
  } else {
    document.getElementById("login-error").innerText = "Username atau password salah!";
  }
};

// Fungsi Logout
window.logout = function () {
  localStorage.removeItem("isLoggedIn");
  document.getElementById("login-container").classList.remove("hidden");
  document.getElementById("dashboard").classList.add("hidden");
};

// Ambil referensi status pintu di database
const pintuRef = ref(db, "kontrol/pintu");

// Fungsi untuk mendengarkan perubahan status pintu dari Realtime Database
function listenPintuStatus() {
  onValue(pintuRef, (snapshot) => {
    const status = snapshot.val();
    const statusPintuElement = document.getElementById("status-pintu");
    if (status === "buka") {
      statusPintuElement.style.backgroundColor = "green";
    } else {
      statusPintuElement.style.backgroundColor = "red";
    }
    document.getElementById("status-pintu").innerText = status === "buka" ? "Terbuka" : "Tertutup";
    document.getElementById("togglePintu").checked = status === "buka";
  });
}

// Fungsi untuk mengubah status pintu di Realtime Database
window.togglePintu = function () {
  const toggleState = document.getElementById("togglePintu").checked ? "buka" : "tutup";
  set(pintuRef, toggleState); // Ubah nilai di Firebase
};

// Cek status login saat halaman dimuat
window.onload = function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    listenPintuStatus(); // Jalankan listener status pintu
  }
};
