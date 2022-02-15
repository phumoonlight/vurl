const { VITE_APP_API_URL = 'https://nidavellir.phumon.com/' } = import.meta.env

export const ENV = {
	APP_API_URL: VITE_APP_API_URL as string,
}
