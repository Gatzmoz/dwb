'use client';
import React from 'react';
import WeatherFetcher from '../api/weather';
import WeatherCard from './WeatherCard';
import { getLocationData } from '../api/LocationIP';

export default function Forecast() {
	const weatherData = WeatherFetcher();

	return (
		<div className='flex flex-col items-center justify-center w-full p-4'>
			<h1 className='text-2xl text-black font-bold mb-4'>
				Weekly Weather Forecast
			</h1>

			{weatherData ? (
				<WeatherCard {...weatherData} />
			) : (
				<p className='text-gray-500'>Loading weather data...</p>
			)}
		</div>
	);
}
