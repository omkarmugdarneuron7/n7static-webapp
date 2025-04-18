import HtmlIcon from "../assets/icons/HTML - Icon.svg";
import PdfIcon from "../assets/icons/PDF-icon.svg";
import VideoIcon from "../assets/icons/Video-icon.svg";
import ImageIcon from "../assets/icons/Image-Icon.svg";

export const getFileTypeFromUrl = (url: string): string => {
  if (!url) return 'Unknown';

  const fileName = url.split('/').pop() || '';

  // Remove query string or fragment if present
  const cleanFileName = fileName.split('?')[0].split('#')[0];

  const parts = cleanFileName.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : 'Unknown';
};

export const extractFileNameWithoutExtension = (url: string): string => {
  if (!url) return "";

  // Extract the file name with extension
  const parts = url.split("/");
  const fileNameWithExtension = parts[parts.length - 1];

  // Remove the extension
  const fileName = fileNameWithExtension.split(".").slice(0, -1).join(".");
  return fileName;
};


export const  extractFileName = (url: string): string => {
  if (!url) return 'Unknown';
  const parts = url.split('/');
  return parts[parts.length - 1];
};

export const getFileIcon = (url: string) => {
  const fileType = getFileTypeFromUrl(url);
  if (fileType === "jpg" || fileType === "png") {
    return { icon: ImageIcon, fileType };
  }
  if (fileType === "pdf") {
    return { icon: PdfIcon, fileType };
  }
  if (fileType === "html") {
    return { icon: HtmlIcon, fileType };
  }
  if (fileType === "mp4") {
    return { icon: VideoIcon, fileType };
  }
};

export const groupBySourceOrPageLink = (queryResponse: any[]) => {
  return queryResponse.reduce((groupedData: Record<string, any[]>, item) => {
    const key = item.source_file_url || item.page_html_link || "Unknown";
    (groupedData[key] = groupedData[key] || []).push(item);
    return groupedData;
  }, {});
};


export function groupDataBySource(data: any[]): any {
  const groupedData: any = {};

  data?.forEach((item) => {
    // Check if the item has a `source_file_url`
    if (item.source_file_url) {
      // Use `source_file_url` as the grouping key
      if (!groupedData[item.source_file_url]) {
        groupedData[item.source_file_url] = [];
      }
      groupedData[item.source_file_url].push(item);
    } else if (item.page_html_link) {
      // If `source_file_url` is not present, use `page_html_link` as the grouping key
      if (!groupedData[item.page_html_link]) {
        groupedData[item.page_html_link] = [];
      }
      groupedData[item.page_html_link].push(item);
    }
  });

  return groupedData;
}


export const filterData = (data: any, criteria: { [key: string]: any[] }) => {
  console.log("Data before filtering:", data);
  console.log("Criteria:", criteria);

  // If no valid filter criteria, return the full data object
  if (!criteria || Object.keys(criteria).length === 0 || Object.values(criteria).every(arr => arr.length === 0)) {
    return data;
  }

  // Filter while preserving the original structure
  const filteredData: any = {};

  Object.entries(data).forEach(([url, items]) => {
    const filteredItems = (items as any[]).filter(item => {
      return Object.entries(criteria).some(([criteriaKey, filterValues]) => {
        // Find the correct key in item (case-insensitive)
        const itemKey = Object.keys(item).find(k => k.toLowerCase() === criteriaKey.toLowerCase());

        if (!itemKey) return false;

        const itemValue = item[itemKey];

        // Normalize to arrays for easy comparison
        const itemValuesArray = Array.isArray(itemValue) ? itemValue : [itemValue];

        // OR filtering: At least one filter value must match
        return filterValues.some(value => itemValuesArray.includes(value));
      });
    });

    // If there are matched items, keep the URL and filtered items
    if (filteredItems.length > 0) {
      filteredData[url] = filteredItems;
    }
  });

  return filteredData;
};


export const removeMilliseconds=(time: string): string=> {
  const [hh, mm, ssWithMs] = time.split(':');
  const ss = Math.floor(parseFloat(ssWithMs)).toString().padStart(2, '0');
  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${ss}`;
}

export const parseVTT=(vttString: string)=> {
  // Remove the "WEBVTT" header and any leading/trailing whitespace
  const cleaned = vttString.replace(/^WEBVTT\s*\n*/, '').trim();

  return cleaned
    .split(/\n{2,}/) 
    .map((block) => {
      const lines = block.trim().split('\n');
      const timeLine = lines.find(line => line.includes('-->'));

      if (timeLine) {
        const [startRaw, endRaw] = timeLine.split('-->').map(t => t.trim());
        const start = removeMilliseconds(startRaw);
        const end = removeMilliseconds(endRaw);
        const text = lines.filter(line => !line.includes('-->')).join(' ');
        return { start, end, text };
      }

      return null;
    })
    .filter(Boolean);
}






