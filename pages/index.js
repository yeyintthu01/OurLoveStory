import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [timeline, setTimeline] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [timelineRes, galleryRes] = await Promise.all([
          fetch("/api/timeline"),
          fetch("/api/gallery"),
        ]);

        if (timelineRes.ok) {
          setTimeline(await timelineRes.json());
        }
        if (galleryRes.ok) {
          setGallery(await galleryRes.json());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <h1 className={styles.logo}>💕 Our Love Story</h1>
          <ul className={styles.navLinks}>
            <li>
              <a href="#timeline">Timeline</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Our Journey Together</h2>
          <p>A love story worth sharing</p>
        </div>
      </section>

      <section id="timeline" className={styles.timelineSection}>
        <div className={styles.container}>
          <h2>Our Timeline</h2>
          <div className={styles.timeline}>
            {loading ? (
              <p className={styles.loading}>Loading your timeline...</p>
            ) : timeline.length === 0 ? (
              <p className={styles.empty}>
                No timeline items yet. Add some in Notion!
              </p>
            ) : (
              timeline.map((item, idx) => (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineDate}>{item.Year}</div>
                  <div className={styles.timelineContent}>
                    <h3>{item.Title}</h3>
                    <p>{item.Description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="gallery" className={styles.gallerySection}>
        <div className={styles.container}>
          <h2>Our Memories</h2>
          <div className={styles.galleryGrid}>
            {loading ? (
              <p className={styles.loading}>Loading your memories...</p>
            ) : gallery.length === 0 ? (
              <p className={styles.empty}>
                No gallery items yet. Add some in Notion!
              </p>
            ) : (
              gallery.map((item, idx) => (
                <div key={idx} className={styles.galleryItem}>
                  <img
                    src={item.Image}
                    alt={item.Title}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x300?text=Image+Error")
                    }
                  />
                  <p>{item.Description || item.Title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="contact" className={styles.contactSection}>
        <div className={styles.container}>
          <h2>Get in Touch</h2>
          <p>Share your thoughts or send us a message</p>
          <form
            className={styles.contactForm}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for your message!");
              e.target.reset();
            }}
          >
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2024 Our Love Story. Made with 💕</p>
        </div>
      </footer>
    </div>
  );
}
