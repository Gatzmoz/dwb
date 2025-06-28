export interface LocationDataGPS {
	latitude: number;
	longitude: number;
	city?: string;
	timezone?: string;
	error?: string;
}

const LOCATION_CACHE_KEY = 'location_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function getLocationDataGPS(): Promise<LocationDataGPS> {
	// Check cache first
	const cached = localStorage.getItem(LOCATION_CACHE_KEY);
	if (cached) {
		const { timestamp, data } = JSON.parse(cached);
		if (Date.now() - timestamp < CACHE_DURATION) {
			return data;
		}
	}

	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			return reject({
				error: 'Geolocation is not supported by your browser.',
			});
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;

				try {
					// Reverse geocode to get city
					const geoRes = await fetch(
						`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
					);

					if (!geoRes.ok) {
						throw new Error('Failed to fetch city data');
					}

					const geoData = await geoRes.json();
					const city =
						geoData.address.city ||
						geoData.address.town ||
						geoData.address.village ||
						geoData.address.county;

					const locationData: LocationDataGPS = {
						latitude,
						longitude,
						city,
					};

					// Cache it
					localStorage.setItem(
						LOCATION_CACHE_KEY,
						JSON.stringify({
							timestamp: Date.now(),
							data: locationData,
						})
					);

					resolve(locationData);
				} catch (err: any) {
					console.warn(
						'Reverse geocoding or timezone fetch failed:',
						err.message
					);
					resolve({ latitude, longitude });
				}
			},
			(error) => {
				reject({ error: error.message });
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		);
	});
}
