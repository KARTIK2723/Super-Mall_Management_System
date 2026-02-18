// Add Floor
async function addFloor() {
    const name = document.getElementById("floorName").value;

    if (!name) {
        alert("Floor name required");
        return;
    }

    try {
        const user = auth.currentUser;

        await db.collection("floors").add({
            name: name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await logAction(user.uid, "Floor Added", { name: name });

        document.getElementById("floorName").value = "";
        alert("Floor Added Successfully");

    } catch (error) {
        alert(error.message);
    }
}


// Load Floors
function loadFloors() {
    db.collection("floors").onSnapshot(snapshot => {
        const list = document.getElementById("floorList");
        list.innerHTML = "";

        snapshot.forEach(doc => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${doc.data().name}
                <button onclick="deleteFloor('${doc.id}')">Delete</button>
            `;
            list.appendChild(li);
        });
    });
}


// Delete Floor
async function deleteFloor(id) {
    try {
        const user = auth.currentUser;

        await db.collection("floors").doc(id).delete();

        await logAction(user.uid, "Floor Deleted", { floorId: id });

    } catch (error) {
        alert(error.message);
    }
}
