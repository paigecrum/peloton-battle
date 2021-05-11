import { useLayoutEffect, useRef, useState } from 'react'

export default function useHoverAnimation() {
  const [hovering, setHovering] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const timeoutRef = useRef(0);

  useLayoutEffect(() => {
    timeoutRef.current = setTimeout(() => {
      clearTimeout(timeoutRef.current);

      if (hovering) {
        setShouldAnimate(true);
      } else {
        setShouldAnimate(false);
      }
    }, 10);

    return () => {
      clearTimeout(timeoutRef);
    }

  }, [shouldAnimate, hovering]);

  const onMouseEnter = () => setHovering(true);
  const onMouseLeave = () => setHovering(false);

  return [shouldAnimate, {
    onMouseEnter,
    onMouseLeave
  }]
}
