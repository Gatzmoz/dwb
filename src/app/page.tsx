import Forecast from './_components/Forecast';
import Today from './_components/Today';

export default function Home() {
	return (
		<div className=''>
			<main className='w-full flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
				<Today />
				<Forecast />
			</main>
			<footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'></footer>
		</div>
	);
}
