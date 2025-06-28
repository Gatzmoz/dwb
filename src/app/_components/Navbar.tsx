'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Map, Newspaper, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLocationDataGPS } from '../api/LocationGPS';

const navLinks = [
	{ name: 'Today', href: '/', icon: Sun },
	{ name: 'Map', href: '/map', icon: Map },
	{ name: 'News', href: '/news', icon: Newspaper },
];

const Logo = () => (
	<motion.svg
		initial={{ rotate: 0 }}
		animate={{ rotate: [0, 20, -20, 0] }}
		transition={{ duration: 2, repeat: Infinity }}
		width='40'
		height='40'
		viewBox='0 0 159 132'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M107.828 35.8279C107.828 35.8279 123.656 42.1569 127.828 53.8279C132 65.4989 123.656 79.2429 113.656 81.0539C103.656 82.8659 91.0282 76.1659 87.8282 68.6559'
			stroke='#3b82f6'
			strokeWidth='10'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		{/* ... Rest of SVG Paths */}
	</motion.svg>
);

export default function Navbar() {
	const [location, setLocation] = useState<string>('Loading...');
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [time, setTime] = useState(new Date());

	// Get scroll state
	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 10);
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	// Live clock
	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Fetch location once
	useEffect(() => {
		getLocationDataGPS()
			.then((loc) => {
				setLocation(loc.city ?? 'Your Location');
			})
			.catch(() => setLocation('Unknown'));
	}, []);

	const formattedDate = time.toLocaleDateString(undefined, {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	});
	const formattedTime = time.toLocaleTimeString(undefined, {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.4 }}
			className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
				isScrolled
					? 'bg-white/80 shadow-lg dark:bg-white/50'
					: 'bg-transparent text-black'
			}`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-20'>
					{/* Logo */}
					<div className='flex items-center space-x-3'>
						<Logo />
						<div className='text-xl font-bold text-blue-600'>
							Daily Weather
						</div>
					</div>

					{/* Desktop Nav */}
					<div className='hidden text-black md:flex space-x-6 items-center'>
						{navLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className='flex items-center space-x-1 hover:text-blue-500 transition'
							>
								<link.icon className='w-5 h-5' />
								<span>{link.name}</span>
							</Link>
						))}
					</div>

					{/* Right Clock & Location */}
					<div className='hidden lg:flex text-black flex-col items-end text-right text-sm'>
						<span className=' font-medium'>{formattedDate}</span>
						<span className='text-blue-600 font-semibold text-md'>
							{formattedTime}
						</span>
						<span className='text-xs text-gray-500'>
							{location}
						</span>
					</div>

					{/* Mobile menu toggle */}
					<div className='md:hidden'>
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='p-2 text-gray-700 hover:text-blue-600'
						>
							{isMenuOpen ? (
								<X className='w-6 h-6' />
							) : (
								<Menu className='w-6 h-6' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Nav */}
			{isMenuOpen && (
				<div className='md:hidden px-4 pb-4 space-y-3 border-t border-gray-200'>
					{navLinks.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className='flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition'
						>
							<link.icon className='w-5 h-5' />
							<span>{link.name}</span>
						</Link>
					))}
					<div className='pt-2 text-sm text-gray-500'>
						<div>{formattedDate}</div>
						<div className='text-blue-600 font-semibold'>
							{formattedTime}
						</div>
						<div>{location}</div>
					</div>
				</div>
			)}
		</motion.nav>
	);
}
