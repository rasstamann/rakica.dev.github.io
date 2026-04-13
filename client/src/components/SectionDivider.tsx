export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-[2px] w-full rounded-full"
      // Four-stop gradient with per-stop opacity cannot be expressed as a single Tailwind utility
      style={{
        background:
          'linear-gradient(to right, rgb(124 58 237 / 0.36) 0%, rgb(250 250 249) 33%, rgb(250 250 249) 66%, rgb(22 163 74 / 0.36) 100%)',
      }}
    />
  );
}
