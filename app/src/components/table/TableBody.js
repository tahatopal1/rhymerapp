import React, { useState } from "react";
import "./TableBody.css";
import TableCol from "./TableCol";
import TableRow from "./TableRow";
import ActionsContainer from "./ActionsContainer";
import TagsContainer from "./TagsContainer";

const TableBody = (props) => {
  const lyricsList = props.data;

  return (
    <div className="table-body">
      {lyricsList.length === 0 && (
        <p className="no-content">There's no result</p>
      )}
      {lyricsList.map((lyric) => (
        <TableRow key={lyric.id} content={lyric.sentence}>
          <TableCol>
            <p>{lyric.id}</p>
          </TableCol>
          <TableCol>
            <p>{lyric.sentence}</p>
          </TableCol>
          <TableCol>
            <p>{lyric.syllable}</p>
          </TableCol>
          <TableCol>
            <TagsContainer tags={lyric.tags} />
          </TableCol>
          <TableCol>
            <ActionsContainer
              data={lyric}
              updateAction={props.updateAction}
              showModalHandler={props.showModalHandler}
              onConfirm={props.onConfirm}
            />
          </TableCol>
        </TableRow>
      ))}
    </div>
  );
};

export default TableBody;
