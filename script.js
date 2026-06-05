// =========================
// 🛍️ PRODUCTS
// =========================
let products = JSON.parse(localStorage.getItem("products")) || [
   {
      id: 1,
      name: "Sneakers",
      price: 25000,
      image: "https://via.placeholder.com/200",
      sizes: ["38", "39", "40"],
      description: "Comfortable sneakers"
   },
   {
      id: 2,
      name: "Bag",
      price: 40000,
      image: "https://via.placeholder.com/200",
      sizes: ["Free Size"],
      description: "Stylish bag"
   }
];

// =========================
// 🛒 CART
// =========================
let cart = [];

// =========================
// 📦 DISPLAY PRODUCTS
// =========================
function displayProducts() {
   const container = document.getElementById("products-container");
   if (!container) return;

   container.innerHTML = "";

   products.forEach(p => {
      container.innerHTML += `
         <div class="product">
            <img src="${p.image}" alt="${p.name}">

            <h3>${p.name}</h3>
            <p>₦${p.price}</p>

            <small>${p.description || ""}</small>

            <div style="margin:8px 0;">
               ${(p.sizes || []).map(size => `
                  <span style="padding:3px 8px;border:1px solid #667eea;margin:2px;border-radius:5px;font-size:12px;">
                     ${size}
                  </span>
               `).join("")}
            </div>

            <button onclick="addToCart(${p.id})">Add to Cart</button>
            <button onclick="buyNow(${p.id})" class="buy-btn">Buy Now</button>
         </div>
      `;
   });
}

// =========================
// ➕ ADD TO CART
// =========================
function addToCart(id) {
   const product = products.find(p => p.id === id);
   const existing = cart.find(item => item.id === id);

   if (existing) {
      existing.quantity++;
   } else {
      cart.push({ ...product, quantity: 1 });
   }

   updateCart();
}

// =========================
// 🛒 UPDATE CART
// =========================
function updateCart() {
   displayCart();
   updateTotal();
   updateCount();
}

// =========================
// 📄 DISPLAY CART
// =========================
function displayCart() {
   const cartItems = document.getElementById("cart-items");
   if (!cartItems) return;

   if (cart.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty</p>";
      return;
   }

   cartItems.innerHTML = "";

   cart.forEach(item => {
      cartItems.innerHTML += `
         <div class="cart-item">
            <h4>${item.name}</h4>
            <p>₦${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
         </div>
      `;
   });
}

// =========================
// ❌ REMOVE ITEM
// =========================
function removeFromCart(id) {
   cart = cart.filter(item => item.id !== id);
   updateCart();
}

// =========================
// 🧹 CLEAR CART
// =========================
function clearCart() {
   cart = [];
   updateCart();
}

// =========================
// 💰 TOTAL
// =========================
function updateTotal() {
   const totalEl = document.getElementById("total");

   let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

   if (totalEl) totalEl.innerText = total.toLocaleString();
}

// =========================
// 🔢 COUNT
// =========================
function updateCount() {
   const countEl = document.getElementById("cart-count");

   let count = cart.reduce((sum, item) => sum + item.quantity, 0);

   if (countEl) countEl.innerText = count;
}

// =========================
// 🛍️ BUY NOW
// =========================
function buyNow(id) {
   const product = products.find(p => p.id === id);
   if (!product) return;

   let message = `Hello, I want to buy:\n\n`;
   message += `Product: ${product.name}\n`;
   message += `Price: ₦${product.price}\n`;
   message += `Description: ${product.description || ""}\n`;

   const phone = "2349132753158";
   const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

   window.open(url, "_blank");
}

// =========================
// 🛒 TOGGLE CART
// =========================
function toggleCart() {
   const cartBox = document.getElementById("cart");
   if (!cartBox) return;

   cartBox.classList.toggle("active");
}

// =========================
// 📲 WHATSAPP CHECKOUT
// =========================
function checkoutWhatsApp() {
   if (cart.length === 0) {
      alert("Cart is empty!");
      return;
   }

   let message = "Hello, I want to order:\n\n";

   cart.forEach(item => {
      message += `${item.name} x ${item.quantity} = ₦${item.price * item.quantity}\n`;
   });

   let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
   message += `\nTotal: ₦${total}`;

   const phone = "2349132753158";
   const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

   window.open(url, "_blank");
}

// =========================
// 🚀 INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
   displayProducts();
   updateCart();
});
