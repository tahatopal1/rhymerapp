import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

const Backdrop = () => {
  return <div className="backdrop" />;
};

const ModalOverlay = (props) => {
  const electron = window.electron;

  const [lyricTags, setLyricTags] = useState([]);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dummyPlaceholder, setDummyPlaceholder] = useState({});
  const [title, setTitle] = useState("Add Item");

  const sentenceRef = useRef();
  const syllableRef = useRef();
  const idRef = useRef();

  if (sentenceRef.current) {
    sentenceRef.current.focus();
  }

  useEffect(() => {
    const fetchTagsData = async () => {
      try {
        let response = await electron.queryTags();
        setLyricTags(response.slice().sort());

        const data = props.updatingInformation;
        if (data?.id) {
          idRef.current.value = data.id;
          sentenceRef.current.value = data.sentence;
          syllableRef.current.value = data.syllable;
          setLyricTags((tags) =>
            tags.filter((tag) => !data.tags.includes(tag))
          );
          setSelectedTags(data.tags);
          setTitle("Update Item");
        }
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    };
    fetchTagsData();
  }, []);

  const insertLyricHandler = async () => {
    const sentence = sentenceRef.current.value;
    const syllable = syllableRef.current.value;
    const id = idRef.current.value;

    if (sentence && syllable) {
      const tagList = selectedTags.slice();

      if (props.updatingInformation.id) {
        await electron.updateLyric(id, sentence, syllable, tagList);
      } else {
        await electron.insertLyric(sentence, syllable, tagList);
      }
      setDummyPlaceholder({ abc: "new" });

      props.onCloseModal();
      props.onConfirm();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      props.onCloseModal();
    }
    if (e.key === "Enter") {
      insertLyricHandler();
    }
  };

  const toggleDropdownHandler = () => {
    setDropdownOpened((opened) => !opened);
  };

  const onSelectTagHandler = (event) => {
    const eventVal = event.target.textContent;
    setSelectedTags((tags) => {
      tags.push(eventVal);
      return tags.slice().sort();
    });
    setLyricTags((tags) => tags.filter((str) => str !== eventVal).sort());
  };

  const onDiscardTagHandler = (event) => {
    const eventVal = event.target.textContent;
    setLyricTags((tags) => {
      tags.push(eventVal);
      return tags.slice().sort();
    });
    setSelectedTags((tags) => tags.filter((str) => str !== eventVal).sort());
  };

  return (
    <div className="modal" onKeyDown={handleKeyDown} tabIndex="0">
      <div className="modal-header">
        <p>{title}</p>
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
      <input type="hidden" ref={idRef} />
      <div className="modal-content">
        <div className="modal-input-container">
          <p className="modal-input-text">Sentence</p>
          <input
            type="text"
            className="modal-input"
            spellCheck={false}
            ref={sentenceRef}
          />
        </div>
        <div className="modal-input-container">
          <p className="modal-input-text">Syllable</p>
          <input type="number" className="modal-input" ref={syllableRef} />
        </div>
        <div className="modal-input-container">
          <p className="modal-input-text">Tags</p>
          <div className="modal-input-box">
            {selectedTags.map((t) => (
              <div key={t} className="modal-chip" onClick={onDiscardTagHandler}>
                {t}
              </div>
            ))}
            <div
              className="drop-button"
              id="drop-button"
              onClick={toggleDropdownHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
          {dropdownOpened && lyricTags.length > 0 && (
            <div className="modal-input-dropdown">
              {lyricTags.map((t) => (
                <div
                  key={t}
                  className="modal-input-dropdown-item"
                  onClick={onSelectTagHandler}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="modal-footer">
        <button
          className="modal-button"
          onClick={() => {
            sentenceRef.current.value = "";
            syllableRef.current.value = "";
            setLyricTags((tags) => [...tags, ...selectedTags].sort());
            setSelectedTags([]);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
        <button className="modal-button" onClick={insertLyricHandler}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onConfirm={props.onConfirm}
          onCloseModal={props.onCloseModal}
          title={props.title}
          updatingInformation={props.updatingInformation}
        />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default Modal;
