import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// --- LOADING SCREEN COMPONENT ---
const LoadingScreen = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader-content">
        <img
          src="https://media2.giphy.com/media/2IudUHdI075HL02Pkk/giphy.gif"
          alt="Loading..."
          className="loading-gif"
        />
        <div className="loader-bar">
          <div className="loader-progress"></div>
        </div>
        <p className="loading-text">Preparing Portfolio...</p>
      </div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const audioRef = useRef(null);

  const scrollSectionRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  // --- DATA ---
  const musicInfo = {
    title: "Remember me",
    artist: "Renz Verano",
    file: "/music1.mp3",
  };

  const webProjects = [
    {
      title: "POS System ni Librong James",
      desc: "Specialized POS for Car Accessories management.",
      image: "/pos.png",
      link: "https://pos.bns-santacruz.com",
      tags: [
        { name: "Laravel", icon: "fab fa-laravel" },
        { name: "PHP", icon: "fab fa-php" },
        { name: "MySQL", icon: "fas fa-database" },
      ],
    },
    {
      title: "Malnutrition Profiling and Monitoring System",
      desc: "A web and mobile platform for Barangay Nutrition Scholars of Sta. Cruz to efficiently profile and monitor child nutrition data.",
      image: "/bns.png",
      link: "https://bns-santacruz.com",
      tags: [
        { name: "PHP", icon: "fab fa-php" },
        { name: "JS", icon: "fab fa-js" },
        { name: "HTML", icon: "fab fa-html5" },
      ],
    },
  ];

  const creativeWorks = [
    {
      title: "Branding & Layout Design",
      desc: "Professional layouts and business stationary designed in Photoshop.",
      image: "/banner.png",
      tags: [
        { name: "Photoshop", icon: "fas fa-paint-brush" },
        { name: "Word", icon: "far fa-file-word" },
      ],
    },
    {
      title: "Graphic Manipulation",
      desc: "Advanced photo editing and digital art compositions.",
      image: "/propesiya.png",
      tags: [{ name: "Photoshop", icon: "fas fa-palette" }],
    },
  ];

  const certificates = [
    { title: "", image: "/cert1.png" },
    { title: "", image: "/cert2.png" },
    { title: "", image: "/cert3.png" },
    { title: "", image: "/cert4.png" },
    { title: "", image: "/cert5.png" },
  ];

  // --- TYPING ANIMATION ---
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = [
    "I build full-stack web apps",
    "I design visuals with Photoshop",
    "I troubleshoot and repair PCs",
    "I create UI/UX designs",
    "I develop mobile apps",
    "I edit videos & graphics",
    "I code and automate tasks",
  ];

  useEffect(() => {
    const currentFullRole = roles[roleIndex];
    const handleTyping = () => {
      if (!isDeleting) {
        const nextText = currentFullRole.slice(0, roleText.length + 1);
        setRoleText(nextText);
        if (nextText === currentFullRole)
          setTimeout(() => setIsDeleting(true), 2000);
      } else {
        const nextText = currentFullRole.slice(0, roleText.length - 1);
        setRoleText(nextText);
        if (nextText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    };
    const timer = setTimeout(handleTyping, isDeleting ? 40 : 80);
    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollWidth(progress);
      setShowScrollTop(window.scrollY > 500);

      if (scrollTriggerRef.current && scrollSectionRef.current) {
        const offsetTop = scrollTriggerRef.current.offsetTop;
        const containerHeight = scrollTriggerRef.current.offsetHeight;
        const sectionWidth = scrollSectionRef.current.scrollWidth;
        const windowWidth = window.innerWidth;

        let scrollFraction =
          (window.scrollY - offsetTop) / (containerHeight - window.innerHeight);
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));

        const translateX = scrollFraction * (sectionWidth - windowWidth);
        scrollSectionRef.current.style.transform = `translateX(-${translateX}px)`;
      }

      const reveals = document.querySelectorAll(".reveal-section");
      reveals.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 150) el.classList.add("active");
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [loading]);

  const toggleMusic = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const togglePlayerSize = () => setIsPlayerMinimized(!isPlayerMinimized);

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="portfolio-wrapper">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <div
        className="custom-cursor"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      ></div>
      <div
        className="scroll-progress-line"
        style={{ transform: `scaleX(${scrollWidth / 100})` }}
      ></div>

      {selectedImage && (
        <div
          className="cert-modal fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-content scale-up">
            <img src={selectedImage} alt="Preview" />
          </div>
        </div>
      )}

     {/* --- FLOATING MUSIC PLAYER --- */}
<audio
  ref={audioRef}
  src={musicInfo.file}
  loop
  onTimeUpdate={onTimeUpdate}
/>
<div
  className={`music-player-container ${isPlayerMinimized ? "minimized" : ""}`}
  onClick={() => {
    if (isPlayerMinimized) togglePlayerSize(); // expand when circle is clicked
  }}
>
  {/* Full player header */}
  <div className="player-header" onClick={togglePlayerSize}>
    <strong>{musicInfo.title}</strong> - <span>{musicInfo.artist}</span>
    <button className="minimize-btn">
      <i className={`fas ${isPlayerMinimized ? "fa-expand" : "fas fa-minus"}`}></i>
    </button>
  </div>

  {/* Full player content */}
  {!isPlayerMinimized && (
    <>
      <div className="player-track">
        <span className="time-text">{formatTime(currentTime)}</span>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <span className="time-text">
          -{formatTime(duration - currentTime)}
        </span>
      </div>
      <div className="player-controls-row">
        <button className="player-icon">
          <i className="fas fa-redo"></i>
        </button>
        <button className="player-icon">
          <i className="fas fa-plus"></i>
        </button>
        <button className="player-icon">
          <i className="fas fa-step-backward"></i>
        </button>
        <button className="player-play-btn" onClick={toggleMusic}>
          <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
        </button>
        <button className="player-icon">
          <i className="fas fa-step-forward"></i>
        </button>
        <button className="player-icon">
          <i className="fas fa-ellipsis-h"></i>
        </button>
        <button className="player-icon">
          <i className="fas fa-random"></i>
        </button>
      </div>
    </>
  )}
</div>

      <button
        className={`scroll-up-btn ${showScrollTop ? "pop" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      <header className="fixed-header">
        <div className="container header-content">
          <a href="#home" className="nav-brand">
            PORTFOLIO
          </a>
          <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>
              Home
            </a>
            <a href="#works" onClick={() => setIsMenuOpen(false)}>
              Projects
            </a>
            <a href="#creative" onClick={() => setIsMenuOpen(false)}>
              Creative
            </a>
            <a href="#certificates" onClick={() => setIsMenuOpen(false)}>
              Certificates
            </a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      <main>
        {/* HERO SECTION - Always active initially */}
        <section id="home" className="hero reveal-section active">
          <div className="container hero-grid">
            <div className="hero-text">
              <h2 className="greeting">Hi There!</h2>
              <h1 className="name-title reveal">I'm Olbido</h1>
              <p className="hero-sub">
                {roleText}
                <span className="cursor">|</span>
              </p>
              <div className="cta-group">
                <a href="/olbido.pdf" target="_blank" className="btn-outline">
                  Resume
                </a>
                <a href="#contact" className="btn-solid">
                  Let's Talk
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="resume-card">
                <div className="card-header">
                  <div className="profile-dot"></div>
                  <span>Resume Summary</span>
                </div>
                <div className="card-body relative-body">
                  <div className="photo-slot">
                    <img src="/profile.png" alt="Profile" />
                  </div>
                  <div className="card-info">
                    <h3 className="card-name">Olbido, Maximino Jr.</h3>
                    <p className="card-edu">Tagoloan Community College</p>
                    <div className="card-divider"></div>
                    <strong className="skill-title">Technical Skills</strong>
                    <ul className="card-skills">
                      <li>• Microsoft Office (Word, Excel, PowerPoint)</li>
                      <li>• Adobe Photoshop</li>
                      <li>• PC Troubleshooting & OS Formatting</li>
                    </ul>

                    <strong className="skill-title">Creative Skills</strong>
                    <ul className="card-skills">
                      <li>• Graphic Design</li>
                      <li>• Layout Design</li>
                      <li>• Canva</li>
                      <li>• Picsart</li>
                      <li>• CapCut / Video Editing</li>
                    </ul>

                    <strong className="skill-title">
                      Academic / Programming Skills
                    </strong>
                    <ul className="card-skills">
                      <li>• Web Development (HTML, CSS, JavaScript, PHP)</li>
                      <li>• UI/UX Design</li>
                      <li>• Basic Coding</li>
                      <li>• MySQL / Database Management</li>
                    </ul>
                  </div>
                </div>
                <div className="card-badge">Available for OJT</div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKS SECTION */}
        <section id="works" className="works-section reveal-section">
          <div className="container">
            <p className="section-label">WEB PROJECTS</p>
            <h2 className="section-title">
              Fullstack <span>Development</span>
            </h2>
            <div className="works-grid">
              {webProjects.map((proj, idx) => (
                <a
                  href={proj.link}
                  key={idx}
                  className="work-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="work-image">
                    <img src={proj.image} alt={proj.title} />
                    <div className="work-tags">
                      {proj.tags.map((tag) => (
                        <span key={tag.name} title={tag.name}>
                          <i className={tag.icon}></i>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="work-info">
                    <h3>{proj.title}</h3>
                    <p>{proj.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CREATIVE SECTION */}
        <section id="creative" className="works-section reveal-section">
          <div className="container">
            <p className="section-label">CREATIVE DESIGN</p>
            <h2 className="section-title">
              Photoshop & <span>Layouts</span>
            </h2>
            <div className="works-grid">
              {creativeWorks.map((work, idx) => (
                <div
                  key={idx}
                  className="work-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedImage(work.image)}
                >
                  <div className="work-image">
                    <img src={work.image} alt={work.title} />
                    <div className="work-tags">
                      {work.tags.map((tag) => (
                        <span key={tag.name} title={tag.name}>
                          <i className={tag.icon}></i>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="work-info">
                    <h3>{work.title}</h3>
                    <p>{work.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATES SECTION */}
        <section
          id="certificates"
          className="horizontal-scroll-container"
          ref={scrollTriggerRef}
        >
          <div className="sticky-wrapper">
            <div className="container horizontal-header">
              <p className="section-label">ACHIEVEMENTS</p>
              <h2 className="section-title">
                Certificates <span>Of Participation</span>
              </h2>
            </div>

            <div className="horizontal-track" ref={scrollSectionRef}>
              {certificates.map((cert, idx) => (
                <div
                  key={idx}
                  className="horizontal-item"
                  onClick={() => setSelectedImage(cert.image)}
                >
                  <div className="cert-card">
                    <img src={cert.image} alt={cert.title} />
                    <div className="cert-info-overlay">
                      <h3>{cert.title}</h3>
                      <span>Click to enlarge</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="footer-section reveal-section">
          <div className="container footer-grid">
            <div className="footer-intro">
              <h2 className="footer-title">
                Let's <span>Connect</span>
              </h2>
              <p>Looking for a dedicated Intern or Developer?</p>
            </div>
            <div className="contact-links">
              <a href="mailto:olbidojunex@gmail.com" className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <span>Email Me</span>
                  <p>olbidojunex@gmail.com</p>
                </div>
              </a>
              <a href="tel:+639947587140" className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <span>Call Me</span>
                  <p>+63 994 758 7140</p>
                </div>
              </a>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 • olbido . All Rights Reserved.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
