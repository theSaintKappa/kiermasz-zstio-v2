"use client";

import { useEffect, useRef, useState } from "react";

const PREFIX = "Wyszukaj ";
const WORDS = ["tytuł", "przedmiot", "wydawnictwo", "rok wydania", "ISBN"];
const STATIC_FALLBACK = "Wyszukaj";
const TYPE_MS = 80;
const DELETE_MS = 45;
const HOLD_FULL_MS = 1200;
const HOLD_EMPTY_MS = 400;

export function useTypewriterPlaceholder(): string {
    const [placeholder, setPlaceholder] = useState(STATIC_FALLBACK);
    const wordIndex = useRef(0);
    const charCount = useRef(0);
    const timeouts = useRef<number[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const clearTimeouts = () => {
            for (const id of timeouts.current) clearTimeout(id);
            timeouts.current = [];
        };

        const schedule = (fn: () => void, ms: number) => {
            const id = window.setTimeout(fn, ms);
            timeouts.current.push(id);
            return id;
        };

        const update = () => {
            const word = WORDS[wordIndex.current];
            setPlaceholder(PREFIX + word.slice(0, charCount.current));
        };

        const tick = () => {
            const word = WORDS[wordIndex.current];

            if (charCount.current < word.length) {
                charCount.current++;
                update();
                schedule(tick, TYPE_MS);
            } else {
                schedule(() => {
                    const deleteTick = () => {
                        if (charCount.current > 0) {
                            charCount.current--;
                            update();
                            schedule(deleteTick, DELETE_MS);
                        } else {
                            update();
                            schedule(() => {
                                wordIndex.current = (wordIndex.current + 1) % WORDS.length;
                                tick();
                            }, HOLD_EMPTY_MS);
                        }
                    };
                    deleteTick();
                }, HOLD_FULL_MS);
            }
        };

        tick();

        return () => {
            clearTimeouts();
        };
    }, []);

    return placeholder;
}
