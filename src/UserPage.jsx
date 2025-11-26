import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function UserPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedFloor, setSelectedFloor] = useState(null); // 선택된 층 (예: "1F", "B1")
  const [floorDashboard, setFloorDashboard] = useState(null); // 선택된 층의 대시보드 데이터
  const [loadingFloor, setLoadingFloor] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/recommend`)
      .then((res) => {
        setData(res.data);
        setError(null);
        setLastUpdate(new Date());
      })
      .catch((err) => {
        console.error("❌ 추천 데이터 로딩 실패:", err);
        setError("데이터를 불러올 수 없습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    // 30초마다 자동 갱신
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 층 선택 시 대시보드 데이터 로드
  useEffect(() => {
    if (!selectedFloor) {
      setFloorDashboard(null);
      return;
    }

    setLoadingFloor(true);
    axios
      .get(`${API_BASE}/api/dashboard?floor=${selectedFloor}`)
      .then((res) => {
        setFloorDashboard(res.data);
      })
      .catch((err) => {
        console.error("❌ 층별 데이터 로딩 실패:", err);
        setFloorDashboard(null);
      })
      .finally(() => {
        setLoadingFloor(false);
      });
  }, [selectedFloor]);

  // 층 이름에서 층 코드 추출 (예: "1F층" -> "1F")
  const getFloorCode = (zoneName) => {
    const match = zoneName.match(/(B2|B1|1F|2F)/);
    return match ? match[1] : null;
  };

  // 원형 프로그레스 바 컴포넌트 (grade에 따라 색상 변경)
  const CircularProgress = ({ value, max = 1, size = 100, isRecommended = false, grade = "Good" }) => {
    // QoE는 낮을수록 좋으므로, 품질 퍼센트는 (1 - value) * 100
    const qualityPercent = Math.max(0, Math.min(100, (1 - value / max) * 100));
    const radius = size / 2 - 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (qualityPercent / 100) * circumference;
    
    // grade에 따른 색상 결정
    const getGradientColors = () => {
      if (grade === "Moderate") {
        return {
          start: "#fbbf24", // amber-400
          mid: "#f59e0b",   // amber-500
          end: "#d97706"    // amber-600
        };
      } else if (grade === "Bad") {
        return {
          start: "#ef4444", // red-500
          mid: "#dc2626",   // red-600
          end: "#b91c1c"    // red-700
        };
      } else {
        // Good 또는 기본값: 시안색
        return {
          start: "#06b6d4", // cyan-500
          mid: "#22d3ee",   // cyan-400
          end: "#67e8f9"    // cyan-300
        };
      }
    };
    
    const colors = getGradientColors();
    const gradientId = `gradient-${grade}-${isRecommended ? 'rec' : 'normal'}-${value}`;
    
    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="50%" stopColor={colors.mid} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>
          {/* 배경 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          {/* 진행 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ 
              filter: isRecommended 
                ? (grade === "Moderate" 
                    ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' 
                    : 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))')
                : 'none' 
            }}
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-lg font-semibold text-gray-900">{value.toFixed(2)}</div>
          <div className="text-xs text-gray-500 font-medium">QoE</div>
        </div>
      </div>
    );
  };

  // 상태 배지 컴포넌트
  const StatusBadge = ({ grade, isRecommended = false }) => {
    const config = {
      Good: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      Moderate: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      },
      Bad: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      }
    };

    const style = config[grade] || config.Moderate;

    return (
      <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border ${style.bg} ${style.text} ${style.border} ${isRecommended ? 'ring-2 ring-cyan-300' : ''}`}>
        {style.icon}
        <span className="text-xs font-semibold">{grade}</span>
      </div>
    );
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-base font-medium">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">오류 발생</h2>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm shadow-lg"
              >
                다시 시도
              </button>
              <Link
                to="/"
                className="block w-full text-center text-gray-600 hover:text-gray-900 font-medium text-sm py-2 transition-colors"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 바 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">네트워크 품질 가이드</h1>
              <p className="text-sm text-gray-500 mt-1">AI 기반 실시간 예측 시스템</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right mr-4">
                <div className="text-xs text-gray-500">마지막 업데이트</div>
                <div className="text-sm font-semibold text-gray-700">{lastUpdate.toLocaleTimeString('ko-KR')}</div>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                    <span>갱신 중</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>새로고침</span>
                  </>
                )}
              </button>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>홈</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 추천 장소 카드 */}
        {data && data.best_zone && data.zones && data.zones.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-cyan-100 rounded-lg">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-cyan-600 uppercase tracking-wide mb-1">추천 장소</p>
                    <h2 className="text-2xl font-bold text-gray-900">{data.best_zone}</h2>
                  </div>
                </div>
                <p className="text-gray-600 ml-12 mb-3">{data.message}</p>
                <div className="flex items-center space-x-4 ml-12">
                  <StatusBadge grade={data.zones[0].grade} isRecommended={true} />
                  <span className="text-sm text-gray-500">
                    QoE 점수: <span className="font-semibold text-gray-900">{data.zones[0].qoe}</span>
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <CircularProgress 
                  value={data.zones[0].qoe} 
                  max={1} 
                  size={100}
                  isRecommended={true}
                  grade={data.zones[0].grade}
                />
              </div>
            </div>
          </div>
        )}

        {/* 층별 상태 카드 그리드 */}
        {data && data.zones && data.zones.length > 0 && (
          <div className="mb-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">전체 층별 네트워크 상태</h2>
              <p className="text-xs text-gray-500">QoE 점수가 낮을수록 좋은 상태입니다. 층을 클릭하면 지도와 AP 위치를 확인할 수 있습니다.</p>
            </div>
            <div className="space-y-3">
              {data.zones.map((zone, index) => {
                const isRecommended = index === 0;
                const floorCode = getFloorCode(zone.name);
                const isSelected = selectedFloor === floorCode;
                
                return (
                  <div
                    key={zone.name}
                    onClick={() => {
                      if (floorCode) {
                        setSelectedFloor(isSelected ? null : floorCode);
                      }
                    }}
                    className={`bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
                      isRecommended ? 'border-cyan-300 border-2' : ''
                    } ${isSelected ? 'ring-2 ring-cyan-500 bg-cyan-50/30' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      {/* 왼쪽: 층 이름 */}
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className="text-2xl font-black text-gray-900" style={{fontWeight: 500}}>{zone.name}</span>
                        {isRecommended && (
                          <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-cyan-50 border border-cyan-200 rounded text-xs font-medium text-cyan-700">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>추천</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 중앙: QoE, AP 개수, 품질, 상태 배지 한 줄 */}
                      <div className="flex items-center space-x-6 flex-1 justify-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">QoE:</span>
                          <span className="text-sm font-semibold text-gray-900">{zone.qoe}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">AP:</span>
                          <span className="text-sm font-semibold text-gray-900">{zone.ap_count}개</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">품질:</span>
                          <span className="text-sm font-semibold text-cyan-600">
                            {Math.max(0, Math.min(100, (1 - zone.qoe) * 100)).toFixed(0)}%
                          </span>
                        </div>
                        <StatusBadge grade={zone.grade} isRecommended={isRecommended} />
                      </div>
                      
                      {/* 오른쪽: 원형 프로그레스 바 */}
                      <div className="flex-shrink-0 ml-4">
                        <CircularProgress 
                          value={zone.qoe} 
                          max={1} 
                          size={70}
                          isRecommended={isRecommended}
                          grade={zone.grade}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 선택된 층의 지도 및 AP 위치 */}
        {selectedFloor && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {selectedFloor === "B2" ? "B2층" : selectedFloor === "B1" ? "B1층" : selectedFloor === "1F" ? "1층" : selectedFloor === "2F" ? "2층" : selectedFloor} 지도
                </h2>
                <p className="text-xs text-gray-500">AP 위치를 확인하세요</p>
              </div>
              <button
                onClick={() => setSelectedFloor(null)}
                className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>닫기</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loadingFloor ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-cyan-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
                  </div>
                </div>
              ) : floorDashboard && floorDashboard.aps && floorDashboard.aps.length > 0 ? (
                <div className="relative" style={{ height: "500px", position: "relative" }}>
                  {/* 평면도 이미지 */}
                  <img
                    src={`/maps/${selectedFloor}.png`}
                    alt={`${selectedFloor} Floor Plan`}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* AP 마커들 */}
                  {floorDashboard.aps.map((ap) => (
                    <button
                      key={ap.id}
                      className={`absolute w-10 h-10 rounded-lg border-2 border-white shadow-lg flex items-center justify-center font-semibold text-xs text-white transition-all hover:scale-110 hover:shadow-xl ${
                        ap.status === "Good"
                          ? "bg-emerald-600"
                          : ap.status === "Moderate"
                          ? "bg-amber-500"
                          : "bg-red-600"
                      }`}
                      style={{
                        left: `${ap.x}%`,
                        top: `${ap.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title={`${ap.id}\n상태: ${ap.status}\nQoE: ${ap.qoe}`}
                    >
                      AP
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-sm text-gray-600">이 층에는 AP 데이터가 없습니다.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4">품질 등급 기준</h3>
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-start space-x-2.5 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-0.5">Good</div>
                <div className="text-xs text-gray-600">쾌적한 네트워크 환경 (QoE ≤ 0.2)</div>
              </div>
            </div>
            <div className="flex items-start space-x-2.5 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-0.5">Moderate</div>
                <div className="text-xs text-gray-600">보통 수준의 네트워크 (0.2 &lt; QoE ≤ 0.4)</div>
              </div>
            </div>
            <div className="flex items-start space-x-2.5 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-0.5">Bad</div>
                <div className="text-xs text-gray-600">네트워크 상태 불량 (QoE &gt; 0.4)</div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              네트워크 상태는 30초마다 자동으로 업데이트됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
