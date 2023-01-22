import Head from "next/head";
import easymidi from "easymidi";



export default function Midi() {
  var inputs = easymidi.getInputs();
  return (
    <div>
      <Head>
        <title>MIDI PAGE</title>
        <meta name="description" content="Funny Site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container pt-4">
        <h1 className="text-center text-5xl font-bold text-red-500">
          {inputs}
        </h1>
      </main>
    </div>
  )
}