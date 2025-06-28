'use client';
import { format } from 'date-fns';
import WeatherFetcher from '../api/weather';
import {
	Sun,
	Cloud,
	CloudSun,
	CloudFog,
	CloudDrizzle,
	CloudRain,
	Snowflake,
	CloudSnow,
	CloudLightning,
	CloudHail,
	HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

function getWeatherIcon(code: number, className = 'w-6 h-6') {
	const base = (Icon: any, color: string) => (
		<motion.div
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<Icon className={`${className} ${color}`} />
		</motion.div>
	);

	if (code === 0) return base(Sun, 'text-yellow-500');
	if ([1, 2].includes(code)) return base(CloudSun, 'text-yellow-400');
	if ([3].includes(code)) return base(Cloud, 'text-gray-500');
	if ([45, 48].includes(code)) return base(CloudFog, 'text-gray-400');
	if ([51, 53, 55, 56, 57].includes(code))
		return base(CloudDrizzle, 'text-blue-400');
	if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
		return base(CloudRain, 'text-blue-500');
	if ([71, 73, 75, 77].includes(code))
		return base(Snowflake, 'text-blue-300');
	if ([85, 86].includes(code)) return base(CloudSnow, 'text-blue-200');
	if ([95].includes(code)) return base(CloudLightning, 'text-yellow-600');
	if ([96, 99].includes(code)) return base(CloudHail, 'text-indigo-600');

	return base(HelpCircle, 'text-gray-400');
}

export default function Today() {
	const weather = WeatherFetcher();

	if (!weather) {
		return (
			<p className='text-center text-gray-500'>Loading weather data...</p>
		);
	}

	const { city, hourly } = weather;
	const currentHourIndex = new Date().getHours();
	const hoursToShow =
		hourly?.time?.slice(currentHourIndex, currentHourIndex + 6) || [];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className='max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-lg border text-black'
		>
			<motion.h1
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.6 }}
				className='text-3xl font-extrabold mb-6 text-center'
			>
				🌤️ Today’s Weather
			</motion.h1>

			{/* Current Weather */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.6 }}
				className='flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow'
			>
				<div>
					<p className='text-lg font-semibold'>
						📍 {city ?? 'Unknown'}
					</p>
					<p className='text-4xl font-bold'>
						{weather.current?.temperature_2m ?? '--'}°C
					</p>
					<p className='text-md text-gray-600 mt-1'>
						Condition:{' '}
						{weather.current?.precipitation > 0 ? 'Rainy' : 'Clear'}
					</p>
					<p className='text-md text-gray-600'>
						Humidity:{' '}
						{hourly?.relative_humidity_2m?.[currentHourIndex] ??
							'--'}
						%
					</p>
					<p className='text-md text-gray-600'>
						Wind Speed:{' '}
						{hourly?.wind_speed_10m?.[currentHourIndex] ?? '--'} m/s
					</p>
				</div>

				<div className='mt-4 md:mt-0'>
					{getWeatherIcon(weather.current.weathercode, 'w-32 h-32')}
				</div>
			</motion.div>

			{/* Hourly Forecast */}
			<h2 className='text-xl font-semibold mt-10 mb-4 text-center'>
				🕒 Next 6 Hours Forecast
			</h2>
			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
				{hoursToShow.map((time, i) => {
					const hourIdx = currentHourIndex + i;
					const temp = hourly?.temperature_2m?.[hourIdx];
					const precip = hourly?.precipitation?.[hourIdx];
					const humidity = hourly?.relative_humidity_2m?.[hourIdx];
					const code = hourly?.weathercode?.[hourIdx];

					return (
						<motion.div
							key={time}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
							className='p-4 bg-white rounded-lg shadow text-center flex flex-col items-center'
						>
							<p className='font-semibold'>
								{format(new Date(time), 'HH:mm')}
							</p>
							<div className='my-2'>{getWeatherIcon(code)}</div>
							<p className='text-sm'>🌡️ {temp ?? '--'}°C</p>
							<p className='text-sm'>💧 {precip ?? 0} mm</p>
							<p className='text-sm'>💨 {humidity ?? '--'}%</p>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
}
