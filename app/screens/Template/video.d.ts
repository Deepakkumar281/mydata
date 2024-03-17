declare module 'react-native-video-controls' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';
  
    interface VideoPlayerProps {
      // Add the required props for the VideoPlayer component here
      // Refer to the package documentation for the available props
      // For example:
      source: { uri: string };
      style?: ViewStyle;
      controlTimeout?: number;
      disableVolume?: boolean;
      disableFullscreen?: boolean;
      paused?: boolean;
      resizeMode?: string;
      // Add other props as needed
    }
  
    export default class VideoPlayer extends Component<VideoPlayerProps> {}
  }
  