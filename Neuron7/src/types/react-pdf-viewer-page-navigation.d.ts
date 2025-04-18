declare module '@react-pdf-viewer/page-navigation' {
    import { Plugin } from '@react-pdf-viewer/core';
  
    export interface RenderCurrentPageLabelProps {
      currentPage: number;
      numberOfPages: number;
    }
  
    export interface PageNavigationPlugin extends Plugin {
      CurrentPageLabel: React.FC<{
        children: (props: RenderCurrentPageLabelProps) => React.ReactElement;
      }>;
    }
  
    export function pageNavigationPlugin(): PageNavigationPlugin;
  }