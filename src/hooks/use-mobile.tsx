
import * as React from "react"

// Mobile breakpoint in pixels - screen width smaller than this is considered mobile
const MOBILE_BREAKPOINT = 768

/**
 * Hook that returns whether the current viewport is considered mobile
 * @returns boolean indicating if the viewport is mobile (width < 768px)
 */
export function useIsMobile() {
  // Initially undefined to prevent hydration mismatch 
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Setup media query listener for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener and set initial value
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Clean up event listener on component unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Make sure we return a boolean even if state is undefined
  return !!isMobile
}
