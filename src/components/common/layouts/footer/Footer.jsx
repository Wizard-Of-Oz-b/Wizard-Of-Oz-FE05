import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Mail, ChevronUp, Globe, Instagram, Facebook, Youtube, MessageCircle,
  ShieldCheck, Download
} from "lucide-react";

const CONFIG = {
  tel: "1670-9600",
  hours: "상담시간 : 오전 10시~오후 5시(토요일, 공휴일 휴무)",
  emails: [
    { label: "단체주문 문의", value: "oz@wizardofoz.co.kr" },
    { label: "마케팅 협찬 문의", value: "oz_mkt@wizardofoz.co.kr" },
  ],
  linkColumns: [
  [
    { label: "브랜드소개", href: "#" },
    { label: "오프라인 매장안내", href: "/info" },
    { label: "윤리경영", href: "#" },
  ],
  [
    { label: "개인정보 처리방침", href: "#" },
    { label: "약관안내", href: "#" },
    { label: "채용정보 및 인사제도", href: "#" },
    { label: "공지사항", href: "#" },
    { label: "회원혜택", href: "#" },
    { label: "자주묻는질문 FAQ", href: "#" },
  ],
],
  familySites: [
    { label: "패밀리 사이트", value: "" },
    { label: "오즈식품", value: "https://www.oz-food.com" },
  ],
  companyLine:
    "(주)오즈의 이상한 상점 ㅣ 사업자등록번호 : 123-45-19030 ㅣ 통신판매업 신고번호 : 2025-서울강서-2203 ㅣ 대표이사 : 이형운 ㅣ 서울 강서구 마곡동로 ㅣ 개인정보 보호책임자 : 이형운 ㅣ 호스팅 서비스 제공자 : 오즈24(주)\n사옥 주소로는 상품을 발송하시면 교환 · 환불이 불가하므로, 교환 · 환불은 사이트 내에서 신청해주시기 바랍니다.",
  socials: [
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "Facebook", href: "#", icon: Facebook },
    { label: "YouTube", href: "#", icon: Youtube },
    { label: "KakaoTalk", href: "#", icon: MessageCircle },
  ],
  appDownload: { label: "오즈의 이상한 상점 APP 다운로드", href: "https://play.google.com/store/games?pli=1" },
  escrow: { label: "구매안전(에스크로)서비스", href: "#" },
};

export default function Footer() {
  const location = useLocation(); // Footer 컴포넌트 내에서 현재 경로를 가져옵니다.
  const isHomepage = location.pathname === "/";

  const onChangeFamily = (e) => {
    const url = e.target.value;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    e.target.selectedIndex = 0;
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  
  // 메인 페이지가 아닐 때만 mt-6 클래스를 추가합니다.
  const footerClass = `bg-[#0e0f12] text-gray-200 ${!isHomepage ? 'mt-6' : ''}`;

  return (
    <footer className={footerClass}>
      <div className="mx-auto max-w-8xl px-6 py-12">
        {/* 상단 */}
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* 좌측 정보 */}
          <div className="md:max-w-3xl">
            <div className="text-3xl font-extrabold tracking-tight text-white">{CONFIG.tel}</div>
            <p className="mt-2 text-sm text-gray-400">{CONFIG.hours}</p>

            <div className="mt-2 space-y-1 text-sm">
              {CONFIG.emails.map(({ label, value }) => (
                <div key={value} className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">email :</span>
                  <a className=" hover:text-white" href={`mailto:${value}`}>
                    {value}
                  </a>
                  <span className="text-gray-500">({label})</span>
                </div>
              ))}
            </div>
          </div>

          {/* 우측 링크 + 패밀리 사이트 */}
          <div className="md:min-w-[340px]">
            <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
              {CONFIG.linkColumns.map((col, i) => (
                <ul key={i} className="space-y-2">
                  {col.map(({ label, href }) => (
                    <li key={label}>
                      {href.startsWith("/") ? (
                        <Link
                          to={href}
                          className={`text-gray-300 hover:text-white ${
                            label.includes("개인정보") ? "font-semibold text-white" : ""
                          }`}
                          >
                            {label}
                          </Link>
                      ) : (
                        <a
                          href={href}
                          className={`text-gray-300 hover:text-white ${
                            label.includes("개인정보") ? "font-semibold text-white" : ""
                            }`}
                            >
                          {label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <div className="mt-4">
              <label className="sr-only" htmlFor="family-sites">패밀리 사이트</label>
              <select
                id="family-sites"
                onChange={onChangeFamily}
                className="w-full md:w-auto rounded-lg border border-gray-700 bg-[#15181e] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                defaultValue=""
              >
                {CONFIG.familySites.map(({ label, value }) => (
                  <option key={label} value={value} className="bg-[#0e0f12]">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 구분선 + 회사 정보 */}
        <div className="my-8 h-px bg-gray-700" />
        <div className="whitespace-pre-wrap text-xs leading-6 text-gray-400">
          {CONFIG.companyLine}
        </div>

        {/* 하단 */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* 좌: 에스크로 + 소셜 */}
          <div className="flex items-center gap-4">
            <a href={CONFIG.escrow.href} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
              <ShieldCheck className="w-4 h-4" />
              {CONFIG.escrow.label}
            </a>
            <span className="mx-2 hidden text-gray-600 md:inline">|</span>
            <div className="flex items-center gap-3">
              {CONFIG.socials.map(({ label, href, icon: Icon }) => (
                <a key={label} aria-label={label} href={href} className="text-gray-400 hover:text-white">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 앱 다운로드  */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CONFIG.appDownload.href}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-[#15181e] px-3 py-2 text-sm text-gray-200 hover:border-gray-500"
            >
              <Download className="w-4 h-4" />
              {CONFIG.appDownload.label}
            </a>
          </div>
        </div>
      </div>

      {/* 페이로 위로 보내는 스티키버튼 */}
      {/* <button
        onClick={scrollTop}
        aria-label="맨 위로"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-[#15181e] text-gray-200 p-3 shadow-lg ring-1 ring-gray-700 hover:bg-[#1b1f26]"
      >
        <ChevronUp className="w-5 h-5" />
      </button> */}
    </footer>
  );
}