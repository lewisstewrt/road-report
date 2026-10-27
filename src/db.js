import Dexie from "dexie";

const db = new Dexie("ReportsDatabase");
db.version(1).stores({
    reports: "++id, category, createdAt",
});

export default db