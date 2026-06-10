export default function AdPlaceholder({ label = "Advertisement" }: { label?: string }) {
  return (
    <div className="my-4 flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-ink/20 bg-white/50 p-4 text-center text-xs text-ink/40">
      {label}
      <br />
      <span className="text-[10px]">Replace this component with your real Adsterra banner / native code</span>
    </div>
  );
}
