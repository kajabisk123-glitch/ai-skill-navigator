import AnimatedAvatar from './AnimatedAvatar.jsx';

export default function AnimatedTeacher({
  isSpeaking = false,
  gesture = 0,
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <AnimatedAvatar gesture={gesture} />
    </div>
  );
}