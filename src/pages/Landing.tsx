import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Play,
  X,
} from "lucide-react";
import { eventDateParts, useEventConfig } from "../lib/event";
import { PaperArt, Starburst } from "../components/PaperArt";

const rules = [
  [
    "The right two minds.",
    "Only MITE students can participate. Every team must have exactly two members. A maximum of 30 teams will be confirmed.",
  ],
  [
    "Originality is non-negotiable.",
    "Create your work during the competition. No pre-designed templates, previously created work or plagiarism.",
  ],
  [
    "Four pages. One clear story.",
    "Create four separate A4 portrait pages. Submit one final PDF and four PNG or JPG page previews.",
  ],
  [
    "Your ideas. Your execution.",
    "AI-generated finished layouts or designs are prohibited, subject to the final published competition policy.",
  ],
  [
    "Watch the clock.",
    "Follow the official submission deadline. Submit your files to the organizers by minute 90 (1:30 hr). Judgement starts immediately for 30 minutes (2 hr total).",
  ],
];

function Intro({ close }: { close: () => void }) {
  const enter = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    enter.current?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", listener);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", listener);
    };
  }, [close]);
  return (
    <div
      className="intro"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to FOLD 2026"
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          const buttons = e.currentTarget.querySelectorAll("button");
          if (e.shiftKey && document.activeElement === buttons[0]) {
            e.preventDefault();
            buttons[buttons.length - 1].focus();
          } else if (
            !e.shiftKey &&
            document.activeElement === buttons[buttons.length - 1]
          ) {
            e.preventDefault();
            buttons[0].focus();
          }
        }
      }}
    >
      <button className="intro-skip" onClick={close}>
        Skip intro <X size={16} />
      </button>
      <span className="eyebrow">ZERONE PRESENTS / A NEW PERSPECTIVE</span>
      <div className="intro-fold" aria-hidden="true">
        {["F", "O", "L", "D"].map((letter, i) => (
          <span key={letter} style={{ "--i": i } as React.CSSProperties}>
            {letter}
          </span>
        ))}
      </div>
      <p className="intro-caption">ZERONE FOLD 2026</p>
      <button ref={enter} className="button button-dark" onClick={close}>
        Enter the experience <ArrowUpRight size={19} />
      </button>
      <span className="intro-bottom">12 NOVEMBER 2026 · 11:00 AM — 1:00 PM · ISE LAB (30 SEATER 1ST FLOOR MAIN BLOCK)</span>
    </div>
  );
}

function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const animate = (now: number) => {
          const p = Math.min((now - start) / 900, 1);
          setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return <span ref={ref}>{shown.toString().padStart(2, "0")}</span>;
}

export function Landing() {
  const config = useEventConfig();
  const date = eventDateParts(config);
  const [intro, setIntro] = useState(
    () =>
      !sessionStorage.getItem("fold-intro") &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [activePage, setActivePage] = useState(0);
  const pageNames = [
    "The first impression",
    "The bigger picture",
    "The finer details",
    "The final word",
  ];
  const pageTips = [
    "Lead with one image or phrase that earns a second look.",
    "Give the reader enough context to understand the story.",
    "Use hierarchy and spacing to make the details easy to find.",
    "Choose a closing line or action that the reader will remember.",
  ];
  const closeIntro = useCallback(() => {
    sessionStorage.setItem("fold-intro", "viewed");
    setIntro(false);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const availability = config?.settings.formUrl ? "Registration open · ₹100 per team" : "Registration link coming soon";
  const registerCTA = "Register your team";
  const registerPath = "/register";
  return (
    <>
      {intro && <Intro close={closeIntro} />}
      <section className="hero">
        <div className="hero-topline">
          <span>
            <span className="live-dot" /> ZERONE × ISE LAB
          </span>
          <span>12.11.2026 · 11:00 AM – 1:00 PM · TOTAL 2 HR</span>
          <span>PRIZE POOL: ₹4,500 RS</span>
        </div>
        <div className="hero-main">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span>THE BROCHURE</span>
              <span>DESIGN CHALLENGE ↗</span>
            </div>
            <h1 className="hero-title">
              FOLD
              <span className="title-edition">
                20
                <br />
                26
              </span>
              <span className="title-period">.</span>
            </h1>
            <h2>
              Make every
              <br />
              <em>page count.</em>
            </h2>
            <p>
              Two minds. Four pages. Two hours total.
              <br />
              1:30 hr design challenge + 30 min judgement.
              <br className="desktop-br" /> Turn an unexpected brief into something
              impossible to ignore.
            </p>
            <div className="hero-prize-callout">
              <div className="prize-callout-top">
                <span className="prize-callout-pill">
                  <Starburst className="prize-pill-star" /> TOTAL PRIZE POOL
                </span>
                <span className="prize-callout-tag">CASH AWARDS</span>
              </div>
              <div className="prize-callout-main">
                <span className="prize-callout-currency">₹</span>
                <span className="prize-callout-amount">4500</span>
                <span className="prize-callout-rs">RS</span>
              </div>
              <div className="prize-callout-sub">
                <span>CASH REWARDS FOR WINNING TEAMS</span>
                <span className="prize-callout-sep">/</span>
                <span>ENTRY ₹100 PER TEAM</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link className="button button-dark" to={registerPath}>
                {registerCTA} <ArrowUpRight size={20} />
              </Link>
              <a href="#challenge" className="text-link">
                Explore the challenge <ArrowDown size={16} />
              </a>
            </div>
            <div className="availability">
              <span
                className={
                  config?.registrationOpen
                    ? "status-dot available"
                    : "status-dot"
                }
              />
              {availability}
            </div>
          </div>
          <PaperArt />
        </div>
        <div className="hero-bottom">
          <div className="hero-date">
            <span>{date.weekday}</span>
            <strong>
              {date.dayMonth}
              <span>{date.year}</span>
            </strong>
            <small className="hero-time-tag">11:00 AM – 1:00 PM</small>
          </div>
          <div className="hero-location">
            <strong>ISE LAB</strong>
            <span>1ST FLOOR MAIN BLOCK · 30 SEATER</span>
          </div>
          <div className="hero-prize-box">
            <strong>
              ₹4,500 <small>RS</small>
            </strong>
            <span>TOTAL PRIZE POOL</span>
          </div>
          <div className="hero-fee">
            <strong>
              ₹100 <small>/ TEAM</small>
            </strong>
            <span>2 STUDENTS. 1 VISION.</span>
          </div>
          <a href="#about" className="scroll-cue" aria-label="Scroll to about">
            <ArrowDownRight />
          </a>
        </div>
      </section>
      <div className="marquee" aria-hidden="true">
        <div>
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>
              THINK OUTSIDE THE FOLD <Starburst /> PRIZE POOL ₹4500 RS{" "}
              <Starburst /> DESIGN BEYOND THE ORDINARY <Starburst />
            </span>
          ))}
        </div>
      </div>

      <section id="about" className="about-section section-space">
        <div className="section-label">
          <span>01 / THE IDEA</span>
          <span>CREATIVITY, UNFOLDED.</span>
        </div>
        <div className="about-layout">
          <div className="about-copy reveal">
            <h2>
              Small format.
              <br />
              <span>Big possibilities.</span>
            </h2>
            <p className="large-body">A blank page is just the beginning.</p>
            <p>
              FOLD is where strategy meets storytelling. Take a surprise company
              or event scenario and transform it into a professional four-page
              brochure — a 1:30 hr design challenge followed by 30 minutes of
              live judgement (2 hours total).
            </p>
            <p>
              Brought to you by the ZERONE Student Association, Information
              Science & Engineering at Mangalore Institute of Technology &
              Engineering.
            </p>
            <a href="#challenge" className="underline-link">
              Find your creative edge <ArrowUpRight size={20} />
            </a>
            <div className="venue-note">
              <span className="eyebrow">VENUE & TIMING</span>
              <span>
                {config?.settings.venue ||
                  "ISE LAB (30 seater 1st floor main block)"} · 11:00 AM – 1:00 PM IST
              </span>
            </div>
          </div>
          <div
            className="studio-scene reveal"
            aria-label="Graphic design desk with brochure layouts"
            role="img"
          >
            <span className="studio-grid-label">
              THE CREATIVE WORKSPACE / 01
            </span>
            <div className="studio-page studio-page-a">
              <span className="micro">DESIGN IS A WAY OF SEEING.</span>
              <strong>
                LESS
                <br />
                RULES.
                <br />
                <em>
                  MORE
                  <br />
                  IDEAS.
                </em>
              </strong>
              <div className="studio-stripes" />
              <span className="micro">YOUR PERSPECTIVE IS THE POINT.</span>
            </div>
            <div className="studio-page studio-page-b">
              <div className="studio-sun" />
              <strong>
                MAKE
                <br />
                YOUR
                <br />
                MARK.
              </strong>
              <span>FOLD / 2026</span>
            </div>
            <div className="color-swatches">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="studio-ruler">01 ┃ 02 ┃ 03 ┃ 04 ┃ 05 ┃ 06 ┃ 07</div>
            <div className="studio-pencil" />
            <span className="studio-caption">FROM A SPARK TO A STORY. ↗</span>
          </div>
        </div>
        <div className="stat-row reveal">
          {[
            [2, "CREATIVE MINDS / TEAM"],
            [4, "A4 PORTRAIT PAGES"],
            [90, "MIN DESIGN (1:30 HR)"],
            [30, "MIN JUDGEMENT (2 HR TOTAL)"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>
                <Count value={Number(value)} />
                <span>{value === 90 || (value === 30 && typeof label === "string" && label.includes("MIN")) ? "′" : value === 4 ? "↗" : "."}</span>
              </strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="challenge" className="challenge-section section-space">
        <div className="section-label">
          <span>02 / THE CHALLENGE</span>
          <span>YOUR IDEAS. IN FOUR ACTS.</span>
        </div>
        <div className="challenge-heading reveal">
          <h2>
            One brief.
            <br />
            Four ways to <em>stand out.</em>
          </h2>
          <div>
            <p>
              You won’t know the brief until the clock starts. Bring your
              teammate, your design instincts, and a fresh perspective.
            </p>
            <span className="pill">SURPRISE BRIEF. REVEALED ON THE DAY.</span>
          </div>
        </div>
        <div
          className="four-pages"
          role="group"
          aria-label="Explore the four brochure pages"
        >
          {pageNames.map((name, i) => (
            <button
              key={name}
              className={`challenge-page page-${i + 1} ${activePage === i ? "selected" : ""} reveal`}
              style={{ "--page-delay": `${i * 90}ms` } as React.CSSProperties}
              aria-pressed={activePage === i}
              onClick={() => setActivePage(i)}
            >
              <span className="page-number">
                0{i + 1}
                <ArrowUpRight size={20} />
              </span>
              <div className="challenge-page-art">
                {i === 0 ? (
                  <>
                    <strong>
                      HELLO,
                      <br />
                      POSSIBILITY.
                    </strong>
                    <Starburst />
                  </>
                ) : i === 1 ? (
                  <>
                    <div className="art-rings" />
                    <strong>
                      A NEW
                      <br />
                      POINT OF
                      <br />
                      VIEW.
                    </strong>
                  </>
                ) : i === 2 ? (
                  <>
                    <strong>
                      MAKE
                      <br />
                      IT
                      <br />
                      MATTER.
                    </strong>
                    <div className="art-checker" />
                  </>
                ) : (
                  <>
                    <Starburst />
                    <strong>
                      LEAVE
                      <br />A LASTING
                      <br />
                      IMPRESSION.
                    </strong>
                  </>
                )}
              </div>
              <span className="page-bottom">
                {name}
                <span>A4 ↗</span>
              </span>
            </button>
          ))}
        </div>
        <p className="page-tip" aria-live="polite">
          <strong>Layout idea 0{activePage + 1}</strong> {pageTips[activePage]}
        </p>
        <div className="challenge-note">
          <span>
            <Check size={17} /> 4 separate A4 portrait pages
          </span>
          <span>
            <Check size={17} /> 1 final PDF
          </span>
          <span>
            <Check size={17} /> 4 PNG / JPG previews
          </span>
          <span className="note-right">
            Illustrative layouts. Your story is yours.
          </span>
        </div>
      </section>

      <section id="timeline" className="timeline-section section-space">
        <div className="section-label">
          <span>03 / THE RUN OF SHOW</span>
          <span>EVERY MINUTE HAS A PURPOSE.</span>
        </div>
        <div className="timeline-title reveal">
          <h2>
            Two hours.
            <br />
            <span>No ordinary ideas.</span>
          </h2>
          <div className="clock-art" aria-hidden="true">
            <span>120</span>
            <small>MINUTES TOTAL</small>
            <i />
          </div>
        </div>
        <div className="timeline-track reveal">
          {[
            [
              "11:00",
              "The spark.",
              "Briefing",
              "The surprise brief is revealed. The 1:30 hr design clock starts.",
            ],
            [
              "11:00—12:30",
              "The making.",
              "Design (1:30 hr)",
              "Use the 90 minutes to design your four-page brochure.",
            ],
            [
              "12:30",
              "The final fold.",
              "Submission",
              "Submit your PDF and four previews by 12:30 PM (minute 90).",
            ],
            [
              "12:30—1:00",
              "The verdict.",
              "Judgement (30 min)",
              "Live jury evaluation and scoring for 30 minutes to decide the winners.",
            ],
          ].map(([time, title, tag, copy], i) => (
            <div className="timeline-item" key={tag}>
              <span className="timeline-node">0{i + 1}</span>
              <span className="timeline-time">
                {time}
                <small>{time.includes(":") ? "" : " MIN"}</small>
              </span>
              <span className="eyebrow">{tag}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="judging" className="judging-section section-space">
        <div className="section-label">
          <span>04 / WHAT MAKES THE CUT</span>
          <span>100 POINTS. COUNTLESS POSSIBILITIES.</span>
        </div>
        <div className="judging-layout">
          <div className="judging-intro reveal">
            <h2>
              Good design
              <br />
              goes <em>deeper.</em>
            </h2>
            <p>
              A beautiful page catches the eye.
              <br />A thoughtful one makes an impact.
              <br />
              Here’s what the jury is looking for.
            </p>
            <div className="total-score">
              <strong>
                100<span>/</span>
              </strong>
              <span>
                POINTS
                <br />
                UP FOR GRABS
              </span>
            </div>
            <Starburst className="judging-star" />
          </div>
          <div className="score-list">
            {[
              ["Creativity", 25, "An original point of view."],
              ["Layout", 25, "Balance, hierarchy, and flow."],
              ["Typography", 15, "Words that look as good as they read."],
              ["Content", 20, "A clear, compelling story."],
              ["Technical execution", 15, "Details that make the difference."],
            ].map(([name, score, description], i) => (
              <div className="score-row reveal" key={name}>
                <span className="score-index">0{i + 1}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <strong>
                  <Count value={Number(score)} />
                  <span>PTS</span>
                </strong>
                <div
                  className="score-line"
                  style={{ width: `${Number(score) * 4}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rules" className="rules-section section-space">
        <div className="section-label">
          <span>05 / THE GROUND RULES</span>
          <span>FAIR PLAY. FRESH THINKING.</span>
        </div>
        <div className="rules-layout">
          <div className="reveal">
            <h2>
              Creative freedom.
              <br />
              <span>A few guardrails.</span>
            </h2>
            <p>
              Get familiar with the essentials.
              <br />
              Then let your imagination get to work.
            </p>
            <Link to="/register" className="underline-link">
              Register your team <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="rules-list">
            {!config?.settings.rules?.length &&
              rules.map(([title, copy], i) => (
                <details key={title} className="rule" open={i === 0}>
                  <summary>
                    <span>0{i + 1}</span>
                    {title}
                    <ChevronDown size={19} />
                  </summary>
                  <p>{copy}</p>
                </details>
              ))}
            {config?.settings.rules?.length ? (
              <details className="rule" open>
                <summary>
                  <span>01</span>Published competition rules
                  <ChevronDown size={19} />
                </summary>
                <ul>
                  {config.settings.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </details>
            ) : null}
          </div>
        </div>
      </section>

      <section className="registration-banner">
        <Starburst className="registration-star" />
        <div className="registration-label">
          <span className="eyebrow">
            THE PAGE IS BLANK. THE STAGE IS YOURS.
          </span>
          <span>{date.numeric} / ISE LAB</span>
        </div>
        <div className="registration-content reveal">
          <h2>
            Ready to make
            <br />
            your <span>mark?</span>
            <ArrowUpRight />
          </h2>
          <div>
            <p>
              Find your creative other half.
              <br />
              Bring a big idea. Leave an impression.
            </p>
            <Link className="button button-dark" to={registerPath}>
              {registerCTA} <ArrowUpRight size={20} />
            </Link>
            <span className="registration-price">
              ₹50 PER PERSON / ₹100 PER TEAM
            </span>
            <span className="registration-availability">{availability}</span>
          </div>
        </div>
        <div className="registration-bottom">
          <span>EXACTLY 2 MITE STUDENTS PER TEAM</span>
          <button onClick={() => setIntro(true)}>
            <Play size={13} /> Replay the unfold
          </button>
          <span>
            LET’S CREATE SOMETHING WORTH KEEPING. <ArrowRight size={17} />
          </span>
        </div>
      </section>
    </>
  );
}
