// Load categories into dropdown
function loadCategoryDropdown() {
    const select = document.getElementById("shopCategory");
    select.innerHTML = "<option value=''>Select Category</option>";

    db.collection("categories").get().then(snapshot => {
        snapshot.forEach(doc => {
            select.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`;
        });
    });
}


// Load floors into dropdown
function loadFloorDropdown() {
    const select = document.getElementById("shopFloor");
    select.innerHTML = "<option value=''>Select Floor</option>";

    db.collection("floors").get().then(snapshot => {
        snapshot.forEach(doc => {
            select.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`;
        });
    });
}


// Create shop
async function createShop() {
    const name = document.getElementById("shopName").value;
    const categoryId = document.getElementById("shopCategory").value;
    const floorId = document.getElementById("shopFloor").value;
    const description = document.getElementById("shopDescription").value;

    if (!name || !categoryId || !floorId) {
        alert("All fields required");
        return;
    }

    try {
        const user = auth.currentUser;

        await db.collection("shops").add({
            name,
            categoryId,
            floorId,
            description,
            ownerId: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await logAction(user.uid, "Shop Created", { name });

        alert("Shop Created Successfully");

        loadMerchantShops();

    } catch (error) {
        alert(error.message);
    }
}


// Load merchant shops
function loadMerchantShops() {
    const user = auth.currentUser;

    db.collection("shops")
      .where("ownerId", "==", user.uid)
      .onSnapshot(snapshot => {

        const list = document.getElementById("shopList");
        list.innerHTML = "";

        snapshot.forEach(doc => {
            const li = document.createElement("li");
            li.innerText = doc.data().name;
            list.appendChild(li);
        });

    });
}
