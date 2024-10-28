// db.mjs
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node'; // Import JSONFile from 'lowdb/node'

// Initialize the database file
const defaultData = { sessions: {} };
const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

// Read data from JSON file, this will set db.data content
await db.read();

export default db;
