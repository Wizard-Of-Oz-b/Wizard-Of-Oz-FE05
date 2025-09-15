import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/", { replace: true }), 1500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">403 Forbidden</h1>
      <p>접근 권한이 없습니다. 메인으로 이동합니다…</p>
    </div>
  );
}
