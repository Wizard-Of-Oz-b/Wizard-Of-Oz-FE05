import React, { useEffect, useState } from "react";
import ShipmentsHeader from "../../components/common/layouts/admin/shipment/ShipmentsHeader";
import Pagination from "../../components/common/layouts/admin/members/Pagination";
import { listShipments } from "../../components/common/api/common/shipments";
import ShipmentsTable from "../../components/common/layouts/admin/shipment/ShipmentsTable";

export default function AdminShipmentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [pageCount, setPageCount] = useState(1);
  const load = async (p = 1) => {
    try {
      setLoading(true);
      const data = await listShipments({ page: p, size: pageSize });
      setRows(data);
      setPageCount(data?.length === pageSize ? p + 1 : p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      <ShipmentsHeader
        onRefresh={() => load(page)}
        onClickRegister={() => {
          // TODO: 운송장 등록 모달/페이지 연결해야됨.
          console.info("운송장 등록 클릭");
        }}
      />

      <ShipmentsTable rows={rows} loading={loading} pageSize={pageSize} />

      <Pagination
        page={page}
        pageCount={pageCount}
        goFirst={() => setPage(1)}
        goPrev={() => setPage((p) => Math.max(1, p - 1))}
        goNext={() => setPage((p) => p + 1)}
        goLast={() => setPage(pageCount)}
      />
    </div>
  );
}
