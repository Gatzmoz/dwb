import { useEffect, useState } from 'react';
import { WeatherData } from '../types/forecast';
import { getLocationDataGPS, LocationDataGPS } from './LocationGPS'; // Assume it returns a Promise<LocationDataGPS>

const CACHE_KEY = 'weather_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export default function useWeatherData() {
	const [data, setData] = useState<WeatherData | null>(null);

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const location: LocationDataGPS | null =
					await getLocationDataGPS();
				if (!location) return;

				const cached = localStorage.getItem(CACHE_KEY);
				if (cached) {
					const { timestamp, weather } = JSON.parse(cached);
					if (Date.now() - timestamp < CACHE_DURATION) {
						setData(weather);
						return;
					}
				}

				const params = new URLSearchParams({
					latitude: location.latitude.toString(),
					longitude: location.longitude.toString(),
					daily: 'precipitation_sum',
					hourly: [
						'temperature_2m',
						'surface_temperature',
						'surface_pressure',
						'relative_humidity_2m',
						'precipitation_probability',
						'precipitation',
						'weathercode',
						'wind_speed_10m',
					].join(','),
					models: 'gfs_seamless',
					timezone: 'auto',
					current: [
						'temperature_2m',
						'is_day',
						'precipitation',
						'weathercode',
					].join(','),
					wind_speed_unit: 'ms',
				});

				const response = await fetch(
					`https://api.open-meteo.com/v1/forecast?${params}`
				);
				if (!response.ok)
					throw new Error(`API error: ${response.status}`);

				const json = await response.json();
				const enriched = {
					...json,
					city: location.city || 'Unknown',
				} as WeatherData;
				setData(enriched);
				localStorage.setItem(
					CACHE_KEY,
					JSON.stringify({
						timestamp: Date.now(),
						weather: enriched,
					})
				);
			} catch (err) {
				console.error('Weather fetch error:', err);
			}
		};

		fetchWeather();
	}, []);

	return data;
}
