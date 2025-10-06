import { useEffect } from "react";

interface ScrollToTopProps {
  top?: number;
  behavior?: ScrollBehavior;
  delay?: number;
}

export function useScrollToTop(trigger: boolean, props: ScrollToTopProps = {}) {
  const { top = 0, behavior = "smooth", delay = 100 } = props;

  useEffect(() => {
    if (!trigger) return;

    const timeout = setTimeout(() => window.scrollTo({ top, behavior }), delay);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
}
