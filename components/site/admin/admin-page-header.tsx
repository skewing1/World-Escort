export function AdminPageHeader({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="border-b border-border px-6 py-6" style={{ background: "#0A0813" }}>
      <div className="flex items-end justify-between">
        <div>
          {eyebrow && (
            <div className="text-[10px] tracking-[0.35em] uppercase text-primary mb-1">
              {eyebrow}
            </div>
          )}
          <h1
            style={{ fontFamily: "'Bodoni Moda', serif" }}
            className="text-3xl font-normal text-foreground"
          >
            {title}
          </h1>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
