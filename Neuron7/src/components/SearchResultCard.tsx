import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { useMediaQuery } from "react-responsive";
import LikeIcon from "../assets/icons/Like.svg";
import DislikeIcon from "../assets/icons/Dis-Like.svg";
import Chevronup from "../assets/icons/Chevron-up.svg";
import Chevrondown from "../assets/icons/Chevron-down.svg";
import ExpandableText from "./ExpandableText";
import LikeActiveIcon from "../assets/icons/like-active.svg";
import DislikeActiveIcon from "../assets/icons/dislike-active.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import {
  setIsNegativeFeedbackModalOpen,
  setIsOpenHtmlContentViewerModal,
  setIsOpenPdfContentViewerModal,
  setIsVideoContentViewerModalOpen,
  toggleAdditionalResultDislike,
  toggleAdditionalResultLike,
  toggleCardDislike,
  toggleCardLike,
} from "../Redux/Slices/intelligentSearchSlice";
import { SagaIntelligentSearchActionType } from "../Redux/Sagas/inteliigentSearchActions";
import { useAuth } from "../context/AuthContext";
import { getFileTypeFromUrl } from "../util/searchResultUtil";

const useStyles = makeStyles({
  cardContainer: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#FFF",
    boxShadow:
      "0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
    width: "100%",
    marginBottom: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100vw",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth:'100vw'
  },
  fileIconContainer: {
    marginRight: "8px",
  },
  fileTitleContainer: {
    color: "#424242",
    fontFamily: "Lato",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100vw",
    wordBreak: "break-all",
    width: "100%", 
    display: "block",
  },
  fileNameContainer: {
    color: "#8F8F8F",
    fontFamily: "Lato",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100vw",  
    width:'100%',
  },
  subtextRootContainer: {
    fontSize: "14px",
    fontFamily: "Lato",
    fontWeight: "400",
    color: "#666",
    lineHeight: "20px",
    width: "100%",
    marginTop: "16px",
  },
  subtextContainer: {
    display: "flex",
    alignItems: "end",
    gap: "8px",
    width:'100%',
    overflow:'hidden'
  },
  subTextDiv: {
    display: "flex",
    alignItems: "end",
    flex: 1,
    textOverflow: "ellipsis",
    maxWidth: "100vw",  
    width:'100%',
    whiteSpace: "normal",           
    wordBreak: "break-word",        
    overflowWrap: "break-word",     
    overflow: "hidden",
  },
  seeMoreButton: {
    color: "#0F6CBD",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "Lato",
    lineHeight: "20px",
    whiteSpace: "nowrap",
    marginLeft: "2px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "8px",
    alignSelf: "end",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "end",
  },
  likeIcon: {
    color: "green",
    fontSize: "20px",
  },
  dislikeIcon: {
    color: "red",
    fontSize: "20px",
  },
  additionalResultsContainer: {
    backgroundColor: "#F4F4F4",
    borderRadius: "4px",
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    maxHeight: "300px",
    boxShadow:
      "0px 1px 2px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
    overflowY: "auto",
    overflowX: "hidden",
    width: "100%",
    maxWidth:'100vw'
  },
  additionalResultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: "16px",
    fontFamily: "Lato",
    paddingLeft: "8px",
    paddingRight: "8px",
    cursor: "pointer",
    color: "#616161",
    backgroundColor: "#F4F4F4",
    height: "36px",
     width: "100%",
    maxWidth:'100vw'
  },
  additionalContent: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "8px",
    paddingRight: "8px",
    maxHeight: "150px",
    overflowY: "auto",
    overflowX: "hidden",
    width: "100%",
  },
  additionalResultsHeaderContainer: {
    marginBottom: "5px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100vw",
     width: "100%",
  },
  additionalResultsTitle: {
    color: "#424242",
    fontSize: "14px",
    fontFamily: "Lato",
    fontWeight: "600",
    lineHeight: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100vw",
  },
  additionalResultSubTitle: {
    color: "#808080",
    fontSize: "12px",
    fontFamily: "Lato",
    fontWeight: "700",
    lineHeight: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100vw",
  },
  contentSubtext: {
    fontSize: "14px",
    fontFamily: "Lato",
    lineHeight: "20px",
    fontWeight: "400",
    color: "#666",
  },
  feedbackSectionContainer: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    justifyContent: "flex-end",
  },
  chevronIconContainer: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
  additionalResultCardSection: {
    paddingTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // height: "378px",
  },
});
interface CardComponentProps {
  icon: React.ReactNode;
  cardData: any;
  title: string;
  fileName: string;
  subtext: string;
  additionalItems: any;
  setIsContentViewerModalOpen: Dispatch<SetStateAction<boolean>>; // Added prop for ContentViewerModal
  setSelectedCardData: Dispatch<SetStateAction<any>>; // Added to pass data for modal
}

const CardComponent: React.FC<CardComponentProps> = ({
  icon,
  cardData,
  title,
  fileName,
  subtext,
  additionalItems,
  setIsContentViewerModalOpen,
  setSelectedCardData, // Added prop for setting modal data
}) => {
  const styles = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResultsExpanded, setIsResultsExpanded] = useState(false);
  const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });
  const liked = useSelector(
    (state: RootState) =>
      state.intelligentSearch.cardLikes[cardData.id] || false
  );
  const disliked = useSelector(
    (state: RootState) =>
      state.intelligentSearch.cardDislikes[cardData.id] || false
  );
  const additionalResultLikes = useSelector(
    (state: RootState) => state.intelligentSearch.additionalResultLikes
  );
  const additionalResultDislikes = useSelector(
    (state: RootState) => state.intelligentSearch.additionalResultDislikes
  );
  const isNegativeFeedbackPushed = useSelector(
    (state: RootState) => state.intelligentSearch.isNegativeFeedbackPushed
  );
  const cardLikes = useSelector(
    (state: RootState) => state.intelligentSearch.cardLikes)
  const cardDislikes = useSelector(
    (state: RootState) => state.intelligentSearch.cardDislikes)
  const dispatch = useDispatch();
  const { token,baseUrl } = useAuth();
  // Function to open content viewer modal
  const handleTitleClick = () => {
    // Set the data that will be passed to the modal
    const fileType=getFileTypeFromUrl( cardData.source_file_url|| cardData.page_html_link)
    setSelectedCardData({
      title,
      fileName,
      content: subtext,
      fileUrl: cardData.source_file_url|| cardData.page_html_link,
      cardData
    });
    setIsContentViewerModalOpen(true); 
    if(fileType==="html"){
      dispatch(setIsOpenHtmlContentViewerModal(true))
      if (token && baseUrl) {
      dispatch({
        type: SagaIntelligentSearchActionType.getHtmlContent, 
       payload:{ fileName: fileName,
        token: token,baseUrl:baseUrl}})
       }
    } else if (fileType === "pdf") {
      dispatch(setIsOpenPdfContentViewerModal(true))
      dispatch({
        type: SagaIntelligentSearchActionType.getBlobStorageSASToken, 
       payload:{token: token,baseUrl:baseUrl}})
      }
    else if(fileType==="mp4"){
    dispatch(setIsVideoContentViewerModalOpen(true))
    dispatch({
      type: SagaIntelligentSearchActionType.getBlobStorageSASToken, 
     payload:{token: token,baseUrl:baseUrl}})
    }
  
  };

  ///This will ensure that if negative feedback is pushed it will open the Feedback modal

  useEffect(() => {
    if (isNegativeFeedbackPushed) {
      dispatch(setIsNegativeFeedbackModalOpen(true))
    }
  }, [isNegativeFeedbackPushed]);

  const handleOnCardLikeClick = () => {
if(!cardLikes[cardData.id]){
    dispatch(toggleCardLike(cardData.id));
    if (token && baseUrl) {
    dispatch({
      type: SagaIntelligentSearchActionType.pushPositiveFeedback,
      payload: {
        text: cardData.text,
        name:cardData.name,
        answer: cardData.answer,
        answerSegment: cardData.answerSegment,
        score: cardData.score,
        file_metadata: cardData.file_metadata,
        feedback_id: cardData.id,
        file_url: cardData.file_url,
        source_file_url: cardData.source_file_url,
        page_html_link: cardData.page_html_link,
        page_no: cardData.page_no,
        total_pages: cardData.total_pages,
        token: token,
        baseUrl
      },
    });
  }
  };
}
  const handleOnCardDislikeClick = () => {
    if(!cardDislikes[cardData.id]){
    dispatch(toggleCardDislike(cardData.id));
    if (token && baseUrl) {
    dispatch({
      type: SagaIntelligentSearchActionType.pushNegativeFeedback,
      payload: { text: cardData.text, feedback_id: cardData.id, token: token,baseUrl },
    });
  }
  };
}
  const handleAdditionalResultLikeClick = (result: any) => {
    if(!additionalResultLikes[result.id]){
    dispatch(toggleAdditionalResultLike(result.id));
    if (token && baseUrl) {
    dispatch({
      type: SagaIntelligentSearchActionType.pushPositiveFeedback,
      payload: {
        text: result.text,
        name: result.name,
        answer: result.answer,
        answerSegment: result.answerSegment,
        score: result.score,
        file_metadata: result.file_metadata,
        feedback_id: result.id,
        file_url: result.file_url,
        source_file_url: result.source_file_url,
        pageHtmlLink: result.page_html_link,
        page_no: result.page_no,
        total_pages: result.total_pages,
        token: token,
        baseUrl
      },
    });
  }
  }
  };
  const handleAdditionalResultDislikeClick = (result: any) => {
    if(!additionalResultDislikes[result.id]){
    dispatch(toggleAdditionalResultDislike(result.id));
    if (token && baseUrl) {
    dispatch({
      type: SagaIntelligentSearchActionType.pushNegativeFeedback,
      payload: { text: result.text, feedback_id: result.id, token: token,baseUrl },
    });
  }
  }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <div className={styles.fileIconContainer}>{icon}</div>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width:'100%',
            maxWidth:'100vw'
          }}
        >
          <div
            className={styles.fileTitleContainer}
            onClick={handleTitleClick}
            style={{ cursor: "pointer" }}
          >
            {title}
          </div>
          <div className={styles.fileNameContainer}>{fileName}</div>
        </div>
      </div>
      <div className={styles.subtextRootContainer}>
        <div className={styles.subtextContainer}>
          <div className={styles.subTextDiv}>
            <ExpandableText text={subtext} />
          </div>
        </div>
        <div className={styles.feedbackSectionContainer}>
          <button
            className={mergeClasses(styles.iconButton, styles.likeIcon)}
            onClick={() => handleOnCardLikeClick()}
          >
            <img
              src={!liked ? LikeIcon : LikeActiveIcon}
              alt="Like Icon"
              width="20"
              height="20"
            />
          </button>
          <button
            className={mergeClasses(styles.iconButton, styles.dislikeIcon)}
            onClick={() => handleOnCardDislikeClick()}
          >
            <img
              src={!disliked ? DislikeIcon : DislikeActiveIcon}
              alt="Dislike Icon"
              width="20"
              height="20"
            />
          </button>
        </div>
      </div>
      {/* Additional Results Section */}
      {additionalItems.length > 0 && (
        <div className={styles.additionalResultsContainer}>
          <div
            className={styles.additionalResultsHeader}
            onClick={() => setIsResultsExpanded(!isResultsExpanded)}
          >
            {"Additional Results From This File"}
            <div>
              <button
                className={styles.chevronIconContainer}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <img
                  src={isResultsExpanded ? Chevronup : Chevrondown}
                  alt="chevron Icon"
                  width="20"
                  height="20"
                />
              </button>
            </div>
          </div>
          {isResultsExpanded && (
            <div className={styles.additionalContent}>
              {additionalItems?.map((result: any, index: number) => {
                const isLiked = additionalResultLikes[result.id] || false;
                const isDisliked = additionalResultDislikes[result.id] || false;
                return (
                  <div
                    style={{
                      borderBottom:
                        index !== additionalItems.length - 1
                          ? "1px solid #D2D0CE"
                          : "none",
                    }}
                    className={styles.additionalResultCardSection}
                    key={result.id}
                  >
                    {/* <div className={styles.additionalResultsHeaderContainer}>
                    <div
                      className={styles.additionalResultsTitle}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: !isMobileView ? "100%" : "420px",
                      }}
                    >
                      {result.answerSegment}
                    </div>
                    <div className={styles.additionalResultSubTitle}>
                      {result.filename}
                    </div>
                  </div> */}

                    <div className={styles.contentSubtext}>
                      <ExpandableText text={result.answerSegment} />
                    </div>

                    <div className={styles.buttonContainer}>
                      <button
                        className={mergeClasses(
                          styles.iconButton,
                          styles.likeIcon
                        )}
                        onClick={() => handleAdditionalResultLikeClick(result)}
                      >
                        <img
                          src={!isLiked ? LikeIcon : LikeActiveIcon}
                          alt="Like Icon"
                          width="20"
                          height="20"
                        />
                      </button>
                      <button
                        className={mergeClasses(
                          styles.iconButton,
                          styles.dislikeIcon
                        )}
                        onClick={() =>
                          handleAdditionalResultDislikeClick(result)
                        }
                      >
                        <img
                          src={!isDisliked ? DislikeIcon : DislikeActiveIcon}
                          alt="Like Icon"
                          width="20"
                          height="20"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardComponent;
