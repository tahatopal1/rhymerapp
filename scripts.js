const { contextBridge } = require("electron");
const sqlite3 = require("sqlite3").verbose();

const connectDb = async () => {
  return new sqlite3.Database("./rhymes.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
};

function queryAsync(sql, db, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function runAsync(sql, db, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

contextBridge.exposeInMainWorld("electron", {
  homeDir: () => os.homedir(),
  osVersion: () => os.version(),
  arch: () => os.arch(),
  queryLyrics: async (key, syllable, endsWith, page) => {
    const params = [];
    const db = await connectDb();
    let sql = `SELECT * FROM lyrics l`;

    sql = sql.concat(` WHERE 1=1`);

    if (tag) {
    }

    if (key) {
      sql = sql.concat(` AND l.sentence LIKE ?`);
      params.push(`%${key}%`);
    }

    if (syllable) {
      sql = sql.concat(` AND l.syllable = ?`);
      params.push(syllable);
    }

    if (endsWith) {
      sql = sql.concat(` AND l.sentence LIKE ?`);
      params.push(`%${endsWith}`);
    }

    sql = sql.concat(" LIMIT 10 OFFSET ?");
    params.push(page * 10);

    let res = await queryAsync(sql, db, params);

    let tagSql = `SELECT * FROM lyrics_tags lt INNER JOIN tags t ON lt.tag_id = t.id WHERE lt.lyrics_id = ?`;

    for (let i = 0; i < res.length; i++) {
      let tags = await queryAsync(tagSql, db, [res[i].id]);
      tags = tags.map((t) => t.tagname);
      res[i] = { ...res[i], tags };
    }

    return res;
  },
  insertLyric: async (sentence, syllable, tagNames) => {
    const db = await connectDb();

    const savedID = await runAsync(
      `INSERT INTO lyrics(sentence, syllable) VALUES (?, ?)`,
      db,
      [sentence, syllable]
    );

    let placeholders = tagNames.map(() => "?").join(",");
    let sql = `SELECT * FROM tags WHERE tagname IN (${placeholders})`;

    const tags = await queryAsync(sql, db, tagNames);
    const tagIds = tags.map((tag) => tag.id);

    tagIds.forEach((tagId) => {
      runAsync(`INSERT INTO lyrics_tags(lyrics_id, tag_id) VALUES (?,?)`, db, [
        savedID,
        tagId,
      ]);
    });
  },
  queryTags: async () => {
    const db = await connectDb();
    let rows = await queryAsync(`SELECT * FROM tags`, db);
    return rows.map((tag) => tag.tagname);
  },
  totalLyricsCount: async () => {
    const db = await connectDb();
    const quantity = await queryAsync(`SELECT COUNT(*) FROM lyrics`, db, []);
    return quantity;
  },
});
