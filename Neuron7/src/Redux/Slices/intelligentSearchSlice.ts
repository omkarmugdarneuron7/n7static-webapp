import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VTTEntry {
    start?: string;
    end?: string;
    text?: string;
};
interface IntelligentSearchState {
    queryResult: any;
    isSearchingQueryResult: boolean;
    isSearchingQueryInPdf: boolean;
    isErrorGettingQueryResult: boolean;
    isErrorFetchingQueryInPdf: boolean;
    selectedFilters: { [key: string]: string[] };
    filteringData: any;
    fileSearchData: any;
    cardLikes: { [id: string]: boolean };
    cardDislikes: { [id: string]: boolean };
    additionalResultLikes: { [id: string]: boolean };
    additionalResultDislikes: { [id: string]: boolean };
    isPushingPositiveFeedback: boolean;
    isPositiveFeedbackPushed: boolean;
    isErrorPushingPositiveFeedback: boolean;
    isPushingNegativeFeedback: boolean;
    isNegativeFeedbackPushed: boolean;
    isErrorPushingNegativeFeedback: boolean;
    negativeFeedbackData: any;
    isPushingSpecificFeedback: boolean;
    isSpecificFeedbackPushed: boolean;
    isErrorPushingSpecificFeedback: boolean;
    specificFeedbackData: any;
    noResponseFromSearch: boolean;
    noResponseFromFileSearch: boolean;
    htmlContent: string;
    isLoadingHtmlContent: boolean;
    isErrorGettingHtmlContent: boolean;
    isHtmlContentViewerModalOpen: boolean;
    isPdfViewerOpen: boolean;
    likedHtmlContent: boolean;
    dislikedHtmlContent: boolean;
    isNegativeFeedbackModalOpen: boolean;
    feedbackText: string;
    isVideoContentViewerModalOpen: boolean;
    likedVideoContent: boolean;
    dislikedVideoContent: boolean;
    likedPdfContent:boolean;
    dislikedPdfCOntent:boolean;
    azureBlobSASToken:string;
    pdfNavContent: any;
    videoTranscriptData: VTTEntry[]
}

const initialState: IntelligentSearchState = {
    queryResult: [],
    isSearchingQueryResult: false,
    isSearchingQueryInPdf: false,
    isErrorGettingQueryResult: false,
    isErrorFetchingQueryInPdf: false,
    selectedFilters: {},
    filteringData: [],
    fileSearchData: {},
    cardLikes: {},
    cardDislikes: {},
    additionalResultLikes: {},
    additionalResultDislikes: {},
    isPushingPositiveFeedback: false,
    isPositiveFeedbackPushed: false,
    isErrorPushingPositiveFeedback: false,
    isPushingNegativeFeedback: false,
    isNegativeFeedbackPushed: false,
    isErrorPushingNegativeFeedback: false,
    negativeFeedbackData: {},
    isPushingSpecificFeedback: false,
    isSpecificFeedbackPushed: false,
    isErrorPushingSpecificFeedback: false,
    specificFeedbackData: {},
    noResponseFromSearch: false,
    noResponseFromFileSearch: false,
    htmlContent: "",
    isLoadingHtmlContent:false,
    isErrorGettingHtmlContent:false,
    isHtmlContentViewerModalOpen:false,
    isPdfViewerOpen: false,
    likedHtmlContent: false,
    dislikedHtmlContent: false,
    isNegativeFeedbackModalOpen: false,
    feedbackText: "",
    isVideoContentViewerModalOpen: false,
    likedVideoContent: false,
    dislikedVideoContent: false,
    azureBlobSASToken:'',
    pdfNavContent: null,
    videoTranscriptData: [],
    likedPdfContent:false,
    dislikedPdfCOntent:false,
};

export const intelligentSearchSlice = createSlice({
    name: "intelligentSearch",
    initialState,
    reducers: {
        setSearchedQueryResult: (state, action) => {
            console.log("here", action.payload);

            state.queryResult = action.payload;

            // Normalize the text to lowercase for consistent comparison
            const answer = state.queryResult?.QueryResponse[0]?.answer?.toLowerCase();
            if (answer === "no response") {
                state.noResponseFromSearch = true;
            } else {
                state.noResponseFromSearch = false;
            }
        },
        setFileSearchData: (state, action) => {
            state.fileSearchData = action.payload;

            // Normalize the text to lowercase for consistent comparison
            const answer = state.fileSearchData?.QueryResponse[0]?.answer?.toLowerCase();
            if (answer === "no response") {
                state.noResponseFromFileSearch = true;
            } else {
                state.noResponseFromFileSearch = false;
            }
        },
        setIsSearchingQueryResult: (state, action) => {
            state.isSearchingQueryResult = action.payload;
        },
        setIsSearchingTextInPdf: (state, action) => {
            state.isSearchingQueryInPdf = action.payload;
        },
        setIsErrorGettingQueryResult: (state, action) => {
            state.isErrorGettingQueryResult = action.payload;
        },
        setIsErrorGettingTextInPdf: (state, action) => {
            state.isErrorFetchingQueryInPdf = action.payload;
        },
        setFilters: (state, action: PayloadAction<{ [key: string]: string[] }>) => {
            state.selectedFilters = action.payload;
        },
        resetFilters: (state) => {
            state.selectedFilters = {};
        },
        setFilterData: (
            state,
            action: PayloadAction<{ [key: string]: string[] }>
        ) => {
            state.filteringData = action.payload;
        },
        toggleCardLike: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.cardLikes[id] = !state.cardLikes[id];
            state.cardDislikes[id] = false;
        },
        toggleCardDislike: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.cardDislikes[id] = !state.cardDislikes[id];
            state.cardLikes[id] = false;
        },
        toggleAdditionalResultLike: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.additionalResultLikes[id] = !state.additionalResultLikes[id];
            state.additionalResultDislikes[id] = false;
        },
        toggleAdditionalResultDislike: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.additionalResultDislikes[id] = !state.additionalResultDislikes[id];
            state.additionalResultLikes[id] = false;
        },
        setIsPushingPositiveFeedback: (state, action) => {
            state.isPushingPositiveFeedback = action.payload;
        },
        setIsPositiveFeedbackPushed: (state, action) => {
            state.isPositiveFeedbackPushed = action.payload;
        },
        setIsErrorPushingPositiveFeedback: (state, action) => {
            state.isErrorPushingPositiveFeedback = action.payload;
        },
        setIsPushingNegativeFeedback: (state, action) => {
            state.isPushingNegativeFeedback = action.payload;
        },
        setIsNegativeFeedbackPushed: (state, action) => {
            state.isNegativeFeedbackPushed = action.payload;
        },
        setIsErrorPushingNegativeFeedback: (state, action) => {
            state.isErrorPushingNegativeFeedback = action.payload;
        },
        setNegativeFeedbackData: (state, action) => {
            state.negativeFeedbackData = action.payload;
        },
        setIsPushingSpecificFeedback: (state, action) => {
            state.isPushingSpecificFeedback = action.payload;
        },
        setIsSpecificFeedbackPushed: (state, action) => {
            state.isSpecificFeedbackPushed = action.payload;
        },
        setIsErrorPushingSpecificFeedback: (state, action) => {
            state.isErrorPushingSpecificFeedback = action.payload;
        },
        setSpecificFeedbackData: (state, action) => {
            state.specificFeedbackData = action.payload;
        },
        setHtmlContentFromCall: (state, action) => {
            state.htmlContent = action.payload;
        },
        setIsLoadingHtmlContent: (state, action) => {
            state.isLoadingHtmlContent = action.payload;
        },
        setIsErrorGettingHtmlContent: (state, action) => {
            state.isErrorGettingHtmlContent = action.payload;
        },
        setPdfContentFromCall: (state, action) => {
            state.htmlContent = action.payload;
        },
        setPdfNavigationResult: (state, action) => {
            state.pdfNavContent = {
                fileUrl: action.payload.fileUrl,
                pageNumber: action.payload.pageNumber,
            };
        },
        setIsLoadingPdfContent: (state, action) => {
            state.isLoadingHtmlContent = action.payload;
        },
        setIsErrorGettingPdfContent: (state, action) => {
            state.isErrorGettingHtmlContent = action.payload;
        },
        setIsOpenHtmlContentViewerModal: (state, action) => {
            state.isHtmlContentViewerModalOpen = action.payload;
        },
        setIsOpenPdfContentViewerModal: (state, action) => {
            state.isPdfViewerOpen = action.payload;
        },
        setIsLikedHtmlContent: (state, action) => {
            state.likedHtmlContent = action.payload;
        },
        setIsDislikedHtmlContent: (state, action) => {
            state.dislikedHtmlContent = action.payload;
        },
        setIsNegativeFeedbackModalOpen: (state, action) => {
            state.isNegativeFeedbackModalOpen = action.payload;
        },
        setFeebackText: (state, action) => {
            state.feedbackText = action.payload;
        },
        setIsVideoContentViewerModalOpen: (state, action) => {
            state.isVideoContentViewerModalOpen = action.payload;
        },
        setIsLikedVideoContent: (state, action) => {
            state.likedVideoContent = action.payload;
        },
        setIsDislikedVideoContent: (state, action) => {
            state.dislikedVideoContent = action.payload;
        },
        setAzureBlobSASToken: (state, action) => {
            state.azureBlobSASToken = action.payload;
        },
        setVideoTranscriptData: (state, action) => {
            state.videoTranscriptData = action.payload;
        },
        setIsLikedPdfContent: (state, action) => {
            state.likedPdfContent = action.payload;
        },
        setIsDislikedPdfContent: (state, action) => {
            state.dislikedPdfCOntent = action.payload;
        },
    },
});

export const {
    setSearchedQueryResult,
    setIsSearchingQueryResult,
    setIsErrorGettingQueryResult,
    setIsErrorGettingTextInPdf,
    setFilters,
    resetFilters,
    setFilterData,
    setFileSearchData,
    setIsSearchingTextInPdf,
    toggleCardLike,
    toggleCardDislike,
    toggleAdditionalResultLike,
    toggleAdditionalResultDislike,
    setIsPushingPositiveFeedback,
    setIsPositiveFeedbackPushed,
    setIsErrorPushingPositiveFeedback,
    setIsErrorPushingNegativeFeedback,
    setIsNegativeFeedbackPushed,
    setIsPushingNegativeFeedback,
    setNegativeFeedbackData,
    setIsSpecificFeedbackPushed,
    setIsErrorPushingSpecificFeedback,
    setSpecificFeedbackData,
    setIsPushingSpecificFeedback,
    setHtmlContentFromCall,
    setIsErrorGettingHtmlContent,
    setIsLoadingHtmlContent,
    setPdfContentFromCall,
    setPdfNavigationResult,
    setIsErrorGettingPdfContent,
    setIsLoadingPdfContent,
    setIsOpenHtmlContentViewerModal,
    setIsOpenPdfContentViewerModal,
    setIsLikedHtmlContent,
    setIsDislikedHtmlContent,
    setIsNegativeFeedbackModalOpen,
    setFeebackText,
    setIsVideoContentViewerModalOpen,
    setIsLikedVideoContent,
    setIsDislikedVideoContent,
    setAzureBlobSASToken,
    setVideoTranscriptData,
    setIsDislikedPdfContent,
    setIsLikedPdfContent
} = intelligentSearchSlice.actions;

export default intelligentSearchSlice.reducer;
