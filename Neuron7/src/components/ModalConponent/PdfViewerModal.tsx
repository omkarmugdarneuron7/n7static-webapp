import React, { useState, useEffect } from "react";
import { ContentModalWrapper } from "./ContentModalWrapper";
import { useMediaQuery } from "react-responsive";
import { makeStyles, mergeClasses, Spinner, Input, Button, Accordion, AccordionItem, AccordionHeader, AccordionPanel, shorthands, } from "@fluentui/react-components";
import { getFileIcon } from "../../util/searchResultUtil";
import DislikeIcon from "../../assets/icons/Dis-Like.svg";
import LikeIcon from "../../assets/icons/Like.svg";
import CloseIcon from "../../assets/icons/close-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";
import { setIsDislikedPdfContent, setIsLikedPdfContent } from "../../Redux";
import LikeActiveIcon from '../../assets/icons/like-active.svg'
import DislikeActiveIcon from '../../assets/icons/dislike-active.svg'
import { SagaIntelligentSearchActionType } from "../../Redux/Sagas/inteliigentSearchActions";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeftFilled, ChevronRightFilled, SearchRegular } from '@fluentui/react-icons';
import DownloadIcon from '../../assets/icons/arrow-download.svg'
import AdditionalResultsIcon from '../../assets/icons/additional-results-icon.svg'
import CopyIcon from '../../assets/icons/copy.svg'
import {
    Viewer,
    Worker,
} from "@react-pdf-viewer/core";
import * as microsoftTeams from "@microsoft/teams-js";
import { pageNavigationPlugin, RenderCurrentPageLabelProps } from '@react-pdf-viewer/page-navigation';
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import {
    extractFileNameWithoutExtension,
} from "../../util/searchResultUtil";
interface ModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    selectedCardData: any;
    initialSearchQuery: string;
    additionalItems: any[];
}

export const PdfViewerModal = ({
    isOpen,
    onDismiss,
    additionalItems,
    selectedCardData,
    initialSearchQuery,
}: ModalProps) => {
    const styles = useStyles();
    const isMobileView = useMediaQuery({ query: "(max-width: 768px)" });
    const dispatch = useDispatch();
    const { token, baseUrl } = useAuth();

    const likedPdfContent = useSelector((state: RootState) => state.intelligentSearch.likedPdfContent);
    const dislikedPdfContent = useSelector((state: RootState) => state.intelligentSearch.dislikedPdfCOntent);
    const pdfNavigationResult = useSelector((state: RootState) => state.intelligentSearch.pdfNavContent);
    const pdfSearchQueryResult = useSelector((state: RootState) => state.intelligentSearch.fileSearchData);
    const noResponseFromFileSearch = useSelector((state: RootState) => state.intelligentSearch.noResponseFromFileSearch);
    const isSearchingQueryInPdf = useSelector((state: RootState) => state.intelligentSearch.isSearchingQueryInPdf);
    const currentPage = Number(pdfNavigationResult?.pageNumber || selectedCardData.cardData.page_no);
    const azureBlobSASToken = useSelector((state: RootState) => state.intelligentSearch.azureBlobSASToken);
    const [data, setFileSearchData] = useState<any>({});
    const [query, setQuery] = useState(initialSearchQuery);
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const [error, setError] = useState<string | null>(null); // Error state
    const [selectedGroupItem, setSelectedGroupItem] = useState<any>(null); // State for selected group item
    const [tempData, setTempData] = useState<any>(null); // Temporary data for fallback navigation
    const [showMobileSearch, setShowMobileSearch] = useState(false); // State to toggle search and additional results

    const toggleMobileSearch = () => {
        setShowMobileSearch((prev) => !prev); // Toggle search and additional results
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() === "") {
            setError("Search Query is required");
            return;
        }
        setError(null);
        // Call the search function with the query
        onSearchWithFile(query, extractFileNameWithoutExtension(selectedCardData.cardData.source_file_url));
    };

    const onNavigatePage = (source_file_url: string, page_no: number) => {
        dispatch({
            type: SagaIntelligentSearchActionType.onNavigatePage,
            payload: {
                sourceFileUrl: source_file_url,
                pageNumber: Number(page_no),
                token: token,
                baseUrl: baseUrl
            },
        });
        setPageInput(Number(page_no));
    };

    // Reset state when the modal is closed
    const handleDismiss = () => {
        setQuery(initialSearchQuery); // Reset query to initial value
        setError(null); // Clear error messages
        setSubmitted(false); // Reset submitted state
        setSelectedGroupItem(null); // Reset selected group item
        setTempData(null); // Reset temporary data
        onDismiss(); // Call the parent-provided dismiss handler
    };

    //const isValidQueryResponse = pdfSearchQueryResult?.QueryResponse?.length > 0 && !isSearchingQueryInPdf && !noResponseFromFileSearch;
    const handleLikeClick = () => {
        if (!likedPdfContent) {
            dispatch(setIsLikedPdfContent(true));
            dispatch(setIsDislikedPdfContent(false));
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
    };
    const handleDislikeClick = () => {
        if (!dislikedPdfContent) {
            dispatch(setIsLikedPdfContent(false));
            dispatch(setIsDislikedPdfContent(true));
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

    const [pageInput, setPageInput] = useState(selectedCardData?.cardData?.page_no || 1);

    // Dynamically update the file URL with the latest navigation result
    const fileUrlWithSAS = pdfNavigationResult?.fileUrl
        ? `${pdfNavigationResult.fileUrl}?${azureBlobSASToken}`
        : `${selectedCardData.cardData.file_url}?${azureBlobSASToken}`;

    const downloadHTML = (url: string) => {
        const fileUrl = `${url}?${azureBlobSASToken}`;

        // Check if running inside Teams
        if (microsoftTeams) {
            microsoftTeams.executeDeepLink(fileUrl); // Open the file in Teams or browser
        } else {
            // Fallback for non-Teams environments
            const anchor = document.createElement('a');
            anchor.href = fileUrl;
            anchor.download = 'file.pdf'; // Specify a filename
            anchor.rel = 'noopener noreferrer'; // Add this for security
            document.body.appendChild(anchor); // Append to the DOM
            anchor.click(); // Trigger the download
            document.body.removeChild(anchor); // Remove the anchor after the click
        }
    };

    const [submitted, setSubmitted] = useState(false); // State to track form submission


    const onSearchWithFile = (text: string, filename: string) => {
        if (!filename) {
            setError("File Name Not Found");
            return;
        }
        if (text.trim() === "") {
            setError("Search Query is required");
            return;
        }
        setError(null);
        dispatch({
            type: SagaIntelligentSearchActionType.searchWithFile,
            payload: {
                text: text,
                filename: filename,
                token: token,
                baseUrl: baseUrl
            },
        });
    };

    const processResponseData = (data: any[], output: any[]) => {
        if (data?.length > 0) {
            data.forEach((item) => {
                let result = "";
                const index = item.answerSegment?.toLowerCase().indexOf(item.answer?.toLowerCase());
                if (index > -1) {
                    result =
                        item.answerSegment.substring(0, index) +
                        "<span class='highlight-txt'>" +
                        item.answerSegment.substring(index, index + item.answer.length) +
                        "</span>" +
                        item.answerSegment.substring(index + item.answer.length);
                } else {
                    result = item.answerSegment;
                }

                // Create a new object with the updatedText property
                const newItem = {
                    ...item, // Copy all existing properties
                    updatedText: result, // Add the updatedText property
                    table_as_json: item.table_as_json || undefined,
                    display_page_html_link: item.source_file_url
                        ? getSourceDisplayPageLink(item.source_file_url)
                        : getDisplayPageLink(item.page_html_link),
                };

                output.push(newItem); // Push the new object to the output array
            });
        }
    };

    const processResultData = (data: any[]) => {
        data.forEach((currentItem, currentIndex) => {
            if (currentItem["source_file_url"]) {
                if (!currentItem["groupResult"]) {
                    currentItem["groupResult"] = [];
                }
                if (currentItem["answer"] && currentItem["answerSegment"]) {
                    const matchingItems = data.filter((item, index) => {
                        return (
                            index !== currentIndex && // Exclude the current item
                            item["display_page_html_link"] === currentItem["display_page_html_link"]
                        );
                    });
                    currentItem["groupResult"].push(...matchingItems);

                    const remainingItems = data.filter(
                        (item) => !currentItem["groupResult"].includes(item)
                    );

                    data.length = 0;
                    data.push(...remainingItems);
                }
            }
        });
        return data;
    };

    const getSourceDisplayPageLink = (url: string) => {
        if (url) {
            const parts = url.split("/");
            return parts[parts.length - 1];
        }
    };

    const getDisplayPageLink = (url: string) => {
        if (url) {
            return url.split("#")[0];
        }
    };

    const onPdfSearchNavigate = (
        sourceFileUrl: string,
        pageNo: number,
    ) => {
        dispatch({
            type: SagaIntelligentSearchActionType.onNavigatePage,
            payload: {
                sourceFileUrl,
                pageNumber: pageNo,
                token,
                baseUrl,
            },
        });
    };

    const onAccordionItemClick = (selectedData: any, groupResult: any) => {
        const isSelected = selectedGroupItem === selectedData;

        if (isSelected) {
            setSelectedGroupItem(null); // Deselect the item
            if (tempData) {
                // Navigate to the fallback tempData
                onPdfSearchNavigate(tempData.source_file_url, tempData.page_no);
            }
        } else {
            setSelectedGroupItem(selectedData); // Select the new item
            if (selectedData.page_no !== selectedCardData.cardData.page_no) {
                // Navigate to the selected item's page
                onPdfSearchNavigate(selectedData.source_file_url, selectedData.page_no);
            }
        }
        // Hide the search and additional results in mobile view and show the PDF viewer
        if (isMobileView) {
            setShowMobileSearch(false);
        }
    };

    // Reset state when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setError(null); // Clear error messages
            setSubmitted(false); // Reset submitted state
            setQuery(initialSearchQuery); // Reset query to initial value
            setSelectedGroupItem(null); // Reset selected group item
            setTempData(null); // Reset temporary data
        }
    }, [isOpen]);

    useEffect(() => {
        if (pdfSearchQueryResult?.QueryResponse) {
            if (
                pdfSearchQueryResult.QueryResponse.length > 0 &&
                pdfSearchQueryResult.QueryResponse[0]?.answer?.toLowerCase() !== "no response" &&
                pdfSearchQueryResult.QueryResponse[0]?.answerSegment?.toLowerCase() !== "no response"
            ) {
                const tempFileResultData: any[] = [];
                processResponseData(pdfSearchQueryResult.QueryResponse, tempFileResultData);

                if (!pdfSearchQueryResult.QueryResponse || pdfSearchQueryResult.QueryResponse?.length === 0) {
                    processResponseData(pdfSearchQueryResult.KeywordSearchResponse, tempFileResultData);
                }

                const itemResult = processResultData(tempFileResultData);

                if (itemResult.length > 0 && selectedCardData.cardData.page_no !== Number(itemResult[0].page_no)) {
                    onPdfSearchNavigate(
                        itemResult[0].source_file_url,
                        itemResult[0].page_no,
                    );
                }
                // Hide the search and additional results in mobile view
                if (isMobileView) {
                    setShowMobileSearch(false);
                }
                setError(null);
            } else {
                setError("No response found");
            }
        }
    }, [pdfSearchQueryResult]);

    return (
        <ContentModalWrapper isOpen={isOpen} onDismiss={handleDismiss}>

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
                        <div className={styles.fileTitle} >
                            {selectedCardData.title}
                        </div>
                        <div className={styles.fileName}>{selectedCardData.fileName}</div>
                    </div>
                    <div className={styles.closeIconContainer}>
                        <button className={styles.fileIcon} onClick={onDismiss}>
                            <img src={CloseIcon} alt="Close Icon" width="20" height="20" />
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.containerInner}>

                        {/* PDF Viewer */}
                        {(!isMobileView || !showMobileSearch) && (
                            <div className={styles.pdfViewerContainer}>
                                <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
                                    <Viewer fileUrl={fileUrlWithSAS} plugins={[pageNavigationPluginInstance]} />
                                </Worker>
                            </div>
                        )}
                        {/* Search and Additional Results */}
                        {(isMobileView && showMobileSearch) || !isMobileView ? (

                            <div className={styles.searchFieldContainer}>
                                <form onSubmit={handleSearchSubmit}>
                                    <div className={styles.searchBarWrapper}>
                                        <Input
                                            value={query}
                                            className={mergeClasses(submitted && query.trim() === "" ? styles.errorText : "", styles.inputField)}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Search Query"
                                            appearance="outline"
                                            contentBefore={<SearchRegular />}
                                            contentAfter={<Button type="submit" className={styles.buttonField} appearance="primary">Find</Button>}
                                        />
                                    </div>
                                </form>

                                {error && <div className={styles.errorContainer}>{error}</div>}


                                {/* Additional Results */}
                                {additionalItems.length > 0 ? (
                                    <div>
                                        <div className={styles.resultsHeader}>Additional Results From This File</div>
                                        <Accordion collapsible>
                                            {additionalItems.map((item, index) => (
                                                <AccordionItem key={index} className={styles.additionalItem} value={index.toString()}>
                                                    <AccordionHeader expandIconPosition="end">{item.answer}</AccordionHeader>
                                                    <AccordionPanel>
                                                        <div
                                                            style={{ fontFamily: "Lato", fontSize: "14px", color: "#666", cursor: "pointer" }}
                                                            onClick={() => onAccordionItemClick(item, additionalItems)}
                                                        >
                                                            {item.answerSegment}
                                                        </div>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                ) : (
                                    <div className={styles.noResultsText}>No Additional Results</div>
                                )}
                            </div>
                        ) : null}



                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.footerLeftSection}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {/* <button
                                    className={styles.circleIcon}
                                    style={{ marginRight: "8px" }}
                                >
                                    <img src={CopyIcon} alt="Copy Icon" width="20" height="20" />
                                </button> */}
                            <button
                                className={styles.circleIcon}
                                style={{ marginRight: "8px" }}
                                onClick={() => downloadHTML(selectedCardData.cardData.source_file_url)}
                            >
                                <img src={DownloadIcon} alt="Download Icon" width="20" height="20" />
                            </button>
                            {isMobileView && (
                                <button className={styles.additionalResultsIcon} onClick={toggleMobileSearch}>
                                    <img src={AdditionalResultsIcon} alt="Additional Results Icon" width="32" height="32" />
                                </button>
                            )}
                        </div>
                        <div className={mergeClasses(
                            isMobileView ? styles.hideInMobile : "",
                            styles.navigationPanel
                        )} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Button
                                appearance="transparent"
                                disabled={currentPage === 1}
                                onClick={() => onNavigatePage(selectedCardData.cardData.source_file_url, 1)}
                            >
                                First
                            </Button>
                            <Button
                                appearance="transparent"
                                disabled={currentPage === 1}
                                onClick={() => onNavigatePage(selectedCardData.cardData.source_file_url, currentPage - 1)}
                            >
                                <ChevronLeftFilled className={styles.paginationIcon} />
                            </Button>
                            <span>{currentPage} Of {selectedCardData.cardData.total_pages}</span>
                            <Button
                                appearance="transparent"
                                disabled={currentPage === selectedCardData.cardData.total_pages}
                                onClick={() => onNavigatePage(selectedCardData.cardData.source_file_url, currentPage + 1)}
                            >
                                <ChevronRightFilled className={styles.paginationIcon} />
                            </Button>
                            <Button
                                appearance="transparent"
                                disabled={currentPage === selectedCardData.cardData.total_pages}
                                onClick={() => onNavigatePage(selectedCardData.cardData.source_file_url, selectedCardData.cardData.total_pages)}
                            >
                                Last
                            </Button>
                        </div>
                        <div className={isMobileView ? styles.hideInMobile : ""} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Go to page</span>
                            <Input
                                appearance="outline"
                                type="number"
                                className={styles.inputNumber}
                                min={1}
                                max={Number(selectedCardData.cardData.total_pages)}
                                onChange={(e) => {
                                    const page = Number(e.target.value);
                                    if (!isNaN(page) && page >= 1 && page <= Number(selectedCardData.cardData.total_pages)) {
                                        onNavigatePage(selectedCardData.cardData.source_file_url, page);
                                    }
                                }}
                                style={{ width: '80px' }}
                            />
                        </div>
                    </div>
                    <div className={styles.footerRightSection}>
                        <span className={mergeClasses(
                            isMobileView ? styles.hideInMobile : "",
                            styles.staticText
                        )}>
                            {"Would you recommend this result to colleague? "}
                        </span>
                        <button
                            className={styles.fileIcon}
                            style={{ marginRight: "8px" }}
                            onClick={handleLikeClick}
                        >
                            <img src={likedPdfContent ? LikeActiveIcon : LikeIcon} alt="Like Icon" width="20" height="20" />
                        </button>
                        <button
                            className={styles.fileIcon}
                            onClick={handleDislikeClick}
                        >
                            <img src={dislikedPdfContent ? DislikeActiveIcon : DislikeIcon} alt="Dislike Icon" width="20" height="20" />
                        </button>
                    </div>
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
    },
    footer: {
        padding: "8px 16px 8px 16px",
        backgroundColor: "#F9F9F9",
        borderTop: "1px solid #CCC",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    content: {
        flexGrow: 1,
        color: "#666",
        padding: "0px 30px",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch", // Smooth scrolling for iOS
        touchAction: "auto", // Allow vertical pan gesture with one finger
        maxHeight: "100%",
        overscrollBehavior: 'contain',
        height: "100%",
        position: "relative",
        "& .rpv-core__inner-pages": {
            overflow: "visible"
        },
        "& .rpv-core__page-layer": {
            width: "100% !important"
        },
        "@media only screen and (max-width: 768px)": {
            padding: "0px",
        },
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
    staticText: {
        marginRight: "8px",
        color: "#757575",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: "20px",
        fontFamily: "Archivo",
    },
    roundedInput: {
        "& .fui-Input": {
            border: "1px solid #bdbdbd",
            borderRadius: "24px",
            padding: "8px 10px 8px 16px",
        },
    },
    inputNumber: {
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "4px",
    },
    circleIcon: {
        border: "1px solid #2868F7",
        cursor: "pointer",
        width: "32px",
        height: "32px",
        display: "flex",
        borderRadius: '20px',
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
            color: "#2868F7",
            fill: "#2868F7",
        }
    },
    additionalResultsIcon: {
        background: "none",
        border: "none",
        padding: "0",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    navigationPanel: {
        "& .fui-Button": {
            minWidth: "auto"
        },
    },
    paginationIcon: {
        color: "#2868F7",
    },
    errorContainer: {
        display: "flex",
        justifyContent: "flexStart",
        color: "#CC4A31",
        marginBottom: "5px"
    },
    errorText: {
        color: "#CC4A31"
    },
    resultsHeader: {
        color: "#133378",
        fontFamily: "Lato",
        fontSize: "14px",
        fontWeight: "700",
        lineHeight: "20px",
    },
    searchBarWrapper: {
        display: "flex",
        alignItems: "center",
        borderRadius: "24px",
        gap: "0.5rem",
        flexDirection: 'column',
        width: "100%",
        maxWidth: "100%",
        height: "36px",
        border: "1px solid #bdbdbd",
    },
    inputField: {
        flexGrow: 1,
        height: "100%",
        padding: "0 0 0 10px",
        fontSize: "16px",// to prevent zoom in effect in ios mobile
        width: "100%",
        "& .fui-Input__contentBefore": {
            marginRight: "4px",
            "& svg": {
                fontSize: "15px",
            }
        },
        "& .fui-Input__contentAfter": {
            borderRadius: "24px",
            backgroundColor: "#0F6CBD",
            color: "#fff",
        }
    },
    buttonField: {
        height: "36px",
        fontSize: "14px",
        padding: "0 16px",
    },
    additionalItem: {
        borderBottom: "1px solid #D2D0CE",
        padding: "10px",
        "& .fui-AccordionHeader__button": {
            fontSize: "14px",
            fontWeight: "700",
            color: "#616161",
            fontFamily: "Lato",
        },
        "& .fui-AccordionHeader__expandIcon": {
            color: "#616161",
            fill: "#616161",
        },
        "& .fui-AccordionHeader": {
            marginBottom: "10px"
        },

    },
    containerInner: {
        display: "flex",
        height: "100%",
        "@media only screen and (max-width: 768px)": {
            flexDirection: "column",
            alignItems: "center",
        },
    },
    pdfViewerContainer: {
        flex: 1,
        "@media only screen and (max-width: 768px)": {
            width: "100%",
            marginBottom: "16px",
        },
    },
    searchFieldContainer: {
        width: "30%",
        padding: "8px 16px",
        "@media only screen and (max-width: 768px)": {
            width: "100%",
        },
    },
    footerLeftSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        "@media only screen and (max-width: 768px)": {
            width: "100%",
            marginBottom: "16px",
        },
    },
    footerRightSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "30%",
        gap: "0.5rem",
        rightSection: {
            "@media only screen and (max-width: 768px)": {
                width: "100%",
                marginBottom: "16px",
            },
        },
    },
    hideInMobile: {
        "@media only screen and (max-width: 768px)": {
            display: "none !important", // Hide the element on mobile screens
        },
    },
    fullScreenAccordion: {
        "@media only screen and (max-width: 768px)": {
            height: "100%",
            overflowY: "auto",
        },
    },
    buttonWrapper: {
        display: 'flex',
        margin: '10px 0 0 0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: "8px 16px"
    },
    additionalToggleButton: {
        color: "#0F6CBD", // Fluent blue
        border: "1px solid #0F6CBD",
        borderRadius: "24px",
        fontFamily: "Lato",
        fontSize: "14px",
        fontWeight: 400,
        padding: "8px 16px",
        backgroundColor: "transparent",
        width: "100%",
        textAlign: "center",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "#133378",
            color: "fff"
        },
        ":focus": {
            outline: "none",
        },
    },
    noResultsText: {
        marginTop: "8px",
        fontSize: "14px",
        color: "#757575", // Gray color for the text
        textAlign: "center",
        fontFamily: "Lato",
        width: "100%",
    },
    searchIcon: {
        fontSize: "20px",
        width: "20px",
        height: "20px",
    },
});