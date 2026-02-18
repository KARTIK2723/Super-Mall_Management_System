// Add Category
async function addCategory() {
    const name = document.getElementById("categoryName").value;

    if (!name) {
        alert("Category name required");
        return;
    }

    try {
        const user = auth.currentUser;

        await db.collection("categories").add({
            name: name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await logAction(user.uid, "Category Added", { name: name });

        alert("Category Added Successfully");
        document.getElementById("categoryName").value = "";
        loadCategories();

    } catch (error) {
        alert(error.message);
    }
}


// Load Categories
function loadCategories() {

    db.collection("categories")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {

          const list = document.getElementById("categoryList");
            list.innerHTML = "";

            snapshot.forEach(doc => {
                const data = doc.data();

                const div = document.createElement("div");
                div.className = "category-item";

                div.innerHTML = `
                    <div class="category-name">${data.name}</div>
                    <button class="danger-btn" onclick="deleteCategory('${doc.id}')">
                        Delete
                    </button>
                `;

                list.appendChild(div);
            });


      });
}


// Delete Category
async function deleteCategory(id) {
    try {
        const user = auth.currentUser;

        await db.collection("categories").doc(id).delete();

        await logAction(user.uid, "Category Deleted", { categoryId: id });

        loadCategories();

    } catch (error) {
        alert(error.message);
    }
}
