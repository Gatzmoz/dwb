'use client';

import React from 'react';
import { WeatherData } from '../types/forecast';
import { Droplet, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherCard: React.FC<WeatherData> = ({ city, daily, daily_units }) => {
	return (
		<div className='max-w-5xl mx-auto p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100'>
			<h2 className='text-3xl font-extrabold mb-8 text-center text-blue-700 flex justify-center items-center gap-2'>
				<CalendarDays className='w-7 h-7 text-blue-500' />
				7-Day Forecast for {city}
			</h2>

			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4'>
				{daily.time.map((date, idx) => {
					const formattedDate = new Date(date).toLocaleDateString(
						undefined,
						{
							weekday: 'short',
							month: 'short',
							day: 'numeric',
						}
					);

					const rain = daily.precipitation_sum[idx];
					const unit = daily_units.precipitation_sum;

					return (
						<motion.div
							key={date}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: idx * 0.05 }}
							className='p-4 bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 border border-blue-100 flex flex-col items-center'
						>
							<p className='font-medium text-blue-700'>
								{formattedDate}
							</p>
							<Droplet className='w-6 h-6 mt-2 text-blue-400' />
							<p className='text-xl font-bold text-blue-800 mt-1'>
								{rain} {unit}
							</p>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
};

export default WeatherCard;
