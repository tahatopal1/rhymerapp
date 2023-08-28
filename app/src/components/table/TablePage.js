import React, { useState, useEffect, useRef } from "react";
import Modal from "../modal/Modal";
import TableActionButton from "./TableActionButton";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import "./TablePage.css";

const TablePage = (props) => {
  const electron = window.electron;

  const [modal, setModal] = useState(false);
  const [lyricTags, setLyricTags] = useState([]);
  const [lyricRecords, setLyricRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(99);
  const [dummyPlaceholder, setDummyPlaceholder] = useState({ dummy: "dummy" });
  const [singlePage, setSinglePage] = useState(false);
  const [paginationVisible, setPaginationVisible] = useState(false);

  const [searchedSentence, setSearchedSentence] = useState("");
  const [searchedSyllable, setSearchedSyllable] = useState(0);
  const [searchedEndsWith, setSearchedEndsWith] = useState("");
  const [searchedTag, setSearchedTag] = useState("");

  const [sentence, setSentence] = useState("");
  const [syllable, setSyllable] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [tag, setTag] = useState("");

  const [favoritesSelected, setFavoritesSelected] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingInformation, setUpdatingInformation] = useState({
    id: 0,
    sentence: "",
    syllable: 0,
    tags: [],
  });

  const [paginationState, setPaginationState] = useState({
    fullBack: false,
    back: false,
    forward: true,
    fullForward: true,
  });

  const paginationInput = useRef(null);

  const showModalHandler = () => setModal(true);
  const closeModalHandler = () => setModal(false);

  const arrangeUpdateModalHandler = (updateInfo) => {
    setIsUpdating(true);
    setUpdatingInformation(updateInfo);
  };

  const fetchLyricsData = async () => {
    try {
      let countResponse = await electron.totalLyricsCount(
        searchedSentence,
        searchedSyllable,
        searchedEndsWith,
        searchedTag,
        favoritesSelected
      );
      countResponse = countResponse.pop()["COUNT(*)"];
      const lPage = Math.ceil(countResponse / 10);

      if (paginationInput.current) {
        paginationInput.current.value = currentPage;
      }

      if (lPage === 0) {
        setPaginationVisible(false);
      }

      if (lPage === 1) {
        setPaginationVisible(true);
        setSinglePage(false);
        setPaginationState({
          fullBack: false,
          back: false,
          forward: false,
          fullForward: false,
        });
      }

      if (lPage > 1) {
        setPaginationVisible(true);
        setLastPage(lPage);
        setSinglePage(true);

        if (currentPage < 1 || currentPage === 1) {
          setCurrentPage(1);
          setPaginationState({
            fullBack: false,
            back: false,
            forward: true,
            fullForward: true,
          });
        }

        if (currentPage > lPage || currentPage === lPage) {
          setCurrentPage(lPage);
          setPaginationState({
            fullBack: true,
            back: true,
            forward: false,
            fullForward: false,
          });
        }

        if (currentPage > 1 && currentPage < lPage) {
          setPaginationState({
            fullBack: true,
            back: true,
            forward: true,
            fullForward: true,
          });
        }
      }

      let response = await electron.queryLyrics(
        searchedSentence,
        searchedSyllable,
        searchedEndsWith,
        currentPage - 1,
        searchedTag,
        favoritesSelected
      );

      setLyricRecords(response);
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  useEffect(() => {
    fetchLyricsData();
  }, [
    currentPage,
    dummyPlaceholder,
    searchedSyllable,
    searchedSentence,
    searchedEndsWith,
    searchedTag,
    favoritesSelected,
  ]);

  useEffect(() => {
    const fetchTagsData = async () => {
      try {
        let response = await electron.queryTags();
        setLyricTags(response);
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    };
    fetchTagsData();
  }, [dummyPlaceholder]);

  return (
    <React.Fragment>
      {modal && (
        <Modal
          onConfirm={() => {
            setDummyPlaceholder((dummy) => ({ ...dummy }));
          }}
          onCloseModal={closeModalHandler}
          updatingInformation={updatingInformation}
          isUpdating={isUpdating}
          data={updatingInformation}
        />
      )}
      <div className="table-container">
        <TableActionButton
          onClick={() => {
            setIsUpdating(false);
            setUpdatingInformation({
              id: 0,
              sentence: "",
              syllable: 0,
              tags: [],
            });
            showModalHandler();
          }}
          className="add-button"
          svgData="M12 4.5v15m7.5-7.5h-15"
        />
        <TableHead />
        <TableBody
          data={lyricRecords}
          updateAction={arrangeUpdateModalHandler}
          showModalHandler={showModalHandler}
          onConfirm={() => {
            setDummyPlaceholder((dummy) => ({ ...dummy }));
          }}
        />
        {paginationVisible && (
          <div className="pagination-container">
            <form
              className="pagination"
              onSubmit={(event) => {
                event.preventDefault();
                setCurrentPage(+paginationInput.current.value);
              }}
            >
              <div
                onClick={() => {
                  if (paginationState.fullBack) {
                    setCurrentPage(1);
                  }
                }}
                className={`pagination-page-button ${
                  paginationState.fullBack ? "" : "passive"
                }`}
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
                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                  />
                </svg>
              </div>
              <div
                onClick={() => {
                  if (paginationState.back) {
                    setCurrentPage((cPage) => cPage - 1);
                  }
                }}
                className={`pagination-page-button ${
                  paginationState.back ? "" : "passive"
                }`}
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
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </div>
              <input
                type="number"
                className="page-input"
                defaultValue={1}
                // value={currentPage}
                ref={paginationInput}
                min={1}
                max={lastPage}
                disabled={!singlePage}
              />
              <button type="submit" className="page-submit-button" />
              <div
                onClick={() => {
                  if (paginationState.forward) {
                    setCurrentPage((cPage) => cPage + 1);
                  }
                }}
                className={`pagination-page-button ${
                  paginationState.forward ? "" : "passive"
                }`}
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
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
              <div
                onClick={() => setCurrentPage(lastPage)}
                className={`pagination-page-button ${
                  paginationState.fullForward ? "" : "passive"
                }`}
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
                    d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="table-utility-container">
        <div className="input-container">
          <p className="input-title">Tag</p>
          <select
            name=""
            id=""
            onChange={(event) => {
              setTag(event.target.value);
            }}
            value={tag}
          >
            <option value="">Select an option</option>
            {lyricTags.map((t) => (
              <option value={t} key={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <p className="input-title">Key</p>
          <input
            type="text"
            name=""
            id=""
            value={sentence}
            onChange={(event) => {
              setSentence(event.target.value);
            }}
          />
        </div>
        <div className="input-container">
          <p className="input-title">Ends With</p>
          <input
            type="text"
            name=""
            id=""
            value={endsWith}
            onChange={(event) => {
              setEndsWith(event.target.value);
            }}
          />
        </div>
        <div className="input-container">
          <p className="input-title">Syllable</p>
          <input
            type="number"
            name=""
            id=""
            value={syllable}
            onChange={(event) => {
              let val = event.target.value;
              if (val !== "" && val < 1) {
                val = 1;
              }
              setSyllable(val);
            }}
          />
        </div>
        <div className="input-action-container">
          <button
            className="input-action"
            onClick={() => {
              setTag("");
              setSentence("");
              setSyllable("");
              setEndsWith("");
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
          <button
            className={`input-action ${
              favoritesSelected ? "input-action-selected" : ""
            }`}
            onClick={() => setFavoritesSelected((selected) => !selected)}
          >
            {favoritesSelected ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
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
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            )}
          </button>
          <button
            className="input-action"
            onClick={() => {
              setSearchedSentence(sentence);
              setSearchedSyllable(syllable);
              setSearchedEndsWith(endsWith);
              setSearchedTag(tag);
              if (paginationInput.current) {
                paginationInput.current.value = 1;
              }
              setCurrentPage(1);
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TablePage;
