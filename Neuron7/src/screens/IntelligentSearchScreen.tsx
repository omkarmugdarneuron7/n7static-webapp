import React, { useEffect, useState } from "react";
import { Button, makeStyles, Spinner } from "@fluentui/react-components";
import SearchBar from "../components/SearchBar";
import SuggestedResultCard from "../components/SuggestedResultCard";
import SearchResultCard from "../components/SearchResultCard";
import FilterIcon from "../assets/icons/Filter.svg";
import EmailIcon from "../assets/icons/email-icon.svg";
import CopyIcon from "../assets/icons/copy-icon.svg";
import { useMediaQuery } from "react-responsive";
import { SelectedCardData } from "../types/SearchResultTypes";
import {
  extractFileName,
  filterData,
  getFileIcon,
  groupDataBySource,
} from "../util/searchResultUtil";
import NegativeFeedbackModal from "../components/ModalConponent/NegativeFeedbackModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { useAuth } from "../context/AuthContext";
import { SearchResultFilterModal } from "../components/SearchResultFilterModal";
import ContentViewerModal from "../components/ModalConponent/ContentViewerModal"; // Import the modal
import { SagaIntelligentSearchActionType } from "../Redux/Sagas/inteliigentSearchActions";
import { resetFilters, setIsNegativeFeedbackModalOpen, setIsOpenHtmlContentViewerModal, setIsOpenPdfContentViewerModal, setIsVideoContentViewerModalOpen } from "../Redux/Slices/intelligentSearchSlice";
import { HtmlContentViewerModal } from "../components/ModalConponent/HtmlContentViewerModal";
import { VideoContentViewerModal } from "../components/ModalConponent/VideoContentViewerModal";
import { PdfViewerModal } from "../components/ModalConponent/PdfViewerModal";
const useStyles = makeStyles({
  screenContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#FFF",
  },
  searchBarContainer: {
    display: "inline-flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  filterSectionContainer: { display: "flex" },
  filterButtonContainer: {
    height: "32px",
    maxWidth: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    borderRadius: "34px",
    border: "1px solid #0F6CBD",
    background: "#EBF3FC ",
    color: "#0F6CBD",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "Lato",
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "20px",
    ":hover": {
      backgroundColor: "#EBF3FC",
      border: "1px solid #0F6CBD",
    },
    ":active": {
      border: "1px solid #0F6CBD",
      backgroundColor: "#EBF3FC",
    },
    "&.fui-Button": {
      padding: "5px",
    },
  },
  filterIconContainer: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
  emailButtonContainer: {
    height: "32px",
    padding: "0px 12px",
    maxWidth: "320px",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    borderRadius: "4px",
    border: "1px solid #0F6CBD",
    background: "#FFF ",
    color: "#0F6CBD",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "Lato",
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "20px",
  },
  copyButtonContainer: {
    height: "32px",
    padding: "0px 12px",
    maxWidth: "320px",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    borderRadius: "4px",
    border: "1px solid #0F6CBD",
    background: "#FFF ",
    color: "#0F6CBD",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "Lato",
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "20px",
    marginLeft: "8px",
  },
  searchResultContainer: {
    width: "100%",
    maxWidth: "100%",
    // height: "447px",
    backgroundColor: "#F8FBFF",
    boxShadow:
      " 0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "20px",
    overflowY: "auto",
  },
  filterIconTextContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  badgeContainer: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    padding: "3px 5px",
    borderRadius: "16px",
    backgroundColor: "#C50F1F",
    color: "#FFF",
    fontSize: "10px",
    fontWeight: "700",
    fontFamily: "Lato",
    border: "1px solid #EBEBEB",
    lineHeight: "10px",
    textAlign: "center",
    marginTop: "2px",
  },
  staticText: {
    justifyContent: "center",
    height: "100%",
    color: "#808080",
    textAlign: "center",
    fontFamily: "Lato",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "22px",
    marginTop: "26px",
    display: "flex",
    // alignItems: "center",
    width: "100%",
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    height: "100%",
  },
});

const IntelligentSearchScreen = () => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [enteredText, setEnteredText] = useState("");
  const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });
  const [data, setData] = useState<any>({});
  const queryResult = useSelector((state: RootState) => state.intelligentSearch.queryResult);
  const noResponseFromSearch = useSelector((state: RootState) => state.intelligentSearch.noResponseFromSearch)
  const selectedFilters = useSelector((state: RootState) => state.intelligentSearch.selectedFilters);
  const isSearchingQueryResult = useSelector((state: RootState) => state.intelligentSearch.isSearchingQueryResult);
  const isHtmlContentViewerModalOpen = useSelector((state: RootState) => state.intelligentSearch.isHtmlContentViewerModalOpen);
  const isVideoContentViewerModalOpen = useSelector((state: RootState) => state.intelligentSearch.isVideoContentViewerModalOpen);
  const isNegativeFeedbackModalOpen = useSelector((state: RootState) => state.intelligentSearch.isNegativeFeedbackModalOpen);
  const isPdfViewerOpen = useSelector((state: RootState) => state.intelligentSearch.isPdfViewerOpen);
  const [isFilterDrawerOpen, setIsFIlterDrawerOpen] = useState(false);
  const [isContentViewerModalOpen, setIsContentViewerModalOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<SelectedCardData>({
    title: "",
    fileName: "",
    content: "",
    fileUrl: "",
    cardData: {}, // Initialize as an empty object
  });
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [selectedFilterCount, setSelectedFilterCount] = useState(0);
  const { token, baseUrl } = useAuth();


  const isValidQueryResponse = queryResult?.QueryResponse?.length > 0 && !isSearchingQueryResult && !noResponseFromSearch;
  useEffect(() => {
    setData(
      filterData(groupDataBySource(queryResult?.QueryResponse), selectedFilters)
    );
  }, [queryResult, selectedFilters]);

  const handleSearchClick = () => {
    setSearchButtonClicked(true);
    dispatch(resetFilters());

    if (token && baseUrl) {
      dispatch({
        type: SagaIntelligentSearchActionType.getQueryResults,
        payload: {
          text: enteredText,
          token,
          baseUrl,
        },
      });
    } else {
      alert("Authentication failed or base URL not loaded yet.");
    }
  };

  const countAppliedFilters = (selectedFilters: {
    [key: string]: string[];
  }) => {
    return Object.values(selectedFilters).reduce((acc, curr) => {
      return Number(acc + curr.length);
    }, 0);
  };

  const isFacetsNotEmpty = queryResult.facets && typeof queryResult.facets === 'object' &&
    Object.values(queryResult.facets).some(arr => Array.isArray(arr) && arr.length > 0);

  useEffect(() => {
    setSelectedFilterCount(countAppliedFilters(selectedFilters));
  }, [selectedFilters]);

  return (
    <div className={styles.screenContainer}>
      <div
        className={styles.searchBarContainer}
        style={{
          boxShadow:
            !isSearchingQueryResult && searchButtonClicked && !noResponseFromSearch
              ? "0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)"
              : "none",
          height:
            (isSearchingQueryResult || noResponseFromSearch || !searchButtonClicked) ? "100%" : "auto",

        }}
      >
        <SearchBar
          setEnteredText={setEnteredText}
          enteredText={enteredText}
          onSearch={handleSearchClick}
        />
        {noResponseFromSearch && searchButtonClicked && !isSearchingQueryResult && <div
          className={styles.staticText}
          style={{ alignItems: "center", }}
        >
          {"No search result found... Please try again with different keywords."}
        </div>}
        {!searchButtonClicked && <div
          className={styles.staticText}
          style={{ alignItems: isMobileView ? "center" : "flex-start", }}
        >
          {"Use search to find better answers to your most important questions"}
        </div>}
        {isSearchingQueryResult && (
          <div
            className={styles.loadingSpinner}
          >
            <Spinner size="large" />
          </div>
        )}
        {isValidQueryResponse && (
          <>
            <SuggestedResultCard text={queryResult?.suggested_answer} />
            <div
              style={{
                justifyContent: !isMobileView ? "space-between" : "center",
              }}
              className={styles.filterSectionContainer}
            >
              <Button
                appearance="transparent"
                onClick={() => setIsFIlterDrawerOpen(true)}
                style={{ width: !isMobileView ? "132px" : "100%" }}
                className={styles.filterButtonContainer}
              >
                <div className={styles.filterIconTextContainer}>
                  <button className={styles.filterIconContainer}>
                    <img
                      src={FilterIcon}
                      alt="Search Icon"
                      width="20"
                      height="20"
                    />
                  </button>
                  Filter
                </div>
                {selectedFilterCount > 0 && (
                  <div className={styles.badgeContainer}>
                    {selectedFilterCount}
                  </div>
                )}
              </Button>
              {!isMobileView && (
                <div>
                  <Button
                    appearance="transparent"
                    // onClick={() => alert("Search Clicked")}
                    className={styles.emailButtonContainer}
                    disabled={true}
                  >
                    <button className={styles.filterIconContainer}>
                      <img
                        src={EmailIcon}
                        alt="Search Icon"
                        width="20"
                        height="20"
                      />
                    </button>
                    Email
                  </Button>

                  <Button
                    appearance="transparent"
                    // onClick={() => alert("Search Clicked")}
                    className={styles.copyButtonContainer}
                    disabled={true}
                  >
                    <button className={styles.filterIconContainer}>
                      <img
                        src={CopyIcon}
                        alt="Search Icon"
                        width="20"
                        height="20"
                      />
                    </button>
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {isValidQueryResponse && (
        <div className={styles.searchResultContainer}>
          {Object.entries(data).map(([filename, items]) => {
            const [tempItem, ...restItems] = items as any[];
            return (
              <SearchResultCard
                key={tempItem.id}
                cardData={tempItem}
                icon={
                  <button className={styles.filterIconContainer}>
                    <img
                      src={
                        getFileIcon(
                          tempItem.source_file_url || tempItem.page_html_link
                        )?.icon ?? ""
                      }
                      alt="Search Icon"
                      width="40"
                      height="40"
                    />
                  </button>
                }
                title={tempItem.answer}
                fileName={extractFileName(
                  tempItem.source_file_url || tempItem.page_html_link)}
                subtext={tempItem.answerSegment}
                additionalItems={restItems}
                setIsContentViewerModalOpen={setIsContentViewerModalOpen}
                setSelectedCardData={(data) =>
                  setSelectedCardData({
                    ...data,
                    cardData: {
                      ...data.cardData,
                      additionalItems: restItems, // Ensure additionalItems is set
                    },
                  })
                }
              />
            );
          })}
        </div>
      )}

      {isNegativeFeedbackModalOpen && <NegativeFeedbackModal isModalOpen={isNegativeFeedbackModalOpen} onDismiss={() => { dispatch(setIsNegativeFeedbackModalOpen(false)) }} />
      }      {/* ContentViewerModal */}
      {/* <ContentViewerModal
        isModalOpen={isContentViewerModalOpen}
        onDismiss={() => setIsContentViewerModalOpen(false)} // Close the modal
        title={selectedCardData.title}
        content={selectedCardData.content}
        fileName={selectedCardData.fileName}
        className="content-viewer-modal"
      /> */}
      {isFacetsNotEmpty && <SearchResultFilterModal
        isOpen={isFilterDrawerOpen}
        onDismiss={setIsFIlterDrawerOpen}
      />}
      {isHtmlContentViewerModalOpen && <HtmlContentViewerModal
        selectedCardData={selectedCardData}
        isOpen={isHtmlContentViewerModalOpen}
        onDismiss={() => dispatch(setIsOpenHtmlContentViewerModal(false))}
      />}
      {isPdfViewerOpen && <PdfViewerModal
        isOpen={isPdfViewerOpen}
        onDismiss={() => dispatch(setIsOpenPdfContentViewerModal(false))}
        selectedCardData={selectedCardData}
        initialSearchQuery={enteredText}
        additionalItems={selectedCardData.cardData.additionalItems || []}

      />}

      {isVideoContentViewerModalOpen && <VideoContentViewerModal
        selectedCardData={selectedCardData}
        isOpen={isVideoContentViewerModalOpen}
        onDismiss={() => dispatch(setIsVideoContentViewerModalOpen(false))}
      />}

    </div>
  );
};

export default IntelligentSearchScreen;
