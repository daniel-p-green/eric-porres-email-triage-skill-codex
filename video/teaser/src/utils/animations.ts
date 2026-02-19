import {interpolate, spring} from 'remotion';

export const springSmooth = {damping: 200};
export const springSnappy = {damping: 24, stiffness: 180};

export const fadeIn = (frame: number, fps: number, delay = 0, duration = 0.35) => {
  const start = delay * fps;
  const end = start + duration * fps;
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
};

export const fadeOut = (frame: number, fps: number, startAt = 0, duration = 0.35) => {
  const start = startAt * fps;
  const end = start + duration * fps;
  return interpolate(frame, [start, end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
};

export const slideUp = (frame: number, fps: number, delay = 0, distance = 24) => {
  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: springSmooth
  });
  return interpolate(progress, [0, 1], [distance, 0]);
};

export const slideRight = (frame: number, fps: number, delay = 0, distance = 24) => {
  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: springSmooth
  });
  return interpolate(progress, [0, 1], [-distance, 0]);
};

export const scaleIn = (frame: number, fps: number, delay = 0, from = 0.93) => {
  const progress = spring({
    frame: frame - delay * fps,
    fps,
    config: springSnappy
  });
  return interpolate(progress, [0, 1], [from, 1]);
};
