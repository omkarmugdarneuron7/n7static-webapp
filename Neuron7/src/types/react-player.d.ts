declare module "react-player" {
    const ReactPlayer: React.ComponentType<{
      url: string;
      controls?: boolean;
      [key: string]: any;
    }>;
    export default ReactPlayer;
  }