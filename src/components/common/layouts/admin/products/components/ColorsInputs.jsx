import FieldLabel from './FieldLabel';
import Line from './Line';
import { Plus, Trash2, Copy } from 'lucide-react';
import { useState } from 'react';

const PRESETS = [
  { name: 'Violet', hex: '#7C3AED' },
  { name: 'Violet Dark', hex: '#5B21B6' },
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray 600', hex: '#4B5563' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Sky', hex: '#0EA5E9' },
];

// --- 안전 유틸 ---
const safeStr = (v, fallback = '') => (v == null ? fallback : String(v));
const safeHex = (hex) => {
  const s = safeStr(hex, '#000000').trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s)
    ? s.toUpperCase()
    : '#000000';
};

function hexToRgb(hex) {
  const h = safeHex(hex).replace('#', '');
  const v =
    h.length === 3
      ? h
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : h;
  const int = parseInt(v || '000000', 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}
function rgbToHex({ r, g, b }) {
  const toHex = (n) =>
    Number(n ?? 0)
      .toString(16)
      .padStart(2, '0');
  return ('#' + toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}
function parseRgb(str) {
  const m = safeStr(str)
    .replace(/[^\d,]/g, '')
    .split(',')
    .map((v) => Number(v.trim()));
  if (m.length !== 3 || m.some((x) => Number.isNaN(x))) return null;
  return { r: m[0], g: m[1], b: m[2] };
}
function lowContrast(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lum = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
  const contrast = (L1, L2) =>
    (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  const best = Math.max(contrast(L, 1), contrast(L, 0));
  return best < 4.5;
}

export default function ColorsInputs({ form, set, addRow, delRow }) {
  const [format, setFormat] = useState('hex'); // 'hex' | 'rgb'

  const colors = Array.isArray(form?.colors) ? form.colors : [];

  const updateColor = (idx, patch) => {
    const next = [...colors];
    next[idx] = {
      ...(next[idx] ?? { code: '', name: '', hex: '#000000' }),
      ...patch,
    };
    // null 방지
    next[idx].code = safeStr(next[idx].code);
    next[idx].name = safeStr(next[idx].name);
    next[idx].hex = safeHex(next[idx].hex);
    set('colors', next);
  };

  const addFromPreset = (p) => {
    addRow('colors', {
      code: safeStr(p.name).toUpperCase().replace(/\s+/g, '_'),
      name: p.name,
      hex: safeHex(p.hex),
    });
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(safeStr(text));
    } catch {}
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <FieldLabel>색상 선택</FieldLabel>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">코드 표기</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="h-8 rounded-lg bg-gray-50 px-2 text-xs outline-none border-0 shadow-sm"
          >
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
      </div>

      {/* 프리셋 팔레트 */}
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.hex}
            type="button"
            onClick={() => addFromPreset(p)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs hover:bg-gray-50"
            title={`${p.name} (${p.hex}) 추가`}
          >
            <span
              className="h-4 w-4 rounded ring-1 ring-gray-200"
              style={{ backgroundColor: p.hex }}
            />
            {p.name}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {colors.map((c, idx) => {
          const hex = safeHex(c?.hex);
          const displayValue =
            format === 'hex'
              ? hex
              : (() => {
                  const { r, g, b } = hexToRgb(hex);
                  return `${r}, ${g}, ${b}`;
                })();

          return (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              {/* 코드 */}
              <input
                value={safeStr(c?.code)}
                onChange={(e) => updateColor(idx, { code: e.target.value })}
                placeholder="코드 (ex: NAVY)"
                className="col-span-3 h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm"
              />
              {/* 이름 */}
              <input
                value={safeStr(c?.name)}
                onChange={(e) => updateColor(idx, { name: e.target.value })}
                placeholder="이름 (ex: 네이비)"
                className="col-span-3 h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm"
              />
              {/* 값(HEX/RGB) */}
              {format === 'hex' ? (
                <input
                  value={displayValue}
                  onChange={(e) => {
                    let v = safeStr(e.target.value).trim();
                    if (!v.startsWith('#'))
                      v = '#' + v.replace(/[^0-9a-fA-F]/g, '');
                    updateColor(idx, { hex: v });
                  }}
                  placeholder="#7C3AED"
                  className="col-span-3 h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm font-mono"
                />
              ) : (
                <input
                  value={displayValue}
                  onChange={(e) => {
                    const parsed = parseRgb(e.target.value);
                    if (parsed) updateColor(idx, { hex: rgbToHex(parsed) });
                  }}
                  placeholder="124, 58, 237"
                  className="col-span-3 h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none border-0 shadow-sm font-mono"
                />
              )}

              {/* 칩 미리보기 */}
              <div className="col-span-1">
                <div
                  className="h-10 w-full rounded-xl ring-1 ring-gray-200"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              </div>

              {/* 복사 버튼 */}
              <button
                type="button"
                onClick={() =>
                  copy(
                    format === 'hex'
                      ? hex
                      : (() => {
                          const { r, g, b } = hexToRgb(hex);
                          return `${r}, ${g}, ${b}`;
                        })()
                  )
                }
                className="col-span-1 inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 h-10"
                title="코드 복사"
              >
                <Copy className="size-4 text-gray-600" />
              </button>

              {/* 대비 경고 */}
              <div className="col-span-1 text-[10px] text-gray-500 text-center">
                {hex && lowContrast(hex) ? '대비 낮음' : ''}
              </div>

              {/* 색상 피커 */}
              <input
                type="color"
                value={hex}
                onChange={(e) =>
                  updateColor(idx, { hex: safeHex(e.target.value) })
                }
                className="col-span-1 h-10 rounded-xl bg-gray-50 px-2 text-sm outline-none border-0 shadow-sm"
                title="피커로 선택"
              />

              {/* 삭제 */}
              <button
                onClick={() => delRow('colors', idx)}
                className="col-span-1 inline-flex items-center justify-center rounded-xl hover:bg-gray-100 h-10"
                aria-label="색상 삭제"
                title="삭제"
              >
                <Trash2 className="size-4 text-gray-500" />
              </button>
            </div>
          );
        })}

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              addRow('colors', { code: '', name: '', hex: '#000000' })
            }
            className="mt-1 inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
          >
            <Plus className="size-4" /> 색상 추가
          </button>
          <div className="text-xs text-gray-500">
            * 값은 {format.toUpperCase()}로 복사되며, 실제 API 전송은 <b>HEX</b>{' '}
            권장입니다.
          </div>
        </div>
      </div>

      <Line />
    </>
  );
}
