import React, { useCallback } from "react";
import * as XLSX from "xlsx";
import "./LyricsSideActions.css";

const LyricsSideActions = (props) => {
  const electron = window.electron;

  function readAsBinaryString(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    let allRows = [];

    if (file && file.name.endsWith(".xlsx")) {
      try {
        // Using await here with the promisified function
        const binaryData = await readAsBinaryString(file);

        // Read the Excel File data
        const wb = XLSX.read(binaryData, { type: "binary" });

        // Loop Over Each Sheet
        for (const sheetName of wb.SheetNames) {
          const sheet = wb.Sheets[sheetName];
          const rowObj = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Collect rows in a temporary array
          allRows = [...allRows, ...rowObj];
        }

        allRows = allRows.slice(1); // Remove the header row if needed

        for (const element of allRows) {
          if (Number.isFinite(element[1])) {
            await electron.insertLyric(
              element[0],
              element[1],
              element[2] &&
                element[2].replaceAll(" ", "").toLowerCase().split(","),
              element[3] ? 1 : 0
            );
          }
        }

        // Clearing the file input value to allow re-uploads
        e.target.value = null;

        // Trigger any additional action
        props.onImport();
      } catch (error) {
        console.error("An error occurred while reading the file:", error);
      }
    }
  }, []);

  const handleBackup = async () => {
    let response = await electron.queryLyrics("", "", "", 1, "", "", false);
    const responseDerived = response.map((res) => ({
      sentence: res.sentence,
      syllable: res.syllable,
      tags: res.tags.join(","),
      favorite: res.favorite,
    }));

    const wb = XLSX.utils.book_new();

    /* Create a worksheet */
    const ws = XLSX.utils.json_to_sheet(responseDerived, {
      header: ["sentence", "syllable", "tags", "favorite"], // Specify the headers if you want
    });

    /* Add the worksheet to the workbook */
    XLSX.utils.book_append_sheet(wb, ws, "Lyrics");

    /* Generate an XLSX file */
    XLSX.writeFile(wb, "lyrics.xlsx");
  };

  return (
    <div className="lyrics-side-actions">
      <button onClick={props.onRefresh}>
        <div className="lyrics-side-action-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="side-action-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <p>Clear Lyrics</p>
        </div>
      </button>
      <button onClick={handleBackup}>
        <div className="lyrics-side-action-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="side-action-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          <p>Backup</p>
        </div>
      </button>
      <button className="import-button" style={{ position: "relative" }}>
        <div className="lyrics-side-action-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="side-action-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p>Import Excel</p>
          <input
            type="file"
            accept=".csv, .xlsx"
            className="file-input"
            onChange={handleFileUpload}
          />
        </div>
      </button>
    </div>
  );
};

export default LyricsSideActions;
