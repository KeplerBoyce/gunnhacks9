import Head from "next/head";
import { useState } from "react";
import Score from "../components/Score"

export default function Home() {

    return (
        <>
            <Head>
                <title>Gunnhacks 9.0</title>
                <meta name="description" content="Sightreading" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container">
                <h1 className="text-center text-6xl font-bold mt-10">
                    Piano Chord Practice
                </h1>

                <div className="flex justify-center">
                    <Score
                        className="h-full"
                        keySignature="Gm"
                        staves={[
                            [
                                {
                                    keys: ["c/4", "e/4", "g/4"],
                                    duration: "1",
                                },
                            ],
                        ]}
                    />
                </div>
            </main>
        </>
    )
}
