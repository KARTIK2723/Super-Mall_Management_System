// ================= LOAD PRODUCTS INTO OFFER DROPDOWN =================
function loadOfferProductDropdown() {

    const selectedShopId = document.getElementById("productShop").value;
    const select = document.getElementById("offerProduct");

    select.innerHTML = "<option value=''>Select Product</option>";

    if (!selectedShopId) return;

    db.collection("products")
      .where("shopId", "==", selectedShopId)
      .get()
      .then(snapshot => {
          snapshot.forEach(doc => {
              select.innerHTML += `
                  <option value="${doc.id}">
                      ${doc.data().name}
                  </option>
              `;
          });
      });
}



// ================= ADD OFFER =================
async function addOffer() {

    const productId = document.getElementById("offerProduct").value;
    const discount = document.getElementById("discountPercent").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!productId || !discount || !startDate || !endDate) {
        alert("All fields required");
        return;
    }

    try {

        const user = auth.currentUser;

        await db.collection("offers").add({
            productId,
            discountPercentage: Number(discount),
            startDate,
            endDate,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await logAction(user.uid, "Offer Added", { productId });

        alert("Offer Added Successfully");

        loadMerchantOffers();

    } catch (error) {
        alert(error.message);
    }
}



// ================= LOAD OFFERS FOR SELECTED SHOP =================
function loadMerchantOffers() {

    const selectedShopId = document.getElementById("productShop").value;

    if (!selectedShopId) {
        document.getElementById("offerList").innerHTML = "";
        return;
    }

    db.collection("products")
      .where("shopId", "==", selectedShopId)
      .get()
      .then(snapshot => {

          const productIds = [];
          snapshot.forEach(doc => productIds.push(doc.id));

          if (!productIds.length) {
              document.getElementById("offerList").innerHTML = "";
              return;
          }

          db.collection("offers")
            .where("productId", "in", productIds)
            .onSnapshot(offerSnap => {

                const list = document.getElementById("offerList");
                list.innerHTML = "";

                offerSnap.forEach(doc => {
                    const data = doc.data();

                    const li = document.createElement("li");
                    li.innerHTML = `
                        ${data.discountPercentage}% off
                        <button onclick="deleteOffer('${doc.id}')">
                            Delete
                        </button>
                    `;
                    list.appendChild(li);
                });

            });

      });
}



// ================= DELETE OFFER =================
async function deleteOffer(id) {

    const user = auth.currentUser;

    await db.collection("offers").doc(id).delete();

    await logAction(user.uid, "Offer Deleted", { offerId: id });
}
