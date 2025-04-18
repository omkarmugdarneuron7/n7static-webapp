import React, { useEffect, useRef, useState } from "react";
import { ContentModalWrapper } from "./ContentModalWrapper";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@fluentui/react-components";
import { getFileIcon } from "../../util/searchResultUtil";
import DislikeIcon from "../../assets/icons/Dis-Like.svg";
import LikeIcon from "../../assets/icons/Like.svg";
import CloseIcon from "../../assets/icons/close-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import LikeActiveIcon from "../../assets/icons/like-active.svg";
import DislikeActiveIcon from "../../assets/icons/dislike-active.svg";
import { useAuth } from "../../context/AuthContext";
import DownloadIcon from "../../assets/icons/arrow-download.svg";
import CopyIcon from "../../assets/icons/copy.svg";
import { RootState } from "../../Redux/Store";
import {
  setIsDislikedVideoContent,
  setIsLikedVideoContent,
  setVideoTranscriptData,
} from "../../Redux";
import { SagaIntelligentSearchActionType } from "../../Redux/Sagas/inteliigentSearchActions";
import ReactPlayer from "react-player";
import { downloadVideoFile } from "../../services/IntelligentSearchService";
interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCardData: any;
}

export const VideoContentViewerModal = ({
  isOpen,
  onDismiss,
  selectedCardData,
}: ModalProps) => {
  const styles = useStyles();
  const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });
  const playerRef = useRef<any>(null);
  const transcriptRefs = useRef<(HTMLDivElement | null)[]>([]);
  const likedVideoContent = useSelector(
    (state: RootState) => state.intelligentSearch.likedVideoContent
  );
  const dislikedVideoContent = useSelector(
    (state: RootState) => state.intelligentSearch.dislikedVideoContent
  );
  const azureBlobSASToken = useSelector(
    (state: RootState) => state.intelligentSearch.azureBlobSASToken
  );
  const videoTranscriptData = useSelector(
    (state: RootState) => state.intelligentSearch.videoTranscriptData
  );
  const dispatch = useDispatch();
  const { token, baseUrl } = useAuth();
  const [videoUrl, setVideoUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  useEffect(() => {
    if (azureBlobSASToken.length > 0) {
      setVideoUrl(`${selectedCardData.cardData.file_url}?${azureBlobSASToken}`);
      if (azureBlobSASToken && selectedCardData.cardData?.transcript_url) {
        dispatch({
          type: SagaIntelligentSearchActionType.fetchVideoTranscript,
          payload: {
            fileUrl: `${selectedCardData.cardData?.transcript_url}?${azureBlobSASToken}`,
          },
        });
      }
    }
  }, [azureBlobSASToken]);

  const handleLikeClick = () => {
    if (!likedVideoContent) {
      dispatch(setIsLikedVideoContent(true));
      dispatch(setIsDislikedVideoContent(false));
      dispatch({
        type: SagaIntelligentSearchActionType.pushPositiveFeedback,
        payload: {
          text: selectedCardData.cardData.text,
          name: selectedCardData.cardData.name,
          answer: selectedCardData.cardData.answer,
          answerSegment: selectedCardData.cardData.answerSegment,
          score: selectedCardData.cardData.score,
          file_metadata: selectedCardData.cardData.file_metadata,
          feedback_id: selectedCardData.cardData.id,
          file_url: selectedCardData.cardData.file_url,
          source_file_url: selectedCardData.cardData.source_file_url,
          page_html_link: selectedCardData.cardData.page_html_link,
          page_no: selectedCardData.cardData.page_no,
          total_pages: selectedCardData.cardData.total_pages,
          token: token,
          baseUrl,
        },
      });
    }
  };

  const handleDislikeClick = () => {
    if (!dislikedVideoContent) {
      dispatch(setIsLikedVideoContent(false));
      dispatch(setIsDislikedVideoContent(true));
      dispatch({
        type: SagaIntelligentSearchActionType.pushNegativeFeedback,
        payload: {
          text: selectedCardData.cardData.text,
          feedback_id: selectedCardData.cardData.id,
          token: token,
          baseUrl,
        },
      });
    }
  };

  const timeToSeconds = (time: string) => {
    const [h, m, s] = time.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  useEffect(() => {
    const activeIndex = videoTranscriptData.findIndex((entry) => {
      const startSec = timeToSeconds(entry.start as string);
      const endSec = timeToSeconds(entry.end as string);
      return currentTime >= startSec && currentTime <= endSec;
    });

    if (activeIndex !== -1 && transcriptRefs.current[activeIndex]) {
      transcriptRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime, videoTranscriptData]);

  const handleCopy = async () => {
    const url = `${selectedCardData.cardData.file_url}?${azureBlobSASToken}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleTranscriptClick = (startTime: string) => {
    const seconds = timeToSeconds(startTime);
    playerRef.current?.seekTo(seconds, "seconds");
  };

  return (
    <ContentModalWrapper
      isOpen={isOpen}
      onDismiss={() => {
        dispatch(setVideoTranscriptData([]));
        onDismiss();
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.fileIconContainer}>
            <button className={styles.fileIcon}>
              <img
                src={getFileIcon(selectedCardData.fileUrl)?.icon ?? ""}
                alt="icon"
                width="38"
                height="38"
              />
            </button>
          </div>
          <div className={styles.fileTitleContainer}>
            <div
              className={styles.fileTitle}
            >
              {selectedCardData.title}
            </div>
            <div className={styles.fileName}>{selectedCardData.fileName}</div>
          </div>
          <div className={styles.closeIconContainer}>
            <button
              className={styles.fileIcon}
              onClick={() => {
                dispatch(setVideoTranscriptData([]));
                onDismiss();
              }}
            >
              <img src={CloseIcon} alt="Search Icon" width="20" height="20" />
            </button>
          </div>
        </div>

        <div
          className={styles.content}
          style={{
            flexDirection: isMobileView ? "column" : "row",
          }}
        >
          <div className={styles.videoContainer}>
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              controls
              width={isMobileView ? "100%" : "840px"}
              height={isMobileView ? "206px" : "468px"}
              playing={true}
              onStart={() => {
                playerRef.current?.seekTo(
                  selectedCardData?.cardData?.startTime ?? 0,
                  "seconds"
                );
              }}
              onProgress={handleProgress}
              style={{
                marginTop: isMobileView ? "0px" : "16px",
                marginLeft: isMobileView ? "0px" : "16px",
                backgroundColor: "#D9D9D9",
                borderRadius: "16px !important",
              }}
            />
          </div>

          {videoTranscriptData.length > 0 && (
            <div
              style={{
                width: isMobileView ? "100%" : "356px",
                borderLeft: isMobileView ? "none" : "1px solid #D2D0CE",
              }}
              className={styles.videoTranscriptContainer}
            >
              <div
                style={{ fontSize: isMobileView ? "14px" : "20px" }}
                className={styles.transcriptText}
              >
                {"Transcript"}
              </div>

              <div className={styles.transcriptDataContainer}>
                {videoTranscriptData.length > 0 &&
                  videoTranscriptData.map((entry, i) => {
                    const startSec = timeToSeconds(entry.start as string);
                    const endSec = timeToSeconds(entry.end as string);
                    const isActive =
                      currentTime >= startSec && currentTime <= endSec;

                    return (
                      <div
                        key={i}
                        onClick={() =>
                          handleTranscriptClick(entry.start as string)
                        }
                        ref={(el) => (transcriptRefs.current[i] = el)}
                        style={{
                          marginBottom: "8px",
                          transition: "background-color 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <div className={styles.timeContainer}>
                          {entry.start} - {entry.end}
                        </div>
                        <div
                          className={styles.textContainer}
                          style={{
                            backgroundColor: isActive ? "#ff0" : "#F9F9F9",
                          }}
                        >
                          {entry.text}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <button
              className={styles.copyIcon}
              style={{ marginRight: "8px" }}
              // onClick={() => handleCopy()}
            >
              <img src={CopyIcon} alt="Like Icon" width="20" height="20" />
            </button> */}
            <button
              className={styles.copyIcon}
              onClick={() => {
                  downloadVideoFile(videoUrl);
              }}
            >
              <img src={DownloadIcon} alt="Like Icon" width="20" height="20" />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {!isMobileView && (
              <span className={styles.staticText}>
                {"Would you recommend this result to colleague? "}
              </span>
            )}
            <button
              className={styles.fileIcon}
              style={{ marginRight: "8px" }}
              onClick={() => handleLikeClick()}
            >
              <img
                src={likedVideoContent ? LikeActiveIcon : LikeIcon}
                alt="Like Icon"
                width="20"
                height="20"
              />
            </button>
            <button
              className={styles.fileIcon}
              onClick={() => handleDislikeClick()}
            >
              <img
                src={dislikedVideoContent ? DislikeActiveIcon : DislikeIcon}
                alt="Dislike Icon"
                width="20"
                height="20"
              />
            </button>
          </div>
        </div>
      </div>
    </ContentModalWrapper>
  );
};

const useStyles = makeStyles({
  videoContainer: {
    width: "100%",
    borderRadius: "16px",
  },
  transcriptText: {
    position: "sticky",
    top: 0,
    backgroundColor: "#F9F9F9",
    zIndex: 1,
    padding: "16px",
    fontWeight: "400",
    lineHeight: "20px",
    fontFamily: "Archivo",
    color: "#133378",
  },
  timeContainer: {
    fontWeight: "400",
    fontSize: "12px",
    fontFamily: "Source Sans Pro",
    color: "#858585",
    lineHeight: "normal",
  },
  textContainer: {
    fontWeight: "400",
    fontSize: "12px",
    fontFamily: "Source Sans Pro",
    lineHeight: "normal",
    color: "#383838",
  },
  videoTranscriptContainer: {
    backgroundColor: "#F9F9F9",
    padding: "0px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  transcriptDataContainer: { overflow: "auto", padding: "0px 14px 0px 24px" },
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
  },
  fileIcon: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
  },
  copyIcon: {
    background: "none",
    border: "1px solid #2868F7",
    cursor: "pointer",
    backgroundColor: "#F4F4F4",
    width: "32px",
    height: "32px",
    display: "flex",
    padding: "0px 12px",
    borderRadius: "20px",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#F9F9F9",
    borderBottom: "1px solid #CCC",
    flexShrink: 0,
    padding: "0px 20px 0px 26px",
    height: "70px",
    display: "flex",
    flexDirection: "row",
    width:'100%',
        maxWidth:'100vw'
  },
  footer: {
    padding: "8px 16px 8px 16px",
    backgroundColor: "#F9F9F9",
    borderTop: "1px solid #CCC",
    display: "flex",
    justifyContent: "space-between",
  },
  content: {
    flexGrow: 1,
    overflowY: "auto",
    color: "#666",
    display: "flex",
    height: "100%",
    WebkitOverflowScrolling: "touch", // Smooth scrolling for iOS
    touchAction: "auto", // Allow vertical pan gesture with one finger
    maxHeight: "100%",
    overscrollBehavior: 'contain',
    position: "relative",
  },
  fileIconContainer: { display: "flex", alignItems: "center" },
  fileTitleContainer: {
    marginLeft: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width:'100%',
        maxWidth:'100vw'
  },
  fileTitle: {
    color: "#133378",
    fontFamily: "Archivo",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "20px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
    width:'100%',
        maxWidth:'100vw'
  },
  fileName: {
    color: "#858585",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: "20px",
    fontFamily: "Source Sans Pro",
  },
  closeIconContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-end",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  staticText: {
    marginRight: "8px",
    color: "#757575",
    fontSize: "12px",
    fontWeight: "600",
    lineHeight: "20px",
    fontFamily: "Archivo",
  },
});
