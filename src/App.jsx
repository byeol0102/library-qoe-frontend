import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            도서관 네트워크 품질 관리
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
            AI 기반 실시간 네트워크 품질 예측 시스템
          </p>
          
          {/* 기능 배지 */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-600">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {/* 텍스트가 한 줄로 표시되도록 whitespace-nowrap 추가 */}
                <span className="whitespace-nowrap">실시간 모니터링</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {/* 텍스트가 한 줄로 표시되도록 whitespace-nowrap 추가 */}
                <span className="whitespace-nowrap">AI 예측</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                {/* 텍스트가 한 줄로 표시되도록 whitespace-nowrap 추가 */}
                <span className="whitespace-nowrap">최적화 추천</span>
              </div>
          </div>
        </div>
        
        {/* 메인 버튼 섹션 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 관리자 대시보드 */}
          <Link
            to="/admin"
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 p-8 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">관리자 대시보드</h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                네트워크 상태 모니터링 및 관리
              </p>
              <div className="mt-auto pt-4 w-full">
                <div className="inline-flex items-center space-x-2 text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                  <span>바로가기</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
          
          {/* 이용객 가이드 */}
          <Link
            to="/user"
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 p-8 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">이용객 가이드</h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                최적의 공부 장소 AI 추천
              </p>
              <div className="mt-auto pt-4 w-full">
                <div className="inline-flex items-center space-x-2 text-emerald-600 font-semibold text-sm group-hover:text-emerald-700">
                  <span>바로가기</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* 하단 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-center text-gray-600 mb-4 text-sm">
            실시간 AI 예측으로 최적의 네트워크 환경을 제공합니다
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>실시간 업데이트</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>안전한 데이터</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
