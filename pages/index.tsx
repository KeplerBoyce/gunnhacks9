import Head from "next/head";

export default function Home() {

  return (
    <div>
      <Head>
        <title>Gunnhacks 9.0</title>
        <meta name="description" content="Funny Site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center container pt-1 py-1">
        <div className="bg-gray-100">
          <h1 className="text-center text-6xl font-bold text-red-500 mt-10 ">
            Piano Chord Practice
          </h1>
          <h2 className="text-center mb-10 text-2xl text-red-400 mt-5">
            GunnHacks 9.0
          </h2>
        </div>
        <div className="flex items-center mt-32">
          <a href="https://www.youtube.com" className="button w-min whitespace-nowrap text-white bg-red-500 text-5xl border-0 py-4 px-8 rounded-lg">Go To Exercise</a>
        </div>
      </main>
    </div>

    
  )
}
