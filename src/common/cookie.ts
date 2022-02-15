import Cookies from 'js-cookie'

class CookieGetter {
	getAccessToken() {
		return Cookies.get('accesstoken') || ''
	}

	setAccessToken(token: string) {
		Cookies.set('accesstoken', token)
	}
}

export const cookie = new CookieGetter()
