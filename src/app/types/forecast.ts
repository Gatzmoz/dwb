export interface WeatherData {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	hourly_units: {
		time: string;
		temperature_2m: string;
		surface_temperature: string;
		surface_pressure: string;
		relative_humidity_2m: string;
		precipitation_probability: string;
		precipitation: string;
		weathercode: string;
		wind_speed_10m: string;
	};
	hourly: {
		time: string[];
		temperature_2m: number[];
		surface_temperature: number[];
		surface_pressure: number[];
		relative_humidity_2m: number[];
		precipitation_probability: number[];
		precipitation: number[];
		weathercode: number[];
		wind_speed_10m: number[];
	};
	daily_units: {
		time: string;
		precipitation_sum: string;
	};
	daily: {
		time: string[];
		precipitation_sum: number[];
	};
	current: {
		time: string;
		temperature_2m: number;
		is_day: number;
		precipitation: number;
		weathercode: number;
	};
	city?: string;
	wind_speed_unit?: string;
}
