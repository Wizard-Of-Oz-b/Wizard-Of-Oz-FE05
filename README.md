# 🚀 Wizard-Of-Oz FE (로컬 실행 가이드)

> 백엔드 연동 테스트를 위한 **프론트엔드 로컬 실행 방법**  
> Vite + React + TailwindCSS 기반

---

## ✅ 빠른 시작 (3줄 요약)
```bash
git clone -b develop --single-branch https://github.com/Wizard-Of-Oz-b/Wizard-Of-Oz-FE05.git
cd Wizard-Of-Oz-FE05
npm install
npm run dev
```

- 기본 포트: **5173**  
- 접속 주소: [http://localhost:5173](http://localhost:5173)

---

## 🧩 요구 사항
- **Node.js**: 18 LTS 이상 권장  
- **npm**: 9+ (yarn/pnpm도 가능)

```bash
node -v
npm -v
```

---

## 🏃 실행 & 스크립트
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

- Vite 기본 설정 (`vite.config.js`)
  ```js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    base: '/',
    plugins: [tailwindcss(), react()],
    server: { port: 5173 },
  })
  ```

---

## 🔗 확인 시나리오
1. `npm run dev` 실행 후 브라우저에서 페이지 열림 확인  
2. 메뉴/페이지 전환 정상 동작 확인  

---
