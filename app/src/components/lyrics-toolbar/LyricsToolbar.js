import React, { useState } from "react";
import "./LyricsToolbar.css";
import LyricsMiniTable from "./LyricsMiniTable";
import LyricsTextArea from "./LyricsTextArea";
import LyricsSideActions from "./LyricsSideActions";

const LyricsToolbar = () => {
  const [lyricsRows, setLyricsRows] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();

    e.target.classList.contains("mini-table-item") &&
      e.target.classList.add("mini-table-item-dragged");

    e.target.classList.contains("lyrics-mini-table") &&
      e.target.classList.add("lyrics-mini-table-dragged");
  };

  const handleOnDropOnItem = (e, row, col) => {
    const info = e.dataTransfer.getData("info").toLowerCase();
    lyricsRows[row].splice(col + 1, 0, info);
    e.target.classList.contains("mini-table-item") &&
      e.target.classList.remove("mini-table-item-dragged");
    setLyricsRows(lyricsRows.slice());
  };

  const handleOnDropOnBox = (e) => {
    e.stopPropagation();
    const info = e.dataTransfer.getData("info");
    lyricsRows.push([info]);
    e.target.classList.contains("lyrics-mini-table") &&
      e.target.classList.remove("lyrics-mini-table-dragged");
    setLyricsRows(lyricsRows.slice());
  };

  const onRemoveItemsHandler = (row, col) => {
    const hasSingleElm = lyricsRows[row].length === 1;
    lyricsRows[row].splice(col, 1).slice();
    hasSingleElm && lyricsRows.splice(row, 1);
    setLyricsRows(lyricsRows.slice());
  };

  return (
    <div className="lyrics-toolbar">
      <LyricsMiniTable
        data={lyricsRows}
        onDragOver={handleDragOver}
        onDrop={handleOnDropOnBox}
        onDropItem={handleOnDropOnItem}
        onRemoveItem={onRemoveItemsHandler}
      />
      <LyricsTextArea data={lyricsRows} />
      <LyricsSideActions
        onRefresh={() => {
          setLyricsRows([]);
        }}
      />
    </div>
  );
};

export default LyricsToolbar;
