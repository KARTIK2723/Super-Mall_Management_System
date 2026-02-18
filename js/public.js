// Load category & floor filters
function loadFilterDropdowns() {
    const catSelect = document.getElementById("filterCategory");
    const floorSelect = document.getElementById("filterFloor");

    catSelect.innerHTML = "<option value=''>All Categories</option>";
    floorSelect.innerHTML = "<option value=''>All Floors</option>";

    db.collection("categories").get().then(snapshot => {
        snapshot.forEach(doc => {
            catSelect.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`;
        });
    });

    db.collection("floors").get().then(snapshot => {
        snapshot.forEach(doc => {
            floorSelect.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`;
        });
    });
}


// Load shops with filter
function loadShops() {
    const categoryId = document.getElementById("filterCategory").value;
    const floorId = document.getElementById("filterFloor").value;

    let query = db.collection("shops");

    if (categoryId) {
        query = query.where("categoryId", "==", categoryId);
    }

    if (floorId) {
        query = query.where("floorId", "==", floorId);
    }

    query.get().then(snapshot => {

        const list = document.getElementById("publicShopList");
        list.innerHTML = "";

        snapshot.forEach(doc => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${doc.data().name}
                <button onclick="loadProducts('${doc.id}')">View Products</button>
            `;
            list.appendChild(li);
        });

    });
}


// Load products of selected shop
function loadProducts(shopId) {
    db.collection("products")
      .where("shopId", "==", shopId)
      .get()
      .then(snapshot => {

          const list = document.getElementById("publicProductList");
          list.innerHTML = "";

          snapshot.forEach(doc => {
              const data = doc.data();
              list.innerHTML += `
                  <li>
                      ${data.name} - ₹${data.price}
                      <button onclick="checkOffer('${doc.id}', ${data.price})">
                          Check Offer
                      </button>
                  </li>
              `;
          });

      });
}


// Check offer
function checkOffer(productId, price) {

    const today = new Date();

    db.collection("offers")
      .where("productId", "==", productId)
      .get()
      .then(snapshot => {

          if (snapshot.empty) {
              alert("No offer available");
              return;
          }

          let activeOfferFound = false;

          snapshot.forEach(doc => {

              const data = doc.data();

              const start = new Date(data.startDate);
              const end = new Date(data.endDate);

              if (today >= start && today <= end) {

                  activeOfferFound = true;

                  const discount = data.discountPercentage;
                  const newPrice = price - (price * discount / 100);

                  alert(`
${discount}% OFF 🎉
Old Price: ₹${price}
New Price: ₹${newPrice}
                  `);
              }

          });

          if (!activeOfferFound) {
              alert("No active offer currently");
          }

      });
}

function loadCompareDropdowns() {

    const select1 = document.getElementById("compareProduct1");
    const select2 = document.getElementById("compareProduct2");

    select1.innerHTML = "<option value=''>Select Product 1</option>";
    select2.innerHTML = "<option value=''>Select Product 2</option>";

    db.collection("products").get().then(snapshot => {
        snapshot.forEach(doc => {
            const name = doc.data().name;
            select1.innerHTML += `<option value="${doc.id}">${name}</option>`;
            select2.innerHTML += `<option value="${doc.id}">${name}</option>`;
        });
    });
}
async function compareProducts() {

    const id1 = document.getElementById("compareProduct1").value;
    const id2 = document.getElementById("compareProduct2").value;

    if (!id1 || !id2) {
        alert("Select both products");
        return;
    }

    if (id1 === id2) {
        alert("Select different products");
        return;
    }

    const doc1 = await db.collection("products").doc(id1).get();
    const doc2 = await db.collection("products").doc(id2).get();

    const p1 = doc1.data();
    const p2 = doc2.data();

    const result1 = await calculateFinalPrice(id1, p1.price);
    const result2 = await calculateFinalPrice(id2, p2.price);

    document.getElementById("comparisonResult").innerHTML = `
        <h3>Comparison Result</h3>
        <table border="1" cellpadding="10">
            <tr>
                <th>Feature</th>
                <th>${p1.name}</th>
                <th>${p2.name}</th>
            </tr>
            <tr>
                <td>Original Price</td>
                <td>₹${p1.price}</td>
                <td>₹${p2.price}</td>
            </tr>
            <tr>
                <td>Active Offer</td>
                <td>${result1.discount}%</td>
                <td>${result2.discount}%</td>
            </tr>
            <tr>
                <td>Final Price</td>
                <td>₹${result1.finalPrice}</td>
                <td>₹${result2.finalPrice}</td>
            </tr>
            <tr>
                <td>Features</td>
                <td>${p1.features}</td>
                <td>${p2.features}</td>
            </tr>
        </table>
    `;
}
async function calculateFinalPrice(productId, price) {

    const today = new Date();
    let discount = 0;

    const snapshot = await db.collection("offers")
        .where("productId", "==", productId)
        .get();

    snapshot.forEach(doc => {

        const data = doc.data();
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        if (today >= start && today <= end) {
            discount = data.discountPercentage;
        }
    });

    const finalPrice = price - (price * discount / 100);

    return {
        discount: discount || "No Offer",
        finalPrice
    };
}
