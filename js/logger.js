async function logAction(userId, action, metadata = {}) {
    try {
        await db.collection("logs").add({
            userId: userId,
            action: action,
            metadata: metadata,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Logging failed:", error);
    }
}
