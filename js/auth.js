// ================= REGISTER FUNCTION =================
async function register() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
        alert("Please fill all fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    try {

        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await db.collection("users").doc(user.uid).set({
            name,
            email,
            role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Registration Successful!");
        window.location.href = "login.html";

    } catch (error) {
        alert(error.message);
    }
}


// ================= LOGIN FUNCTION =================
async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        const doc = await db.collection("users").doc(user.uid).get();
        const role = doc.data().role;

        if (role === "admin") {
            window.location.href = "admin.html";         // inside pages
        }
        else if (role === "merchant") {
            window.location.href = "merchant.html";      // inside pages
        }
        else {
            window.location.href = "../index.html";      // go back to root
        }

    } catch (error) {
        alert("Invalid email or password");
    }
}



// ================= LOGOUT FUNCTION =================
function logout() {
    auth.signOut().then(() => {
        window.location.href = "../index.html";
    });
}
