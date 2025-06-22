function getAuth() {
  return { headers: { "x-auth-cust": localStorage.getItem("tokenCust") || "" } };
}

function loadAnnouncement() {
  fetch("/api/announcement")
    .then((r) => r.json())
    .then((d) => {
      document.getElementById("announcement").innerText = d.text;
    });
}

function loadProducts() {
  fetch("/api/products")
    .then((r) => r.json())
    .then((products) => {
      const recommended = products.filter((p) => p.recommended);
      const others = products.filter((p) => !p.recommended);

      const recEl = document.getElementById("recommended");
      const listEl = document.getElementById("product-list");

      recEl.innerHTML = recommended.map((p) => `
        <div style="border:1px solid #ccc; padding:10px; width:150px; border-radius:5px;">
          <h4>${p.name}</h4>
          <p>ราคา: ${p.price} บาท</p>
          <button onclick="buyProduct(${p.id})">ซื้อ</button>
        </div>`).join("");

      listEl.innerHTML = others.map((p) => `
        <div style="border:1px solid #ccc; padding:10px; width:150px; border-radius:5px;">
          <h4>${p.name}</h4>
          <p>ราคา: ${p.price} บาท</p>
          <button onclick="buyProduct(${p.id})">ซื้อ</button>
        </div>`).join("");
    });
}

function buyProduct(id) {
  if (!confirm("ยืนยันการซื้อสินค้านี้หรือไม่?")) return;
  fetch("/api/buy", {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuth().headers),
    body: JSON.stringify({ productId: id }),
  })
    .then((r) => r.json())
    .then((d) => {
      if (d.success) {
        alert("ซื้อสินค้าเรียบร้อย!\nข้อมูล: " + d.file);
      } else {
        alert("ผิดพลาด: " + d.error);
      }
    });
}

function topup() {
  const slip = document.getElementById("slip").value.trim();
  const amount = Number(document.getElementById("amount").value.trim());
  if (!slip || !amount) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }
  fetch("/api/topup", {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuth().headers),
    body: JSON.stringify({ slip, amount }),
  })
    .then((r) => r.json())
    .then((d) => {
      if (d.success) {
        alert("เติมเงินสำเร็จ");
        document.getElementById("slip").value = "";
        document.getElementById("amount").value = "";
      } else {
        alert("ผิดพลาด: " + d.error);
      }
    });
}

function logout() {
  localStorage.removeItem("tokenCust");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("tokenCust")) {
    window.location.href = "login.html";
    return;
  }
  loadAnnouncement();
  loadProducts();
});