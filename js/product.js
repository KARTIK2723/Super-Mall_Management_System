// ================= LOAD SHOP DROPDOWN =================
function loadShopDropdown() {

    const user = auth.currentUser;
    const select = document.getElementById("productShop");

    select.innerHTML = "<option value=''>Select Shop</option>";

    db.collection("shops")
      .where("ownerId", "==", user.uid)
      .get()
      .then(snapshot => {

          let firstShopId = null;

          snapshot.forEach(doc => {
              if (!firstShopId) firstShopId = doc.id;

              select.innerHTML += `<option value="${doc.id}">
                                      ${doc.data().name}
                                   </option>`;
          });

          // Auto-select first shop and load products
          if (firstShopId) {
              select.value = firstShopId;
              loadMerchantProducts();
          }
      });
}



// ================= ADD PRODUCT =================
async function addProduct() {

    const shopId = document.getElementById("productShop").value;
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const features = document.getElementById("productFeatures").value;

    if (!shopId || !name || !price) {
        alert("All required fields missing");
        return;
    }

    try {

        const user = auth.currentUser;

        await db.collection("products").add({
            shopId,
            name,
            price: Number(price),
            features,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await logAction(user.uid, "Product Added", { name });

        alert("Product Added Successfully");

        loadMerchantProducts();

    } catch (error) {
        alert(error.message);
    }
}



// ================= LOAD PRODUCTS FOR SELECTED SHOP =================
function loadMerchantProducts() {

    const selectedShopId = document.getElementById("productShop").value;

    if (!selectedShopId) {
        document.getElementById("productList").innerHTML = "";
        return;
    }

    db.collection("products")
      .where("shopId", "==", selectedShopId)
      .onSnapshot(snapshot => {

          const list = document.getElementById("productList");
          list.innerHTML = "";

          snapshot.forEach(doc => {
              const li = document.createElement("li");
              li.innerHTML = `
                  ${doc.data().name} - ₹${doc.data().price}
                  <button onclick="deleteProduct('${doc.id}')">Delete</button>
              `;
              list.appendChild(li);
          });
        // 🔥 update offers when shop changes
          loadOfferProductDropdown();
          loadMerchantOffers();


      });
}



// ================= DELETE PRODUCT =================
async function deleteProduct(id) {

    const user = auth.currentUser;

    await db.collection("products").doc(id).delete();

    await logAction(user.uid, "Product Deleted", { productId: id });
}
