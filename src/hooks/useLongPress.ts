import { useCallback, useRef, useState } from "react";

const DELAY_DEFAULT = 400;

export type LongPressEvent = React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>;

const preventDefault = (event:Event) => {
    if ("touches" in event && (event as TouchEvent).touches.length < 2 && event.preventDefault) {
        event.preventDefault();
    }
};

const useLongPress = () => {
    const [longPressTriggered, setLongPressTriggered] = useState<boolean>(false);
    
    const fnOnLongPress = useRef<Function>(()=>{});
    const fnOnClick = useRef<Function>(()=>{});
    const fnOnFinish = useRef<Function>(()=>{});
    const timer = useRef<number>();
    const target = useRef<HTMLElement>();

    const start = useCallback((event:LongPressEvent) => {
        if (event.target) {
            event.target.addEventListener("touchend", preventDefault, {
                passive: false
            });
            target.current = event.target as HTMLElement;
        }
        timer.current = setTimeout(() => {
            fnOnLongPress.current(event);
            setLongPressTriggered(true);
        }, DELAY_DEFAULT);
    }, []);

    const clear = useCallback((event:LongPressEvent , shouldTriggerClick: boolean) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        if (!longPressTriggered) {
            if (shouldTriggerClick) {
                fnOnClick.current(event);
            } else {
                fnOnFinish.current(event);
            }
        }
        setLongPressTriggered(false);
        if (target.current) {
            target.current.removeEventListener("touchend", preventDefault);
        }
    }, [longPressTriggered]);

    const setOnLongPress = (fn:Function) => {
        fnOnLongPress.current = fn;
    }

    const setOnClick = (fn:Function) => {
        fnOnClick.current = fn;
    }

    const setOnFinish = (fn:Function) => {
        fnOnFinish.current = fn;
    }

    return {
        setOnLongPress,
        setOnClick,
        setOnFinish,
        componentEvents: {
            onMouseDown: (e:LongPressEvent) => start(e),
            onTouchStart: (e:LongPressEvent) => start(e),
            onMouseUp: (e:LongPressEvent) => clear(e, true),
            onMouseLeave: (e:LongPressEvent) => clear(e, false),
            onTouchEnd: (e:LongPressEvent) => clear(e, true)
        }
    };
};

export default useLongPress;