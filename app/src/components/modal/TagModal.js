import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import "./TagModal.css";
import Backdrop from "./Backdrop";
import TagItem from "./TagItem";

const TagModalOverlay = (props) => {
  const electron = window.electron;

  const [tagList, setTagList] = useState([]);
  const [dummy, setDummy] = useState({ dummy: "" });

  useEffect(() => {
    const fetchTagsData = async () => {
      try {
        let response = await electron.queryTags();
        setTagList(response.slice().sort());
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    };
    fetchTagsData();
  }, [dummy]);

  const inputRef = useRef(null);

  const saveTag = async () => {
    if (inputRef.current.value.trim()) {
      const tagName = inputRef.current.value.trim();
      await electron.insertTag(tagName);
      setDummy((val) => ({ ...val }));
      inputRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      props.onCloseModal();
    }

    if (e.key === "Enter") {
      saveTag();
    }
  };

  return (
    <div className="tag-modal" tabIndex="0" onKeyDown={handleKeyDown}>
      <div className="tag-modal-header">
        <p>Tags</p>
        <svg
          onClick={props.onCloseModal}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="icon close-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div className="tag-modal-content">
        <div className="input-tag-container">
          <p className="tag-modal-input-text">Add New Tag</p>
          <input type="text" spellCheck={false} ref={inputRef} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="tag-input-icon"
            onClick={saveTag}
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="tag-list-container">
          <p className="tag-modal-input-text">Tag List</p>
          <div className="tag-list">
            {tagList.map((tag) => (
              <TagItem
                title={tag}
                key={tag}
                onRefresh={() => setDummy((val) => ({ ...val }))}
                onConfirm={props.onConfirm}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TagModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <TagModalOverlay
          onCloseModal={props.onCloseModal}
          onConfirm={props.onConfirm}
        />,
        document.getElementById("tag-overlay-root")
      )}
    </React.Fragment>
  );
};

export default TagModal;
