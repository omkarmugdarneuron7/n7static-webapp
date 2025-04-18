import { app } from "@microsoft/teams-js";
import { parseVTT } from "../util/searchResultUtil";

export const fetchSearchResults = async (enteredText: string, token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/intelligence/getQueryResults`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({ text: enteredText }),
    });

    if (!res.ok) {
      throw new Error(`Error fetching search results: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during search:", error);
    throw error;
  }
};
export const fetchPdfSearchResults = async (enteredText: string, fileName: string, token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/intelligence/getQueryResults`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        text: enteredText,
        filename: fileName,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error fetching search results: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during search:", error);
    throw error;
  }
};

export const onNavigatePage = async (
  source_file_url: string, page_no: number, token: string, baseUrl: string
): Promise<{ file_page_url: string; page_no: number }> => {
  try {
    const res = await fetch(`${baseUrl}/api/v1/kbdocs-file/navigate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        source_file_url: source_file_url,
        page_no: page_no,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to navigate page: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
        // Extract and return the file_page_url from the response
        if (data.status === "SUCCESS" && data.data?.file_page_url) {
          return {
            file_page_url: data.data.file_page_url,
            page_no: page_no,
          };
        } else {
          throw new Error(`Error in API response: ${data.error || "Unknown error"}`);
        }
  } catch (error) {
    console.error("Error navigating page", error);
    throw error;
  }
};

export const pushPositiveFeedbackForCard = async (text: string, name: string, answer: string, answerSegment: string, score: string, file_metadata: string[], feedback_id: string, file_url: string, source_file_url: string, page_html_link: string, page_no: string, total_pages: string, token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/intelligence/pushPositiveFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        text: text,
        name: name,
        answer: answer,
        answerSegment: answerSegment,
        score: score,
        file_metadata: file_metadata,
        feedback_id: feedback_id,
        file_url: file_url,
        source_file_url: source_file_url,
        page_html_link: page_html_link,
        page_no: page_no,
        total_pages: total_pages

      }),
    });


    if (!res.ok) {
      throw new Error(`Error pushing positive feedback: ${res.status} ${res.statusText}`);
    }

    return res;
  } catch (error) {
    console.error("Error during feedback:", error);
    throw error;
  }
};

export const pushNegativeFeedbackForCard = async (text: string, feedback_id: string, token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/intelligence/pushNegativeFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({ text: text, feedback_id: feedback_id }),
    });

    if (!res.ok) {
      throw new Error(`Error pushing negative feedback: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error during feedback:", error);
    throw error;
  }
};

export const pushSpecificFeedbackForCard = async (feedback_id: string, comment: string, token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/intelligence/pushSpecificFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({ feedback_id: feedback_id, comment: comment }),
    });

    if (!res.ok) {
      throw new Error(`Error pushing specific feedback: ${res.status} ${res.statusText}`);
    }


    return res;
  } catch (error) {
    console.error("Error pushing feedback:", error);
    throw error;
  }
};

export const fetchHtmlContent = async (url: string, token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/file/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
    });
    if (!res.ok) {
      throw new Error('Failed to load HTML content');
    }
    return res.text();
  }
  catch (error) {
    console.error("Error fetching HTML content:", error);
    throw error;
  }
};
export const fetchPdfContent = async (url: string, token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/file/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
    });
    if (!res.ok) {
      throw new Error('Failed to load HTML content');
    }
    return res.text();
  }
  catch (error) {
    console.error("Error fetching HTML content:", error);
    throw error;
  }
};

export const getAzureBlobSASToken = async (token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/v1/config/ui`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
    });

    if (!res.ok) {
      throw new Error(`Error fetching sas token: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching sas token:", error);
    throw error;
  }
};

export const downloadVideoFile = (fileUrl: string) => {
  app.openLink(fileUrl);
};

export const fetchVideoTranscript = async (url: string) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const vttText = await res.text();
    const parsedTranscript = parseVTT(vttText);
    return parsedTranscript;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
};
