import Head from "next/head";

export default function Home() {

  return (
    <div>
      <Head>
        <title>Gunnhacks 9.0</title>
        <meta name="description" content="Funny Site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container pt-4">
        <h1 className="text-center text-5xl font-bold text-red-500">
          Gunnhacks 9
        </h1>
      </main>
    </div>
  )
}
