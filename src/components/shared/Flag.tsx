type Props = {
  code: string;
  className?: string;
  title?: string;
};

export default function Flag({ code, className = "", title }: Props) {
  const cls = code.toLowerCase() === "eu" ? "fi fi-eu" : `fi fi-${code.toLowerCase()}`;
  return (
    <span
      className={`${cls} ${className}`}
      title={title}
      style={{ width: "1.25em", height: "0.95em", display: "inline-block", borderRadius: 2 }}
    />
  );
}
