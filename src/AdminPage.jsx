// frontend/src/pages/AdminPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function AdminPage() {
  const [dashboard, setDashboard] = useState(null);
  const [selectedAp, setSelectedAp] = useState(null);
  const [currentFloor, setCurrentFloor] = useState("1F"); // 기본층

  // 층별 대시보드 데이터 로드
  useEffect(() => {
    setDashboard(null);

    axios
      .get(`${API_BASE}/api/dashboard?floor=${currentFloor}`)
      .then((res) => {
        console.log("✅ 대시보드 데이터:", res.data);
        setDashboard(res.data);
        setSelectedAp(null);
      })
      .catch((err) => {
        console.error("❌ 대시보드 로딩 실패:", err);
      });
  }, [currentFloor]);

  // AP 클릭 → 상세 예측
  const handleApClick = (apId) => {
    axios
      .get(`${API_BASE}/api/predict/${apId}`)
      .then((res) => {
        console.log("✅ 상세 예측:", res.data);
        setSelectedAp(res.data);
      })
      .catch((err) => {
        console.error("❌ 예측 로딩 실패:", err);
      });
  };

  if (!dashboard) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-base font-medium">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 왼쪽: 지도 + 요약 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 바 - B2B SaaS 스타일 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                네트워크 모니터링 대시보드
              </h1>
              <p className="text-sm text-gray-500 mt-1">실시간 품질 모니터링 및 예측</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={currentFloor}
                onChange={(e) => setCurrentFloor(e.target.value)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="B2">B2 (지하 2층)</option>
                <option value="B1">B1 (지하 1층)</option>
                <option value="1F">1F (1층)</option>
                <option value="2F">2F (2층)</option>
              </select>
              <a
                href="/"
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>홈</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col overflow-hidden">

        {/* 🔹 지도 + AP 마커 */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* ⚠️ 이 div가 AP 버튼들의 기준이 되는 컨테이너 */}
          <div
            className="w-full h-full"
            style={{ position: "relative" }} // ← 인라인로 확실히 relative
          >
            {/* 평면도 이미지 */}
            <img
              src={`/maps/${currentFloor}.png`}
              alt="Floor Plan"
              className="w-full h-full object-contain cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                const msg = `"${selectedAp ? selectedAp.ap_id : "AP_ID_HERE"}": (${x.toFixed(
                  1
                )}, ${y.toFixed(1)}),`;
                console.log(msg);
                alert(
                  `이 위치의 좌표를 backend FIXED_POSITIONS에 붙여넣으세요:\n\n${msg}`
                );
              }}
            />

            {/* 🔥 지도 위 AP 마커들 */}
            {dashboard.aps.map((ap) => (
              <button
                key={ap.id}
                className={`w-9 h-9 rounded-lg border-2 border-white shadow-lg flex items-center justify-center font-semibold text-[10px] text-white transition-all hover:scale-110 hover:shadow-xl
                  ${
                    ap.status === "Good"
                      ? "bg-emerald-600"
                      : ap.status === "Moderate"
                      ? "bg-amber-500"
                      : "bg-red-600"
                  }`}
                style={{
                  position: "absolute",        // ← 인라인 absolute
                  left: `${ap.x}%`,
                  top: `${ap.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleApClick(ap.id);
                }}
                title={`${ap.id} (${ap.status})`}
              >
                AP
              </button>
            ))}

            {/* 데이터 없을 때 */}
            {dashboard.aps.length === 0 && (
              <div
                className="flex items-center justify-center bg-gray-100/80 text-gray-500 font-bold"
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              >
                ⚠️ 데이터가 없습니다. CSV의 'location2'와 floor 값을 확인하세요.
              </div>
            )}
          </div>
        </div>

        {/* 요약 바 - B2B SaaS 스타일 */}
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900 mb-1">{dashboard.aps.length}</div>
              <div className="text-xs text-gray-500 font-medium">총 AP 개수</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border-l border-r border-gray-200">
              <div className="text-2xl font-semibold text-red-600 mb-1">{dashboard.alert_count}</div>
              <div className="text-xs text-gray-500 font-medium">점검 필요</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-semibold text-emerald-600 mb-1">
                {dashboard.aps.length - dashboard.alert_count}
              </div>
              <div className="text-xs text-gray-500 font-medium">정상 작동</div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* 🔹 오른쪽: 상세 패널 - B2B SaaS 스타일 */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">상세 정보</h2>
          <p className="text-xs text-gray-500 mt-1">지도에서 AP를 클릭하세요</p>
        </div>
        <div className="p-6">
        {selectedAp ? (
          <div className="space-y-5">
            {/* AP 이름 */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">AP ID</p>
              <h3 className="text-sm font-semibold text-gray-900 break-all leading-tight font-mono">
                {selectedAp.ap_id}
              </h3>
            </div>

            {/* 현재 / 5분 후 등급 카드 - B2B SaaS 스타일 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 현재 상태 */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  {selectedAp.current_time_text}
                </p>
                <div className={`text-xl font-semibold mb-1 ${
                  selectedAp.current_grade === "Good"
                    ? "text-emerald-600"
                    : selectedAp.current_grade === "Moderate"
                    ? "text-amber-600"
                    : "text-red-600"
                }`}>
                  {selectedAp.current_grade}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {selectedAp.current_qoe}
                </div>
                <div className="text-xs text-gray-500 mt-1">QoE</div>
              </div>

              {/* 5분 뒤 예측 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                  {selectedAp.future_time_text}
                </p>
                <div className={`text-xl font-semibold mb-1 ${
                  selectedAp.future_grade === "Good"
                    ? "text-emerald-600"
                    : selectedAp.future_grade === "Moderate"
                    ? "text-amber-600"
                    : "text-red-600"
                }`}>
                  {selectedAp.future_grade}
                </div>
                <div className="text-lg font-semibold text-blue-900">
                  {selectedAp.future_qoe}
                </div>
                <div className="text-xs text-blue-600 mt-1">예측</div>
              </div>
            </div>

            {/* 수치 데이터 - B2B SaaS 스타일 */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                네트워크 메트릭
              </h3>
              
              {/* 다운로드 속도 */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                      다운로드 속도
                    </div>
                    <div className="text-2xl font-semibold text-blue-900">
                      {selectedAp.metrics.download_Mbps
                        ? selectedAp.metrics.download_Mbps.toFixed(1)
                        : 0}
                    </div>
                    <div className="text-xs text-blue-600 font-medium mt-0.5">Mbps</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 업로드 속도 */}
              {selectedAp.metrics.upload_Mbps && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">
                        업로드 속도
                      </div>
                      <div className="text-2xl font-semibold text-emerald-900">
                        {selectedAp.metrics.upload_Mbps.toFixed(1)}
                      </div>
                      <div className="text-xs text-emerald-600 font-medium mt-0.5">Mbps</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* 기타 메트릭 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Ping
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    {selectedAp.metrics.ping_ms ? selectedAp.metrics.ping_ms.toFixed(0) : 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">ms</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Loss
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    {selectedAp.metrics.packet_loss_rate || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">%</div>
                </div>
              </div>

              {/* RSSI */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  RSSI (신호강도)
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {selectedAp.metrics.RSSI || "-"}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">dBm</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <p>지도에서 AP를 선택하세요.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
