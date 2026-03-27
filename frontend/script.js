let sent = 0;
let newCount = 0;
let cachedCount = 0;

function generateKey() {
  document.getElementById("key").value = crypto.randomUUID();
}

async function pay() {
  const btn = document.getElementById("payBtn");
  const key = document.getElementById("key").value;
  const amount = document.getElementById("amount").value;

  btn.disabled = true; // 🔥 important

  for (let i = 0; i < 1; i++) {
    sendRequest(key, amount);
  }

  setTimeout(() => {
    btn.disabled = false;
  }, 4000);
}

async function sendRequest(key, amount) {
  sent++;
  update();

  const res = await fetch("http://localhost:3000/api/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": key
    },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  if (data.type === "NEW") {
    newCount++;
    log("✔ Processed", "new");
  } else if (data.type === "CACHED") {
    cachedCount++;
    log("✔ Cached (Duplicate Blocked)", "cached");
  } else {
    log("⏳ Processing...");
  }

  update();
}

function update() {
  document.getElementById("sent").innerText = sent;
  document.getElementById("new").innerText = newCount;
  document.getElementById("cached").innerText = cachedCount;
}

function log(msg, cls) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.className = cls;
  document.getElementById("log").appendChild(div);
}