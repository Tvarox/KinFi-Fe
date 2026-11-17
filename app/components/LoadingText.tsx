interface LoadingTextProps {
  text: string;
  className?: string;
}

export default function LoadingText({ text, className = "" }: LoadingTextProps) {
  return (
    <span className={className} role="status">
      <span className="sr-only">{text}...</span>
      <span aria-hidden="true">
        {text}
        <span className="loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </span>
    </span>
  );
}
