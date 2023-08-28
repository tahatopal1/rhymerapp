import React from "react";
import "./TagsContainer.css";

const TagsContainer = (props) => {
  return (
    <div className="tags-container">
      {props.tags.map((t) => (
        <div className="tag" key={t}>
          {t}
        </div>
      ))}
    </div>
  );
};

export default TagsContainer;
