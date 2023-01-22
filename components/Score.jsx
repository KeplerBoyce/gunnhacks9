import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import VexFlow from 'vexflow'

const VF = VexFlow.Flow
const { Formatter, Renderer, Stave, StaveNote, Accidental } = VF

const clefWidth = 30;
const timeWidth = 30;

export default function Score({
    className = "",
    staves = [],
    clef = "treble",
    keySignature = "",
    timeSignature = "",
    scale = 2,
}) {
    const container = useRef();
    const rendererRef = useRef();

    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(300);
  
    useLayoutEffect(() => {
        if (container.current) {
            setWidth(container.current.offsetWidth);
            setHeight(container.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        if (rendererRef.current == null) {
            rendererRef.current = new Renderer(
                container.current,
                Renderer.Backends.SVG
            )
        }
        const renderer = rendererRef.current
        renderer.resize(width, height)
        const context = renderer.getContext()
        context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed')
        context.scale(scale, scale)
        const clefAndTimeWidth = (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
        const staveWidth = (width - clefAndTimeWidth) / staves.length

        let currX = 0
        staves.forEach((notes, i) => {
            const stave = new Stave(currX, 0, staveWidth)
            if (i === 0) {
                stave.setWidth(staveWidth + clefAndTimeWidth)
                clef && stave.addClef(clef);
                keySignature && stave.addKeySignature(keySignature);
                timeSignature && stave.addTimeSignature(timeSignature);
            }
            currX += stave.getWidth()
            stave.setContext(context).draw()

            const processedNotes = notes
                .map(({ key, ...rest }) =>
                    typeof key === 'string' ? {
                        key: key.includes('/') ? key : `${key[0]}/${key.slice(1)}`,
                        ...rest,
                    } : rest
                ).map(({ key, keys, duration = 'q' }) => {
                    let note = new StaveNote({
                        keys: key ? [key] : keys,
                        duration: String(duration),
                    });
                    keys.forEach((k, i) => {
                        if (k[1] === 'b') {
                            note.addModifier(new Accidental('b'), i)
                        } else if (k[1] === '#') {
                            note.addModifier(new Accidental('#'), i)
                        }
                    });
                    return note;
                })
            Formatter.FormatAndDraw(context, stave, processedNotes, {
                auto_beam: true,
            })
        })
    }, [staves])

    return <div className={className} ref={container} />
}