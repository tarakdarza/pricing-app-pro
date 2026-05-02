const API_URL = "http://localhost:7000";

// -------------------------
// MESSAGE UI
// -------------------------
function showMessage(msg, isError = false) {
  const el = document.getElementById("message");
  el.textContent = msg;
  el.style.color = isError ? "red" : "green";
}

// -------------------------
// LOAD PRODUCTS
// -------------------------
async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();

  const select = document.getElementById("productSelect");
  select.innerHTML = "";

  products.forEach(p => {
    const option = document.createElement("option");
    option.value = p.PRODUCT_ID;
    option.textContent = `${p.NAME} - ${p.BASE_PRICE} ${p.CURRENCY}`;
    select.appendChild(option);
  });
}

// -------------------------
// LOAD SELECTED PRODUCT
// -------------------------
async function loadSelectedProduct() {
  const id = document.getElementById("productSelect").value;

  const res = await fetch(`${API_URL}/products/${id}`);
  const data = await res.json();

  if (!res.ok) {
    showMessage(data.error, true);
    return;
  }

  document.getElementById("editId").value = data.PRODUCT_ID;
  document.getElementById("editName").value = data.NAME;
  document.getElementById("editPrice").value = data.BASE_PRICE;
  document.getElementById("editCurrency").value = data.CURRENCY;

  showMessage("Produit chargé");
}

// -------------------------
// ADD PRODUCT
// -------------------------
async function addProduct() {
  const productId = document.getElementById("newId").value;
  const name = document.getElementById("newName").value;
  const basePrice = Number(document.getElementById("newPrice").value);
  const currency = document.getElementById("newCurrency").value;

  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, name, basePrice, currency })
  });

  const data = await res.json();

  if (!res.ok) {
    showMessage(data.error, true);
    return;
  }

  showMessage("Produit ajouté !");
  loadProducts();
}

// -------------------------
// UPDATE PRODUCT
// -------------------------
async function updateProduct() {
  const productId = document.getElementById("editId").value;
  const name = document.getElementById("editName").value;
  const basePrice = Number(document.getElementById("editPrice").value);
  const currency = document.getElementById("editCurrency").value;

  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, basePrice, currency })
  });

  const data = await res.json();

  if (!res.ok) {
    showMessage(data.error, true);
    return;
  }

  showMessage("Produit modifié !");
  loadProducts();
}

// -------------------------
// DELETE PRODUCT
// -------------------------
async function deleteProduct() {
  const productId = document.getElementById("productSelect").value;

  if (!confirm("Supprimer ce produit ?")) return;

  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (!res.ok) {
    showMessage(data.error, true);
    return;
  }

  showMessage("Produit supprimé !");
  loadProducts();
}

// -------------------------
// CALCULATE PRICE
// -------------------------
async function calculatePrice() {
  const productId = document.getElementById("productSelect").value;
  const quantity = Number(document.getElementById("quantity").value);
  const promotion = Number(document.getElementById("promotion").value);
  const tax = Number(document.getElementById("tax").value);

  const res = await fetch(`${API_URL}/calculate-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId,
      quantity,
      promotion: { value: promotion },
      tax: { rate: tax }
    })
  });

  const data = await res.json();

  if (!res.ok) {
    showMessage(data.error, true);
    return;
  }

  document.getElementById("result").innerHTML = `
    <b>Produit :</b> ${data.name}<br>
    <b>Prix final :</b> ${data.finalPrice} ${data.currency}
  `;
}

// -------------------------
// INIT
// -------------------------
loadProducts();