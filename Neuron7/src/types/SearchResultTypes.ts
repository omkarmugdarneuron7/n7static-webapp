export interface CardData {
    additionalItems?: any[]; // Define the type of additionalItems
    file_url?: string;
    [key: string]: any; // Add other properties as needed
}

export interface SelectedCardData {
    title: string;
    fileName: string;
    content: string;
    fileUrl: string;
    cardData: CardData;
}