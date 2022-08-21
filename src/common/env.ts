const { VITE_APP_API_URL = 'https://nydus.phumon.com/' } = import.meta.env

export const ENV = {
	APP_API_URL: VITE_APP_API_URL as string,
}
