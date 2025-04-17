import { put, takeEvery, call } from "redux-saga/effects";

import {
  FetchVideoTranscript,
  GetBlobStorageSASToken,
  GetHtmlContentAction,
  GetPdfContentAction,
  GetQueryResultAction,
  onSearchWithFile,
  PushPositiveFeedbackAction,
  PushSpecificFeedbackAction,
  SagaIntelligentSearchActionType,
  OnNavigatePageAction
} from "./inteliigentSearchActions";
import {
  fetchHtmlContent,
  fetchPdfContent,
  fetchSearchResults,
  fetchPdfSearchResults,
  onNavigatePage,
  getAzureBlobSASToken,
  pushNegativeFeedbackForCard,
  pushPositiveFeedbackForCard,
  pushSpecificFeedbackForCard,
  fetchVideoTranscript, 
} from "../../services/IntelligentSearchService";
import {
  setFilterData,
  setFileSearchData,
  setIsErrorGettingQueryResult,
  setIsErrorGettingTextInPdf,
  setIsErrorPushingNegativeFeedback,
  setIsErrorPushingPositiveFeedback,
  setNegativeFeedbackData,
  setIsNegativeFeedbackPushed,
  setIsPositiveFeedbackPushed,
  setIsPushingNegativeFeedback,
  setIsPushingPositiveFeedback,
  setIsSearchingQueryResult,
  setSearchedQueryResult,
  setIsSearchingTextInPdf,
  setIsPushingSpecificFeedback,
  setSpecificFeedbackData,
  setIsSpecificFeedbackPushed,
  setIsErrorPushingSpecificFeedback,
  setHtmlContentFromCall,
  setIsLoadingHtmlContent,
  setIsErrorGettingHtmlContent,
  setPdfContentFromCall,
  setPdfNavigationResult,
  setIsLoadingPdfContent,
  setIsErrorGettingPdfContent,
  setIsOpenHtmlContentViewerModal,
  setIsVideoContentViewerModalOpen,
  setAzureBlobSASToken,
  setVideoTranscriptData,
  setIsOpenPdfContentViewerModal,
} from "../Slices/intelligentSearchSlice";
import { showToast } from "../Slices/toastSlice";

export function* getQueryResults(
  action: GetQueryResultAction
): Generator<any, any, any> {
  try {
    yield put(setIsSearchingQueryResult(true));

    const { text, token, baseUrl } = action.payload;
    const results = yield call(fetchSearchResults, text, token, baseUrl);

    yield put(setSearchedQueryResult(results));
    yield put(setFilterData(results));
    yield put(setIsSearchingQueryResult(false));
  } catch (error) {
    yield put(setIsSearchingQueryResult(false));
    yield put(setIsErrorGettingQueryResult(true));
  }
}

export function* getSearchWithFileResults(
  action: onSearchWithFile
): Generator<any, any, any> {
  try {
    yield put(setIsSearchingTextInPdf(true));

    const { text, filename, token, baseUrl } = action.payload;
    const results = yield call(fetchPdfSearchResults, text, filename, token, baseUrl);
    yield put(setFileSearchData(results));
    yield put(setIsSearchingTextInPdf(false));
  } catch (error) {
    yield put(setIsSearchingTextInPdf(false));
    yield put(setIsErrorGettingTextInPdf(true));
  }
}

export function* pushPositiveFeedback(
  action: PushPositiveFeedbackAction
): Generator<any, any, any> {
  try {
    const {
      text,
      name,
      answer,
      answerSegment,
      score,
      file_metadata,
      feedback_id,
      file_url,
      source_file_url,
      page_html_link,
      page_no,
      total_pages,
      token,
      baseUrl
    } = action.payload;
    yield put(setIsPushingPositiveFeedback(true));

    const results = yield call(
      pushPositiveFeedbackForCard,
      text,
      name,
      answer,
      answerSegment,
      score,
      file_metadata,
      feedback_id,
      file_url,
      source_file_url,
      page_html_link,
      page_no,
      total_pages,
      token,
      baseUrl
    );
    yield put(setIsPushingPositiveFeedback(false));
    yield put(setIsPositiveFeedbackPushed(true));
  } catch (error) {
    yield put(setIsPositiveFeedbackPushed(false));
    yield put(setIsErrorPushingPositiveFeedback(true));
    yield put(setIsPushingPositiveFeedback(false));
  }
}
export function* pushNegativeFeedback(
  action: PushPositiveFeedbackAction
): Generator<any, any, any> {
  try {
    const { text, feedback_id, token, baseUrl } = action.payload;    
        yield put(setIsPushingNegativeFeedback(true));
    const results = yield call(
      pushNegativeFeedbackForCard,
      text,
      feedback_id,
      token,
      baseUrl
    );
    yield put(setIsNegativeFeedbackPushed(true));
    yield put(setNegativeFeedbackData(results));

    yield put(setIsPushingNegativeFeedback(false));
    yield put(setIsOpenHtmlContentViewerModal(false));
    yield put(setIsVideoContentViewerModalOpen(false));
    yield put(setIsOpenPdfContentViewerModal(false));

  } catch (error) {
    yield put(setIsPushingNegativeFeedback(false));
    yield put(setIsNegativeFeedbackPushed(false));
    yield put(setIsErrorPushingNegativeFeedback(true));
  }
}

export function* pushSpecificFeedback(
  action: PushSpecificFeedbackAction
): Generator<any, any, any> {
  try {
    yield put(setIsPushingSpecificFeedback(true));
    const { feedback_id, comment, token, baseUrl } = action.payload;
    const results = yield call(
      pushSpecificFeedbackForCard,
      feedback_id,
      comment,
      token,
      baseUrl
    );
    yield put(setIsPushingSpecificFeedback(false));
    yield put(showToast({ message: "Feedback Submitted Successfully" }));
    yield put(setSpecificFeedbackData(results));
    yield put(setIsSpecificFeedbackPushed(true));
  } catch (error) {
    yield put(setIsPushingSpecificFeedback(false));
    yield put(setIsErrorPushingSpecificFeedback(true));
    yield put(setIsSpecificFeedbackPushed(false));
  }
}

export function* getHtmlContent(
  action: GetHtmlContentAction
): Generator<any, any, any> {
  try {
    yield put(setIsErrorGettingHtmlContent(false));
    yield put(setIsLoadingHtmlContent(true));
    const { fileName, token, baseUrl } = action.payload;    
    const results = yield call(fetchHtmlContent, fileName, token, baseUrl);
    yield put(setHtmlContentFromCall(results));
    yield put(setIsLoadingHtmlContent(false));
  } catch (error) {    
    yield put(setIsLoadingHtmlContent(false));
    yield put(setIsErrorGettingHtmlContent(true));
  }
}
export function* getPdfContent(
  action: GetPdfContentAction
): Generator<any, any, any> {
  try {
    yield put(setIsErrorGettingPdfContent(false));
    yield put(setIsLoadingPdfContent(true));
    const { fileName, token, baseUrl } = action.payload;    
    const results = yield call(fetchPdfContent, fileName, token, baseUrl);
    yield put(setPdfContentFromCall(results));
    yield put(setIsLoadingPdfContent(false));
  } catch (error) {
    console.log('here',error);
    
    yield put(setIsLoadingPdfContent(false));
    yield put(setIsErrorGettingPdfContent(true));
  }
}

export function* navigatePage(action: OnNavigatePageAction): Generator<any, any, any> {
  try {
    const { sourceFileUrl, pageNumber, token, baseUrl } = action.payload;

    // Call the service function
    const results = yield call(onNavigatePage, sourceFileUrl, pageNumber, token, baseUrl);

    if (results) {
      // Update the Redux state with the new file URL and page number
      yield put(
        setPdfNavigationResult({
          fileUrl: results.file_page_url,
          pageNumber: results.page_no,
        })
      );
    } else {
      console.error("Error in API response:");
      yield put(setPdfNavigationResult(null));
    }
  } catch (error) {
    console.error("Error navigating to page:", error);
    yield put(setPdfNavigationResult(null));
  }
}

export function* getBlobStorageSASToken(
  action: GetBlobStorageSASToken
): Generator<any, any, any> {
  try {
    const {  token, baseUrl } = action.payload;
    const results = yield call(getAzureBlobSASToken, token, baseUrl);
    yield put(setAzureBlobSASToken(results.data.configs["azure-blob-sas-token"]));
  } catch (error) {
    yield put(setAzureBlobSASToken(''));
  }
}

export function* getVideoTranscript(
  action: FetchVideoTranscript
): Generator<any, any, any> {
  try {
    const {  fileUrl } = action.payload;    
    const result = yield call(fetchVideoTranscript, fileUrl);    
    yield put(setVideoTranscriptData(result));
  } catch (error) {
    yield put(setVideoTranscriptData(''));
  }
}

export default function* intelligentSearchSaga() {
  yield takeEvery<GetQueryResultAction>(
    SagaIntelligentSearchActionType.getQueryResults,
    getQueryResults
  );
  yield takeEvery<onSearchWithFile>(
    SagaIntelligentSearchActionType.searchWithFile,
    getSearchWithFileResults
  );

  yield takeEvery<PushPositiveFeedbackAction>(
    SagaIntelligentSearchActionType.pushPositiveFeedback,
    pushPositiveFeedback
  );
  yield takeEvery<PushPositiveFeedbackAction>(
    SagaIntelligentSearchActionType.pushNegativeFeedback,
    pushNegativeFeedback
  );
  yield takeEvery<PushSpecificFeedbackAction>(
    SagaIntelligentSearchActionType.pushSpecificFeedback,
    pushSpecificFeedback
  );
  yield takeEvery<GetHtmlContentAction>(
    SagaIntelligentSearchActionType.getHtmlContent,
    getHtmlContent
  );
  yield takeEvery<GetPdfContentAction>(
    SagaIntelligentSearchActionType.getPdfContent,
    getPdfContent
  );
  yield takeEvery<GetBlobStorageSASToken>(
    SagaIntelligentSearchActionType.getBlobStorageSASToken,
    getBlobStorageSASToken
  );
  yield takeEvery<OnNavigatePageAction>(
    SagaIntelligentSearchActionType.onNavigatePage,
    navigatePage // Add this line
  );
  yield takeEvery<FetchVideoTranscript>(
    SagaIntelligentSearchActionType.fetchVideoTranscript,
    getVideoTranscript
  )
}
