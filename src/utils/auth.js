import Cookies from 'js-cookie';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';

export const authUtils = {
  saveTokens: (access, refresh) => {
    Cookies.set(ACCESS_TOKEN, access, { expires: 1, secure: true, sameSite: 'strict' });
    if (refresh) {
      Cookies.set(REFRESH_TOKEN, refresh, { expires: 7, secure: true, sameSite: 'strict' });
    }
  },

  getAccessToken: () => Cookies.get(ACCESS_TOKEN),
  
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN),

  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
  }
};