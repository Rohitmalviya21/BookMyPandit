import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import "./StaggeredMenu.css";

export const StaggeredMenu = ({
  position = "right",
  colors = ["#B497CF", "#5227FF"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = "",
  menuButtonColor = "#ffffff",
  openMenuButtonColor = "#fff",
  changeMenuColorOnOpen = true,
  isFixed = true,
  accentColor = "#5227FF",
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);

  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(["Menu", "Close"]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer"));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);



  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const offscreen = position === "left" ? -100 : 100;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layers.forEach((layer, i) => {
      tl.fromTo(
        layer,
        { xPercent: offscreen },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: offscreen },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll(".sm-panel-itemLabel")
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll(
            ".sm-panel-list[data-numbering] .sm-panel-item"
          )
        );
        if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });

        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(
          panel.querySelectorAll(".sm-socials-link")
        );
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current
          ? openMenuButtonColor
          : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;

    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  const handleItemClick = useCallback((link) => {
    if (link.startsWith("/")) {
      navigate(link);
    } else if (link.startsWith("#")) {
      const el = document.getElementById(link.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setTimeout(() => closeMenu(), 150);
  }, [navigate, closeMenu]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  // Close menu on navigation
  React.useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  const isPlaceholderLogo = !logoUrl || logoUrl === "/path-to-your-logo.svg";

  return (
    <div id="staggered-mobile-menu">
      <div
        className={`sm-scope z-40 ${isFixed ? "fixed top-0 left-0 h-screen w-screen overflow-hidden" : "h-full w-full"}`}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div
          className={
            (className ? className + " " : "") +
            "staggered-menu-wrapper pointer-events-none relative h-full w-full"
          }
          style={accentColor ? { "--sm-accent": accentColor } : undefined}
          data-position={position}
          data-open={open || undefined}
        >
          <div
            ref={preLayersRef}
            className="sm-prelayers pointer-events-none absolute top-0 right-0 bottom-0 z-5"
            aria-hidden="false"
          >
            {(() => {
              const raw =
                colors && colors.length
                  ? colors.slice(0, 4)
                  : ["#B497CF", "#5227FF"];
              let arr = [...raw];
              if (arr.length >= 3) {
                const mid = Math.floor(arr.length / 2);
                arr.splice(mid, 1);
              }
              return arr.map((c, i) => (
                <div
                  key={i}
                  className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                  style={{ background: c }}
                />
              ));
            })()}
          </div>

          <header
            className="staggered-menu-header pointer-events-none absolute top-0 left-0 z-20 flex w-full items-center justify-between bg-transparent p-[2em]"
            aria-label="Main navigation header"
          >
            <div
              className="sm-logo pointer-events-auto flex items-center select-none"
              aria-label="Logo"
              onClick={() => {
                navigate("/");
                closeMenu();
              }}
              style={{ cursor: "pointer" }}
            >
              {!isPlaceholderLogo ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="sm-logo-img block h-8 w-auto object-contain"
                  draggable={false}
                />
              ) : (
                <span className="fw-bold fs-3 text-primary-orange" style={{ letterSpacing: '-0.5px' }}>
                  Book<span style={{ color: '#2d1e18' }}>My</span>Pandit
                </span>
              )}
            </div>

            <button
              ref={toggleBtnRef}
              className="sm-toggle pointer-events-auto relative inline-flex cursor-pointer items-center gap-[0.3rem] overflow-visible border-0 bg-transparent leading-none font-medium text-[#ffffff]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="staggered-menu-panel"
              onClick={toggleMenu}
              type="button"
            >
              <span
                ref={textWrapRef}
                className="sm-toggle-textWrap relative inline-block h-[1em] w-(--sm-toggle-width,auto) min-w-(--sm-toggle-width,auto) overflow-hidden whitespace-nowrap"
                aria-hidden="true"
              >
                <span
                  ref={textInnerRef}
                  className="sm-toggle-textInner flex flex-col leading-none"
                >
                  {textLines.map((l, i) => (
                    <span
                      className="sm-toggle-line block h-[1em] leading-none"
                      key={i}
                    >
                      {l}
                    </span>
                  ))}
                </span>
              </span>

              <span
                ref={iconRef}
                className="sm-icon relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center will-change-transform"
                aria-hidden="true"
              >
                <span
                  ref={plusHRef}
                  className="sm-icon-line absolute top-1/2 left-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-current will-change-transform"
                />
                <span
                  ref={plusVRef}
                  className="sm-icon-line sm-icon-line-v absolute top-1/2 left-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-current will-change-transform"
                />
              </span>
            </button>
          </header>

          <aside
            id="staggered-menu-panel"
            ref={panelRef}
            className="staggered-menu-panel pointer-events-auto absolute top-0 right-0 z-10 flex h-full flex-col overflow-y-auto p-[6em_2em_2em_2em] backdrop-blur-md"
            style={{ WebkitBackdropFilter: "blur(12px)", backgroundColor: colors[1] || '#fffaf4' }}
            aria-hidden={!open}
          >
            <div className="sm-panel-inner flex flex-1 flex-col gap-5">
              <ul
                className="sm-panel-list m-0 flex list-none flex-col gap-2 p-0"
                data-numbering={displayItemNumbering || undefined}
              >
                {items && items.length ? (
                  items.map((it, idx) => (
                    <li
                      className="sm-panel-itemWrap relative overflow-hidden leading-none"
                      key={it.label + idx}
                    >
                      <button
                        className={`sm-panel-item relative inline-block cursor-pointer border-0 bg-transparent pr-[1.4em] text-[2.5rem] leading-none font-semibold tracking-[-1px] no-underline transition-[background,color] duration-150 ease-linear`}
                        onClick={() => {
                          if (it.onClick) {
                            it.onClick();
                            closeMenu();
                          } else {
                            handleItemClick(it.link);
                          }
                        }}
                        aria-label={it.ariaLabel}
                        data-index={idx + 1}
                        type="button"
                      >
                        <span className="sm-panel-itemLabel inline-block origin-[50%_100%] will-change-transform">
                          {it.label}
                        </span>
                      </button>
                    </li>
                  ))
                ) : (
                  <li
                    className="sm-panel-itemWrap relative overflow-hidden leading-none"
                    aria-hidden="true"
                  >
                    <span className="sm-panel-item relative inline-block pr-[1.4em] text-[2.5rem] leading-none font-semibold tracking-[-1px] no-underline">
                      <span className="sm-panel-itemLabel inline-block origin-[50%_100%] will-change-transform">
                        No items
                      </span>
                    </span>
                  </li>
                )}
              </ul>

              {displaySocials && socialItems && socialItems.length > 0 && (
                <div
                  className="sm-socials mt-auto flex flex-col gap-3 pt-8"
                  aria-label="Social links"
                >
                  <h3 className="sm-socials-title m-0 text-base font-medium text-(--sm-accent,#ff0000)">
                    Socials
                  </h3>
                  <ul
                    className="sm-socials-list m-0 flex list-none flex-row flex-wrap items-center gap-4 p-0"
                  >
                    {socialItems.map((s, i) => (
                      <li key={s.label + i} className="sm-socials-item">
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sm-socials-link relative inline-block py-0.5 text-[1.1rem] font-medium no-underline transition-[color,opacity] duration-300 ease-linear"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StaggeredMenu;
