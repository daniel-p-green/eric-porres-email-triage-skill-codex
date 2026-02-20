import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Fragment} from 'react';
import {ArrowRight, BarChart, Check, Code, Folder, Globe, Lock, Search, Settings} from '@geist-ui/icons';
import {fadeIn, fadeOut, scaleIn, slideRight, slideUp} from '../utils/animations';

const overlayGrid = {
  backgroundImage:
    'radial-gradient(circle at 20% 20%, rgba(0,112,243,0.14), rgba(0,0,0,0) 40%), radial-gradient(circle at 80% 70%, rgba(70,167,88,0.12), rgba(0,0,0,0) 38%), linear-gradient(to right, rgba(115,115,115,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(115,115,115,0.08) 1px, transparent 1px)',
  backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px'
} as const;

const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <AbsoluteFill className="bg-background-100 text-gray-100" style={overlayGrid}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/55" />
      <div className="relative z-10 flex h-full w-full flex-col px-20 py-16">{children}</div>
    </AbsoluteFill>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headlineOpacity = fadeIn(frame, fps, 0.2, 0.5) * fadeOut(frame, fps, 4.7, 0.4);
  const headlineY = slideUp(frame, fps, 0.2, 36);
  const subOpacity = fadeIn(frame, fps, 0.8, 0.5) * fadeOut(frame, fps, 4.7, 0.4);
  const badgeOpacity = fadeIn(frame, fps, 0, 0.45) * fadeOut(frame, fps, 4.7, 0.4);

  return (
    <SceneShell>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 rounded-full border border-gray-500/70 bg-background-200/80 px-4 py-2"
          style={{opacity: badgeOpacity}}
        >
          <Code size={18} color="#ededed" />
          <span className="font-mono text-[13px] tracking-wide text-gray-200">CODEX BUILD</span>
        </div>
      </div>

      <div className="mt-20">
        <h1
          className="max-w-[1000px] font-semibold text-white"
          style={{
            fontSize: 78,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`
          }}
        >
          Eric Porres Email Triage, Reimagined For Codex
        </h1>
        <p
          className="mt-6 max-w-[860px] text-gray-300"
          style={{fontSize: 31, lineHeight: 1.3, opacity: subOpacity}}
        >
          Snippet-first prioritization, safer automation, and a cleaner daily inbox workflow in one skill.
        </p>
      </div>
    </SceneShell>
  );
};

const FeatureCard: React.FC<{
  index: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({index, icon, title, description}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const delay = 0.2 + index * 0.18;
  const opacity = fadeIn(frame, fps, delay, 0.45) * fadeOut(frame, fps, 5.2, 0.35);
  const y = slideUp(frame, fps, delay, 28);
  const scale = scaleIn(frame, fps, delay, 0.95);

  return (
    <div
      className="rounded-2xl border border-gray-500/70 bg-background-200/86 p-6"
      style={{opacity, transform: `translateY(${y}px) scale(${scale})`}}
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-700/35 bg-blue-700/15">
        {icon}
      </div>
      <h3 className="text-[26px] font-semibold text-white" style={{letterSpacing: '-0.02em'}}>
        {title}
      </h3>
      <p className="mt-3 text-[18px] leading-[1.45] text-gray-300">{description}</p>
    </div>
  );
};

const FeatureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0.05, 0.45) * fadeOut(frame, fps, 5.1, 0.4);
  const subtitleOpacity = fadeIn(frame, fps, 0.2, 0.45) * fadeOut(frame, fps, 5.1, 0.4);

  return (
    <SceneShell>
      <h2
        className="text-white"
        style={{fontSize: 58, fontWeight: 600, letterSpacing: '-0.03em', opacity: titleOpacity}}
      >
        Built For Signal, Not Inbox Noise
      </h2>
      <p className="mt-3 text-gray-300" style={{fontSize: 24, opacity: subtitleOpacity}}>
        The Codex port keeps the original triage model while adding a polished operator experience.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-6">
        <FeatureCard
          index={0}
          icon={<Search size={22} color="#0070F3" />}
          title="Snippet-First Triage"
          description="Classifies from sender, subject, and snippet first, then reads full threads only when needed."
        />
        <FeatureCard
          index={1}
          icon={<BarChart size={22} color="#0070F3" />}
          title="Three-Tier Priority"
          description="Reply Needed, Review, and Noise outputs are structured for immediate action."
        />
        <FeatureCard
          index={2}
          icon={<Folder size={22} color="#0070F3" />}
          title="Alias-Aware Routing"
          description="Supports family, financial, medical, and category alias mapping with content fallback."
        />
        <FeatureCard
          index={3}
          icon={<Lock size={22} color="#0070F3" />}
          title="Explicit Safety Gates"
          description="No send, no archive, and no destructive actions without direct user confirmation."
        />
      </div>
    </SceneShell>
  );
};

const FlowStep: React.FC<{
  index: number;
  title: string;
  detail: string;
}> = ({index, title, detail}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delay = 0.15 + index * 0.35;

  const opacity = fadeIn(frame, fps, delay, 0.3) * fadeOut(frame, fps, 6.2, 0.35);
  const x = slideRight(frame, fps, delay, 36);

  return (
    <div
      className="flex items-start gap-5 rounded-xl border border-gray-500/65 bg-background-200/78 px-5 py-4"
      style={{opacity, transform: `translateX(${x}px)`}}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-green-700/50 bg-green-700/15 text-[15px] font-semibold text-green-700">
        {index + 1}
      </div>
      <div>
        <p className="text-[23px] font-semibold text-white" style={{letterSpacing: '-0.015em'}}>
          {title}
        </p>
        <p className="mt-1 text-[17px] text-gray-300">{detail}</p>
      </div>
    </div>
  );
};

const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0.05, 0.45) * fadeOut(frame, fps, 6.0, 0.4);
  const iconOpacity = fadeIn(frame, fps, 0, 0.5) * fadeOut(frame, fps, 6.0, 0.4);

  return (
    <SceneShell>
      <div className="flex items-center justify-between">
        <h2
          className="text-white"
          style={{fontSize: 56, fontWeight: 600, letterSpacing: '-0.03em', opacity: titleOpacity}}
        >
          From Query To Action In Seconds
        </h2>
        <div style={{opacity: iconOpacity}}>
          <Settings size={34} color="#737373" />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-4 text-gray-300">
        {['Check Email', 'Classify', 'Draft Reply', 'Confirm Action'].map((label, index) => {
          const op = fadeIn(frame, fps, 0.2 + index * 0.22, 0.3) * fadeOut(frame, fps, 6.0, 0.4);
          return (
            <Fragment key={label}>
              <div
                className="rounded-xl border border-gray-500/60 bg-background-200/75 px-5 py-3 text-center text-[17px]"
                style={{opacity: op}}
              >
                {label}
              </div>
              {index < 3 ? (
                <div style={{opacity: op}}>
                  <ArrowRight size={18} color="#737373" />
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      <div className="mt-14 grid grid-cols-2 gap-5">
        <FlowStep index={0} title="Daily Scan" detail="Uses a time-windowed inbox query for reliable daily coverage." />
        <FlowStep index={1} title="Priority Routing" detail="Promotes urgent family, work, financial, school, and medical signals." />
        <FlowStep index={2} title="Draft Support" detail="Reads full message threads before generating response drafts." />
        <FlowStep index={3} title="Guardrail Control" detail="Requires explicit send and archive confirmations every time." />
      </div>
    </SceneShell>
  );
};

const SafetyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0.05, 0.45) * fadeOut(frame, fps, 4.8, 0.4);
  const subOpacity = fadeIn(frame, fps, 0.2, 0.45) * fadeOut(frame, fps, 4.8, 0.4);

  const items = [
    'No send without explicit confirmation',
    'No archive without explicit confirmation',
    'No permanent delete path',
    'Read-only triage-first posture'
  ];

  return (
    <SceneShell>
      <div className="mt-5">
        <h2
          className="text-white"
          style={{fontSize: 60, fontWeight: 600, letterSpacing: '-0.03em', opacity: titleOpacity}}
        >
          Designed For Trust And Control
        </h2>
        <p className="mt-3 text-gray-300" style={{fontSize: 25, opacity: subOpacity}}>
          Public-facing automation should be safe by default. This build keeps that non-negotiable.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-4">
        {items.map((item, index) => {
          const delay = 0.35 + index * 0.23;
          const opacity = fadeIn(frame, fps, delay, 0.3) * fadeOut(frame, fps, 4.8, 0.4);
          const y = slideUp(frame, fps, delay, 24);
          return (
            <div
              key={item}
              className="flex items-center gap-4 rounded-xl border border-green-700/40 bg-green-700/10 px-5 py-4"
              style={{opacity, transform: `translateY(${y}px)`}}
            >
              <Check size={19} color="#46A758" />
              <p className="text-[23px] text-gray-100" style={{letterSpacing: '-0.015em'}}>
                {item}
              </p>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps, 0.05, 0.45);
  const subOpacity = fadeIn(frame, fps, 0.35, 0.5);
  const ctaOpacity = fadeIn(frame, fps, 0.85, 0.5);
  const ctaScale = scaleIn(frame, fps, 0.85, 0.92);

  return (
    <SceneShell>
      <div className="mt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-700/40 bg-blue-700/15 px-4 py-2">
          <Globe size={16} color="#0070F3" />
          <span className="font-mono text-[13px] tracking-wide text-blue-700">PUBLIC RELEASE</span>
        </div>
        <h2
          className="mt-6 max-w-[980px] text-white"
          style={{fontSize: 68, fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.03em', opacity: titleOpacity}}
        >
          Eric Porres Email Triage Skill For Codex
        </h2>
        <p className="mt-5 max-w-[860px] text-gray-300" style={{fontSize: 30, opacity: subOpacity}}>
          Faster inbox clarity, safer workflow automation, and attribution-forward packaging.
        </p>
      </div>

      <div
        className="mt-14 inline-flex w-fit items-center gap-3 rounded-xl border border-gray-500/70 bg-background-200/80 px-6 py-4"
        style={{opacity: ctaOpacity, transform: `scale(${ctaScale})`}}
      >
        <ArrowRight size={20} color="#ededed" />
        <span className="text-[22px] font-medium text-white">Install The Skill, Run Daily Triage</span>
      </div>
    </SceneShell>
  );
};

export const CodexTeaserVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={165}>
        <IntroScene />
      </Sequence>
      <Sequence from={165} durationInFrames={180}>
        <FeatureScene />
      </Sequence>
      <Sequence from={345} durationInFrames={225}>
        <WorkflowScene />
      </Sequence>
      <Sequence from={570} durationInFrames={165}>
        <SafetyScene />
      </Sequence>
      <Sequence from={735} durationInFrames={165}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
