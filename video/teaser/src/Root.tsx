import {Composition} from 'remotion';
import {CodexTeaserVideo} from './scenes/CodexTeaserVideo';
import './styles.css';

export const RemotionRoot = () => {
  return (
    <Composition
      id="CodexTeaser"
      component={CodexTeaserVideo}
      durationInFrames={900}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
