import { trackEvent } from '@aptabase/nextjs/server';
import { Counter } from './Counter';

export default async function Home() {
  await trackEvent('page_view', { page: 'home' });
  return (
    <main>
      Hello from Next.js App Router <br /> <Counter />
    </main>
  );
}
