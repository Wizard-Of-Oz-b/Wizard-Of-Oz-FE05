import Cookies from 'js-cookie'
const ACCESS_TOKEN_KEY = 'accessToken'


// 액세스 쿠키 가져오기
export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

// 액세스 토큰 설정하기
export function setAccessToken(token) {
  //1시간
  return Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 1/24 })
}

// 액세스토큰 제거 (로그아웃)
export function removeAccessToken(){
  return Cookies.remove(ACCESS_TOKEN_KEY);
}