export function ProductDetailCards({ details=[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {details.map((d, i) => (
        <article key={i} className="border border-gray-200 rounded">
          <img src={d.img} alt={`detail-${i}`} className="w-full h-56 object-cover rounded-t" />
          <p className="p-4 text-sm text-gray-800 leading-relaxed">{d.text}</p>
        </article>
      ))}
    </div>
  );
}

export function ProductSpec({ material=[], care=[] }) {
  return (
    <div className="mt-8 mb-8 grid md:grid-cols-3 gap-6">
      <div className="border border-gray-200 rounded p-4">
        <h3 className="font-medium mb-2">소재</h3>
        <ul className="text-sm text-gray-800 list-disc pl-5 space-y-1">
          {material.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>
      <div className="border border-gray-200 rounded p-4">
        <h3 className="font-medium mb-2">세탁 & 케어</h3>
        <ul className="text-sm text-gray-800 list-disc pl-5 space-y-1">
          {care.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
      <div className="border border-gray-200 rounded p-4">
        <h3 className="font-medium mb-2">사이즈 & 핏</h3>
        <p className="text-sm text-gray-800">정사이즈 권장. 오버핏 원하면 한 사이즈 업.</p>
      </div>
    </div>
  );
}
