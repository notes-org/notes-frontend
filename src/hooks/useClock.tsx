import moment, { Moment } from "moment";
import { useEffect, useState } from "react";

type Props = {
    /** Clock interval precision in ms */
    intervalInMs: number
}

/**
 * Wraps the current date as a State.
 * Date is stored as a Moment object and is updated by regular intervals
 */
export function useClock({ intervalInMs }: Props) {
    const [date, setDate] = useState<Moment>(moment());
    
    useEffect(() => {
        const interval = setInterval(() => { setDate(moment()); }, intervalInMs);
        return () => clearInterval(interval);
    }, [intervalInMs]);

    return { date, setDate }
}