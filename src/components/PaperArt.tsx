export function Starburst({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m60 0 9 35L91 8l-9 35 35-10-27 23 30 14-36 3 19 30-31-18-5 35-13-32-23 28 10-36-36 8 28-22L0 56l36-7L17 19l31 19z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PaperArt({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`paper-art ${compact ? "paper-art-compact" : ""}`}
      role="img"
      aria-label="An original four-panel FOLD brochure with bold orange, yellow and black graphic artwork"
    >
      <div className="art-orbit" />
      <div className="art-ray" />
      <div className="loose-paper loose-paper-back">
        <span>
          IDEAS
          <br />
          TAKE
          <br />
          SHAPE.
        </span>
        <div className="paper-grid" />
      </div>
      <div className="loose-paper loose-paper-front">
        <span>
          NOT JUST
          <br />A PRETTY
          <br />
          <strong>PAGE.</strong>
        </span>
        <Starburst />
        <small>MAKE SOMETHING THAT MATTERS.</small>
      </div>
      <div className="hero-brochure">
        <div className="brochure-panel panel-one">
          <span className="micro">ZERONE / DESIGN SERIES 01</span>
          <strong>
            THINK.
            <br />
            MAKE.
            <br />
            FOLD.
          </strong>
          <div className="arch-art">
            <i />
            <i />
            <i />
          </div>
          <span className="micro panel-bottom">A DIFFERENT PERSPECTIVE.</span>
        </div>
        <div className="brochure-panel panel-two">
          <span className="micro">FOUR PAGES. ENDLESS POSSIBILITIES.</span>
          <div className="stripe-art" />
          <span className="panel-two-title">
            GOOD
            <br />
            IDEAS
            <br />
            UNFOLD.
          </span>
          <span className="micro panel-bottom">12.11.26 / ISE LAB</span>
        </div>
        <div className="brochure-panel panel-three">
          <span className="micro">BROCHURE DESIGN CHALLENGE</span>
          <span className="paper-fold-title">FOLD</span>
          <div className="circle-art">
            <Starburst />
          </div>
          <div className="panel-three-bottom">
            <span>2026</span>
            <small>
              TURN YOUR
              <br />
              IDEAS INTO
              <br />
              AN IMPACT.
            </small>
          </div>
        </div>
      </div>
      <div className="art-caption">
        <span className="tiny-cross">+</span> YOUR CANVAS. YOUR PERSPECTIVE.{" "}
        <span>↗</span>
      </div>
      <div className="art-sticker">
        <span>90</span>
        <small>
          MIN DESIGN.
          <br />
          30 MIN JUDGING.
        </small>
      </div>
    </div>
  );
}
