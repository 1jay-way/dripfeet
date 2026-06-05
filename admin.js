// =========================
// 🔥 FIREBASE SETUP
// =========================
const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_PROJECT.firebaseapp.com",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_PROJECT.appspot.com",
   messagingSenderId: "XXXX",
   appId: "XXXX"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


// =========================
// 🔐 SECURE ADMIN CHECK
// =========================
// =========================
// 🚀 ON PAGE LOAD
// =========================
window.onload = function () {
   displayAdminProducts();
};


// =========================
// ➕ ADD PRODUCT (FIREBASE)
// =========================
function addProduct() {
   const name = document.getElementById("name").value.trim();
   const price = document.getElementById("price").value.trim();
   const imageInput = document.getElementById("image");

   if (!name || !price || !imageInput.files[0]) {
      alert("Please fill all fields!");
      return;
   }

   const reader = new FileReader();

   reader.onload = function (e) {

      db.collection("products").add({
         name: name,
         price: Number(price),
         image: e.target.result, // base64 image (simple version)
         sizes: ["38", "39", "40", "41"],
         description: "No description yet",
         createdAt: Date.now()
      })
      .then(() => {
         clearForm();
         alert("Product added successfully!");
         displayAdminProducts();
      })
      .catch(err => {
         console.error(err);
         alert("Error adding product");
      });

   };

   reader.readAsDataURL(imageInput.files[0]);
}


// =========================
// 🧹 CLEAR FORM
// =========================
function clearForm() {
   document.getElementById("name").value = "";
   document.getElementById("price").value = "";
   document.getElementById("image").value = "";
}


// =========================
// 📦 LOAD PRODUCTS (REAL TIME)
// =========================
function loadProducts(callback) {
   db.collection("products").onSnapshot(snapshot => {

      const products = [];

      snapshot.forEach(doc => {
         products.push({ id: doc.id, ...doc.data() });
      });

      callback(products);

   });
}


// =========================
// 🖼 DISPLAY PRODUCTS (ADMIN)
// =========================
function displayAdminProducts() {

   loadProducts(function (products) {

      const container = document.getElementById("admin-products");
      container.innerHTML = "";

      if (products.length === 0) {
         container.innerHTML = "<p style='text-align:center;'>No products yet</p>";
         return;
      }

      products.forEach(p => {

         const div = document.createElement("div");
         div.className = "product";

         div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>

            <small>${p.description || ""}</small>

            <div style="margin-top:8px;">
               ${(p.sizes || []).map(size => `
                  <span style="padding:3px 8px;border:1px solid #667eea;margin:2px;border-radius:5px;font-size:12px;">
                     ${size}
                  </span>
               `).join("")}
            </div>

            <button onclick="editProduct('${p.id}')" class="auth-btn">Edit</button>

            <button onclick="deleteProduct('${p.id}')"
               style="background:red;color:white;padding:8px;border:none;border-radius:6px;margin-top:5px;">
               Delete
            </button>
         `;

         container.appendChild(div);
      });

   });
}


// =========================
// 🗑 DELETE PRODUCT
// =========================
function deleteProduct(id) {
   db.collection("products").doc(id).delete()
      .then(() => {
         displayAdminProducts();
      })
      .catch(err => console.error(err));
}


// =========================
// ✏ EDIT PRODUCT
// =========================
function editProduct(id) {

   const newName = prompt("Enter new name:");
   const newPrice = prompt("Enter new price:");
   const newDesc = prompt("Enter description:");

   if (!newName || !newPrice) return;

   db.collection("products").doc(id).update({
      name: newName,
      price: Number(newPrice),
      description: newDesc || ""
   })
   .then(() => {
      displayAdminProducts();
   })
   .catch(err => console.error(err));
}


