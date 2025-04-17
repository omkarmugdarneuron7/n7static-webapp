import { Action } from "redux";

export enum SagaIntelligentSearchActionType {
  getQueryResults = "intelligentSearch/getQueryResults",
  searchWithFile = "intelligentSearch/searchWithFile",
  pushPositiveFeedback = "intelligentSearch/pushPositiveFeedback",
  pushNegativeFeedback = "intelligentSearch/pushNegativeFeedback",
  pushSpecificFeedback = "intelligentSearch/pushSpecificFeedback",
  getHtmlContent = "intelligentSearch/getHtmlContent",
  getPdfContent = "intelligentSearch/getPdfContent",
  getBlobStorageSASToken=   "intelligentSearch/getBlobStorageSASToken",
  onNavigatePage = "intelligentSearch/onNavigatePage",
  fetchVideoTranscript="intelligentSearch/fetchVideoTranscript"
}

export interface GetQueryResultAction extends Action {
  type: SagaIntelligentSearchActionType.getQueryResults;
  payload: { text: string; token: string; baseUrl: string; };
}
export interface onSearchWithFile extends Action {
  type: SagaIntelligentSearchActionType.searchWithFile;
  payload: { text: string; filename:string; token: string; baseUrl: string; };
}
export interface PushPositiveFeedbackAction extends Action {
  type: SagaIntelligentSearchActionType.pushPositiveFeedback;
  payload: {
    text: string;
    name:string;
    answer: string;
    answerSegment: string;
    score: string;
    file_metadata: string[];
    feedback_id: string;
    file_url: string;
    source_file_url: string;
    page_html_link: string;
    page_no: string;
    total_pages: string;
    token: string;
    baseUrl: string;
  };
}

export interface PushNegativeFeedbackAction extends Action {
  type: SagaIntelligentSearchActionType.pushNegativeFeedback;
  payload: {
    text: string;
    feedback_id: string;
    token: string;
    baseUrl: string;
  };
}

export interface PushSpecificFeedbackAction extends Action {
  type: SagaIntelligentSearchActionType.pushSpecificFeedback;
  payload: {
    feedback_id: string;
    comment: string;
    token: string;
    baseUrl: string;
  };
}

export interface GetHtmlContentAction extends Action {
  type: SagaIntelligentSearchActionType.getHtmlContent;
  payload: {
    fileName: string;
    token: string;
    baseUrl: string;
  };
}

export interface GetPdfContentAction extends Action {
  type: SagaIntelligentSearchActionType.getPdfContent;
  payload: {
    fileName: string;
    token: string;
    baseUrl: string;
    initialSearchQuery: string;
  };
}

export interface GetBlobStorageSASToken extends  Action{
  type:SagaIntelligentSearchActionType.getBlobStorageSASToken;
  payload:{
    token:string;
    baseUrl:string;
  }
}
export interface OnNavigatePageAction {
  type: SagaIntelligentSearchActionType.onNavigatePage;
  payload: {
    sourceFileUrl: string;
    pageNumber: number;
    token:string;
    baseUrl:string;
  };
}

export interface FetchVideoTranscript extends  Action{
  type:SagaIntelligentSearchActionType.fetchVideoTranscript;
  payload:{
    fileUrl:string
  }
}

