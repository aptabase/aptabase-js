import { getName } from '@aptabase/next'

export default function Home() {
  return (
    <main>
      Hello from Next.js App Router: {getName()}
    </main>
  )
}
