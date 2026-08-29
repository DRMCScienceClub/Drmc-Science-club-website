"use client";

import { useEffect, type ReactNode } from "react";

const REVEAL_SELECTOR = "[data-reveal]";
const PARALLAX_SELECTOR = "[data-parallax]";
const CSS_REVEAL_SELECTOR = ".home-hero-motion, .page-hero-motion";
const REVEAL_DELAYS = [0, 100, 220, 360, 500, 650, 800, 950] as const;
const MOTION_DURATION = 1000;

const visibleKeyframe: Keyframe = {
  opacity: 1,
  filter: "blur(0px)",
  transform: "none",
};

const revealKeyframes: Record<string, Keyframe[]> = {
  up: [
    { opacity: 0, filter: "blur(9px)", transform: "translate3d(0, 38px, 0)" },
    visibleKeyframe,
  ],
  "from-top": [
    { opacity: 0, filter: "blur(9px)", transform: "translate3d(0, -24px, 0)" },
    visibleKeyframe,
  ],
  "from-left": [
    { opacity: 0, filter: "blur(9px)", transform: "translate3d(-52px, 0, 0)" },
    visibleKeyframe,
  ],
  "from-right": [
    { opacity: 0, filter: "blur(9px)", transform: "translate3d(52px, 0, 0)" },
    visibleKeyframe,
  ],
  scale: [
    { opacity: 0, filter: "blur(9px)", transform: "scale(0.94)" },
    visibleKeyframe,
  ],
  fade: [
    { opacity: 0, filter: "blur(5px)", transform: "none" },
    visibleKeyframe,
  ],
};

function getRevealDelay(element: HTMLElement) {
  const delayIndex = Number.parseInt(element.dataset.revealDelay ?? "", 10);

  if (Number.isInteger(delayIndex)) {
    return REVEAL_DELAYS[Math.min(Math.max(delayIndex, 0), REVEAL_DELAYS.length - 1)];
  }

  const siblings = element.parentElement
    ? Array.from(element.parentElement.children).filter((sibling) =>
        sibling.matches(REVEAL_SELECTOR),
      )
    : [];
  const siblingIndex = siblings.indexOf(element);

  return Math.min(Math.max(siblingIndex, 0), 3) * 90;
}

/**
 * Progressive motion that never changes React-owned attributes or inline
 * styles. Web Animations affect computed presentation only, so streamed route
 * segments can hydrate independently without markup mismatches.
 */
export function MotionController({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealAnimations = new Map<HTMLElement, Animation>();
    const parallaxAnimations = new Map<HTMLElement, Animation>();

    let scrollFrame = 0;
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const settleReveal = (element: HTMLElement) => {
      const animation = revealAnimations.get(element);

      if (!animation) {
        return;
      }

      animation.onfinish = null;
      animation.finish();
      animation.cancel();
      revealAnimations.delete(element);
      observer?.unobserve(element);
    };

    const prepareReveal = (element: Element) => {
      if (
        !(element instanceof HTMLElement) ||
        revealAnimations.has(element) ||
        element.closest(CSS_REVEAL_SELECTOR) ||
        !observer
      ) {
        return;
      }

      const variant = element.dataset.reveal ?? "up";
      const keyframes = revealKeyframes[variant] ?? revealKeyframes.up;
      const animation = element.animate(keyframes, {
        duration: MOTION_DURATION,
        delay: getRevealDelay(element),
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      });

      animation.pause();
      animation.currentTime = 0;
      animation.onfinish = () => {
        if (revealAnimations.get(element) !== animation) {
          return;
        }

        animation.onfinish = null;
        animation.cancel();
        revealAnimations.delete(element);
        observer?.unobserve(element);
      };
      revealAnimations.set(element, animation);
      observer.observe(element);
    };

    const prepareParallax = (element: Element) => {
      if (!(element instanceof HTMLElement) || parallaxAnimations.has(element)) {
        return;
      }

      const speed = Number.parseFloat(element.dataset.parallax ?? "0");
      const distance = Number.isFinite(speed) ? speed * -800 : 0;
      const animation = element.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: `translate3d(0, ${distance}px, 0)` },
        ],
        { duration: MOTION_DURATION, fill: "both" },
      );

      animation.pause();
      animation.currentTime = 0;
      parallaxAnimations.set(element, animation);
    };

    const scan = (scope: ParentNode) => {
      if (scope instanceof Element) {
        if (scope.matches(REVEAL_SELECTOR)) {
          prepareReveal(scope);
        }
        if (scope.matches(PARALLAX_SELECTOR)) {
          prepareParallax(scope);
        }
      }

      scope.querySelectorAll(REVEAL_SELECTOR).forEach(prepareReveal);
      scope.querySelectorAll(PARALLAX_SELECTOR).forEach(prepareParallax);
    };

    const discardDetachedAnimations = () => {
      revealAnimations.forEach((animation, element) => {
        if (!element.isConnected) {
          animation.cancel();
          observer?.unobserve(element);
          revealAnimations.delete(element);
        }
      });
      parallaxAnimations.forEach((animation, element) => {
        if (!element.isConnected) {
          animation.cancel();
          parallaxAnimations.delete(element);
        }
      });
    };

    const updateParallax = () => {
      scrollFrame = 0;
      const range = Math.max(window.innerHeight * 1.25, 1);
      const progress = Math.min(Math.max(window.scrollY / range, 0), 1);

      parallaxAnimations.forEach((animation) => {
        animation.currentTime = progress * MOTION_DURATION;
      });
    };

    const requestParallaxUpdate = () => {
      if (scrollFrame === 0) {
        scrollFrame = window.requestAnimationFrame(updateParallax);
      }
    };

    const handleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const revealContainer = event.target.closest(REVEAL_SELECTOR);
      if (revealContainer instanceof HTMLElement) {
        settleReveal(revealContainer);
      }
    };

    const stopMotion = () => {
      observer?.disconnect();
      observer = null;
      mutationObserver?.disconnect();
      mutationObserver = null;
      window.removeEventListener("scroll", requestParallaxUpdate);
      window.removeEventListener("resize", requestParallaxUpdate);
      document.removeEventListener("focusin", handleFocus);

      if (scrollFrame !== 0) {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
      }

      revealAnimations.forEach((animation) => animation.cancel());
      parallaxAnimations.forEach((animation) => animation.cancel());
      revealAnimations.clear();
      parallaxAnimations.clear();
    };

    const startMotion = () => {
      if (
        reducedMotion.matches ||
        observer ||
        mutationObserver ||
        typeof Element.prototype.animate !== "function"
      ) {
        return;
      }

      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                revealAnimations.get(entry.target)?.play();
              }
            });
          },
          { rootMargin: "0px 0px -9% 0px", threshold: 0.08 },
        );
      }

      scan(document);

      mutationObserver = new MutationObserver((mutations) => {
        discardDetachedAnimations();
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              scan(node);
            }
          });
        });
        requestParallaxUpdate();
      });

      const contentRoot = document.getElementById("main-content") ?? document.body;
      mutationObserver.observe(contentRoot, { childList: true, subtree: true });

      updateParallax();
      window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
      window.addEventListener("resize", requestParallaxUpdate, { passive: true });
      document.addEventListener("focusin", handleFocus);
    };

    const handleMotionPreference = () => {
      stopMotion();
      startMotion();
    };

    reducedMotion.addEventListener("change", handleMotionPreference);
    startMotion();

    return () => {
      reducedMotion.removeEventListener("change", handleMotionPreference);
      stopMotion();
    };
  }, []);

  return children;
}
