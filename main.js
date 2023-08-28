const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const connectDb = async () => {
  const db = new sqlite3.Database(
    "./rhymes.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );
  return db;
};

function runAsync(sql, db) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

const createDBFile = async () => {
  fs.writeFile("rhymes.db", "", (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("File was written successfully!");
    }
  });
};

const createDB = async () => {
  const dbPath = path.join(__dirname, "rhymes.db");
  if (!fs.existsSync(dbPath)) {
    try {
      await createDBFile();

      const db = await connectDb();

      await runAsync(
        `CREATE TABLE IF NOT EXISTS lyrics(id INTEGER PRIMARY KEY, sentence TEXT, syllable INTEGER, favorite INTEGER);`,
        db
      );
      await runAsync(
        `CREATE TABLE IF NOT EXISTS tags(id INTEGER PRIMARY KEY, tagname TEXT);`,
        db
      );
      await runAsync(`INSERT INTO tags(tagname) VALUES ('cool');`, db);
      await runAsync(`INSERT INTO tags(tagname) VALUES ('moody');`, db);
      await runAsync(`INSERT INTO tags(tagname) VALUES ('melancolic');`, db);
      await runAsync(
        `CREATE TABLE IF NOT EXISTS lyrics_tags (lyrics_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (lyrics_id, tag_id),
        FOREIGN KEY (lyrics_id) REFERENCES lyrics(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE);`,
        db
      );

      console.log("Database initialized successfully.");
    } catch (error) {
      console.error("Error initializing database:", error.message);
    }
  }
};

async function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Electron",
    width: 1506,
    height: 949,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.openDevTools();
  await createDB();

  const startUrl = url.format({
    pathname: path.join(__dirname, "./app/build/index.html"),
    protocol: "file",
  });

  // mainWindow.loadURL(startUrl);
  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(createMainWindow);