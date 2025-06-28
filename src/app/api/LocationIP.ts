export interface LocationData {
	ip: string;
	city: string;
	region: string;
	country_name: string;
	latitude: number;
	longitude: number;
	timezone: string;
	timezone_abbreviation: string;
	utc_offset_seconds: number;
	is_eu: boolean;
	country_code: string;
	country_code_iso3: string;
	country_code_iso2: string;
	country_capital: string;
	country_tld: string;
}

export async function getLocationData(): Promise<LocationData> {
	try {
		const response = await fetch('https://ipwho.is/');
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Proxy failed. Status: ${response.status}, Message: ${errorText}`
			);
		}

		const data = await response.json();

		if ('error' in data) {
			throw new Error(data.error);
		}

		return data;
	} catch (error) {
		console.error('Error fetching location:', error);
		throw new Error('Could not fetch location data.');
	}
}
