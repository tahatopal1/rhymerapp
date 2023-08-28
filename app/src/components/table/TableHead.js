import React from "react";
import "./TableHead.css";
import TableCol from "./TableCol";
import TableRow from "./TableRow";

const TableHead = () => {
  return (
    <div className="table-head">
      <TableRow>
        <TableCol>
          <p>ID</p>
        </TableCol>
        <TableCol>
          <p>Sentence</p>
        </TableCol>
        <TableCol>
          <p>Syllable</p>
        </TableCol>
        <TableCol>
          <p>Tag</p>
        </TableCol>
        <TableCol>
          <p>Actions</p>
        </TableCol>
      </TableRow>
    </div>
  );
};

export default TableHead;
