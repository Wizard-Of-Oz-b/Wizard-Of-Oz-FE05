import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchMyAddresses } from "../../../../api/admin/addresses";

export default function CustomerAddressList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await fetchMyAddresses();
        setRows(list);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="lg:col-span-2">
        <div className="rounded-2xl border border-gray-100 p-5 bg-white">
          <h4 className="font-semibold mb-4">등록된 배송지</h4>
          <div className="text-sm text-gray-500">불러오는 중…</div>
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="lg:col-span-2">
        <div className="rounded-2xl border border-rose-200 p-5 bg-white">
          <h4 className="font-semibold mb-4">등록된 배송지</h4>
          <div className="text-sm text-rose-600">
            배송지 목록을 불러오지 못했어요. ({String(err?.message || "Error")})
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-2">
      <div className="rounded-2xl border border-gray-100 p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">등록된 배송지</h4>
          <span className="text-xs text-gray-400">{rows.length}건</span>
        </div>

        {rows.length === 0 ? (
          <div className="text-sm text-gray-500">등록된 배송지가 없습니다.</div>
        ) : (
          <ul className="space-y-3">
            {rows.map((a) => (
              <li
                key={a.address_id}
                className="rounded-xl border border-gray-100 p-4 shadow-sm bg-gray-50"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm font-medium">
                    {a.recipient} <span className="text-gray-400">/</span> {a.phone}
                  </span>
                  {a.is_default && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-violet-100 text-violet-700 border border-violet-200">
                      기본 배송지
                    </span>
                  )}
                  {!a.is_active && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
                      비활성
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-700">
                  <div className="flex gap-2">
                    <span className="text-gray-500">우편번호</span>
                    <span>{a.postcode || "-"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">주소</span>
                    <span>
                      {a.address1} {a.address2 ? `, ${a.address2}` : ""}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  업데이트:{" "}
                  {a.updated_at
                    ? dayjs(a.updated_at).format("YYYY-MM-DD HH:mm")
                    : "-"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
