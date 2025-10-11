import { pickColorHex, pickDisplay } from "../../../utils/normalizeOptions";

function RenderColorOption({ color }) {
  const list = Array.isArray(color?.[0]?.values) ? color[0].values : [];
  if (!list.length) return null;

  return (
    <div className="flex gap-2 mt-0.5">
      {list.map((el, index) => {
        const hex = pickColorHex(el);
        return (
          <div
            key={`${index}-${hex}`}
            className="h-5 w-5 rounded-full border border-gray-400"
            style={{ backgroundColor: hex }}
            title={pickDisplay(el)}
          />
        );
      })}
    </div>
  );
}

function RenderSize({ size }) {
  const list = Array.isArray(size?.[0]?.values) ? size[0].values : [];
  if (!list.length) return null;

  return (
    <div>
      {list.map((el, index) => {
        const label = String(pickDisplay(el));
        return (
          <span key={`${index}-${label}`} className="text-gray-700">
            {label}
            {index < list.length - 1 ? ", " : ""}
          </span>
        );
      })}
    </div>
  );
}

export default function ProductOptions({ options }) {
  const list = Array.isArray(options) ? options : [];

  const optColor = list.filter((el) => el.id === "OPT_COLOR");
  const optSize = list.filter((el) => el.id === "OPT_SIZE");

  if (!optColor.length && !optSize.length) return null;

  return (
    <>
      <RenderColorOption color={optColor} />
      <RenderSize size={optSize} />
    </>
  );
}