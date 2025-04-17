import React from "react";
import { ContentModalWrapper } from "./ContentModalWrapper";
import { useMediaQuery } from "react-responsive";
import { makeStyles, Spinner } from "@fluentui/react-components";
import { getFileIcon } from "../../util/searchResultUtil";
import DislikeIcon from "../../assets/icons/Dis-Like.svg";
import LikeIcon from "../../assets/icons/Like.svg";
import CloseIcon from "../../assets/icons/close-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import { setIsDislikedHtmlContent, setIsLikedHtmlContent } from "../../Redux";
import LikeActiveIcon from '../../assets/icons/like-active.svg'
import DislikeActiveIcon from '../../assets/icons/dislike-active.svg'
import { SagaIntelligentSearchActionType } from "../../Redux/Sagas/inteliigentSearchActions";
import { useAuth } from "../../context/AuthContext";
interface ModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    selectedCardData: any;
}

export const HtmlContentViewerModal = ({
    isOpen,
    onDismiss,
    selectedCardData
}: ModalProps) => {
    const styles = useStyles();
    const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });
    const htmlConetent = useSelector(
        (state: RootState) => state.intelligentSearch.htmlContent
    );
    const isLoadingHtmlContent = useSelector(
        (state: RootState) => state.intelligentSearch.isLoadingHtmlContent
    );
    const isErrorLoadingHtmlCOntent = useSelector(
        (state: RootState) => state.intelligentSearch.isErrorGettingHtmlContent
    );
    const likedHtmlCOntent = useSelector(
        (state: RootState) => state.intelligentSearch.likedHtmlContent
    );
    const dislikedHtmlContent = useSelector(
        (state: RootState) => state.intelligentSearch.dislikedHtmlContent
    );
    const dispatch = useDispatch()
    const { token, baseUrl } = useAuth()
    const handleLikeClick = () => {
        if (!likedHtmlCOntent) {
            dispatch(setIsLikedHtmlContent(true))
            dispatch(setIsDislikedHtmlContent(false))
            if (token && baseUrl) {
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
                        baseUrl
                    },
                });
            }
        }
    };
    const handleDislikeClick = () => {
        if (!dislikedHtmlContent) {
            dispatch(setIsLikedHtmlContent(false))
            dispatch(setIsDislikedHtmlContent(true))
            if (token && baseUrl) {
                dispatch({
                    type: SagaIntelligentSearchActionType.pushNegativeFeedback,
                    payload: { text: selectedCardData.cardData.text, feedback_id: selectedCardData.cardData.id, token: token, baseUrl },
                });
            }
        }
    };
    return (
        <ContentModalWrapper isOpen={isOpen} onDismiss={() => onDismiss()}>
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
                            onClick={() => onDismiss()}
                        >
                            <img src={CloseIcon} alt="Search Icon" width="20" height="20" />
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {isErrorLoadingHtmlCOntent && (
                        <div className={styles.errorContainer}>
                            {"Error loading html content..."}
                        </div>
                    )}
                    {isLoadingHtmlContent && (
                        <div className={styles.errorContainer}>
                            {"Loading html content..."}
                        </div>
                    )}

                    <div dangerouslySetInnerHTML={{ __html: htmlConetent }} />
                </div>
                <div className={styles.footer}>
                    {!isMobileView && <span className={styles.staticText}>
                        {"Would you recommend this result to colleague? "}
                    </span>}
                    <button
                        className={styles.fileIcon}
                        style={{ marginRight: "8px" }}
                        onClick={() => handleLikeClick()}
                    >
                        <img src={likedHtmlCOntent ? LikeActiveIcon : LikeIcon} alt="Like Icon" width="20" height="20" />
                    </button>
                    <button
                        className={styles.fileIcon}
                        onClick={() => handleDislikeClick()}
                    >
                        <img src={dislikedHtmlContent ? DislikeActiveIcon : DislikeIcon} alt="Dislike Icon" width="20" height="20" />
                    </button>
                </div>
            </div>
        </ContentModalWrapper>
    );
};

const useStyles = makeStyles({
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
    header: {
        backgroundColor: "#F9F9F9",
        borderBottom: "1px solid #CCC",
        flexShrink: 0,
        padding: "0px 20px 0px 26px",
        height: "70px",
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        zIndex: 100,
        width: '100%',
        maxWidth: '100vw'
    },
    footer: {
        padding: "8px 16px 8px 0px",
        backgroundColor: "#F9F9F9",
        borderTop: "1px solid #CCC",
        display: "flex",
        justifyContent: "flex-end",
        flexShrink: 0,
        zIndex: 100,
    },
    content: {
        flexGrow: 1,
        overflowY: "auto",
        color: "#666",
        padding: "0px 30px",
        WebkitOverflowScrolling: "touch", // Smooth scrolling for iOS
        touchAction: "auto", // Allow vertical pan gesture with one finger
        maxHeight: "100%",
        overscrollBehavior: 'contain',
        height: "100%", // Ensure content takes full height
        position: "relative",  // Prevents scroll chaining to background       
    },
    fileIconContainer: { display: "flex", alignItems: "center" },
    fileTitleContainer: {
        marginLeft: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: '100%',
        maxWidth: '100vw',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
        width: '100%',
        maxWidth: '100vw',
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
