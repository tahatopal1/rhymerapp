const { contextBridge } = require("electron");
const os = require("os");
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
  queryLyrics: async (key, syllable, endsWith, page, tag, favorite) => {
    const params = [];
    const db = await connectDb();
    let sql = "";

    if (tag) {
      sql = `SELECT l.id as id, l.sentence as sentence, l.syllable as syllable, l.favorite as favorite FROM lyrics l INNER JOIN lyrics_tags lt ON l.id = lt.lyrics_id INNER JOIN tags t ON lt.tag_id = t.id WHERE t.tagname = ?`;
      params.push(tag);
    } else {
      sql = `SELECT l.id as id, l.sentence as sentence, l.syllable as syllable, l.favorite as favorite FROM lyrics l WHERE 1=1`;
    }

    if (key) {
      sql = sql.concat(` AND sentence LIKE ?`);
      params.push(`%${key}%`);
    }

    if (syllable) {
      sql = sql.concat(` AND syllable = ?`);
      params.push(syllable);
    }

    if (endsWith) {
      sql = sql.concat(` AND sentence LIKE ?`);
      params.push(`%${endsWith}`);
    }

    if (favorite) {
      sql = sql.concat(` AND favorite = 1`);
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
      `INSERT INTO lyrics(sentence, syllable, favorite) VALUES (?, ?, ?)`,
      db,
      [sentence, syllable, 0]
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
  updateLyric: async (id, sentence, syllable, tagNames) => {
    const db = await connectDb();

    await runAsync(
      `UPDATE lyrics SET sentence = ?, syllable = ? WHERE id = ?`,
      db,
      [sentence, syllable, id]
    );

    await runAsync(`DELETE FROM lyrics_tags WHERE lyrics_id = ?`, db, [id]);

    let placeholders = tagNames.map(() => "?").join(",");
    let sql = `SELECT * FROM tags WHERE tagname IN (${placeholders})`;

    const tags = await queryAsync(sql, db, tagNames);
    const tagIds = tags.map((tag) => tag.id);

    tagIds.forEach((tagId) => {
      runAsync(`INSERT INTO lyrics_tags(lyrics_id, tag_id) VALUES (?,?)`, db, [
        id,
        tagId,
      ]);
    });
  },
  insertTag: async (tagName) => {
    try {
      const db = await connectDb();
      await runAsync(`INSERT INTO tags(tagname) VALUES (?)`, db, [tagName]);
    } catch (err) {
      return { error: err.message };
    }
  },
  queryTags: async () => {
    const db = await connectDb();
    let rows = await queryAsync(`SELECT * FROM tags`, db);
    return rows.map((tag) => tag.tagname);
  },
  deleteTagByName: async (tagName) => {
    const db = await connectDb();
    let rows = await queryAsync(`SELECT * FROM tags WHERE tagname = ?`, db, [
      tagName,
    ]);
    await runAsync(`DELETE FROM lyrics_tags WHERE tag_id = ?`, db, [
      rows[0].id,
    ]);
    await runAsync(`DELETE FROM tags WHERE id = ?`, db, [rows[0].id]);
  },
  updateTagByName: async (tagName, nTagName) => {
    const db = await connectDb();
    let rows = await queryAsync(`SELECT * FROM tags WHERE tagname = ?`, db, [
      tagName,
    ]);
    if (rows.length > 0) {
      let guardCaseRows = await queryAsync(
        `SELECT * FROM tags WHERE tagname = ?`,
        db,
        [nTagName]
      );
      if (guardCaseRows.length === 0) {
        await runAsync(`UPDATE tags SET tagname = ? WHERE id = ?`, db, [
          nTagName,
          rows[0].id,
        ]);
      }
    }
  },
  totalLyricsCount: async (key, syllable, endsWith, tag = "", favorite) => {
    const db = await connectDb();
    const params = [];

    if (tag) {
      sql = `SELECT COUNT(*) FROM lyrics l INNER JOIN lyrics_tags lt ON l.id = lt.lyrics_id INNER JOIN tags t ON lt.tag_id = t.id WHERE t.tagname = ?`;
      params.push(tag);
    } else {
      sql = `SELECT COUNT(*) FROM lyrics l WHERE 1=1`;
    }

    if (key) {
      sql = sql.concat(` AND sentence LIKE ?`);
      params.push(`%${key}%`);
    }

    if (syllable) {
      sql = sql.concat(` AND syllable = ?`);
      params.push(syllable);
    }

    if (endsWith) {
      sql = sql.concat(` AND sentence LIKE ?`);
      params.push(`%${endsWith}`);
    }

    if (favorite) {
      sql = sql.concat(` AND favorite = 1`);
    }

    const quantity = await queryAsync(sql, db, params);
    return quantity;
  },
  addFavorites: async (id, val) => {
    const db = await connectDb();
    runAsync(`UPDATE lyrics SET favorite = ? WHERE id = ?`, db, [val, id]);
  },
  deleteLyric: async (id) => {
    const db = await connectDb();
    await runAsync(`DELETE FROM lyrics_tags WHERE lyrics_id = ?`, db, [id]);
    await runAsync(`DELETE FROM lyrics WHERE id = ?`, db, [id]);
  },
});
