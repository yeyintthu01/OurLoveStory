<template>
  <div>
    <section id="timeline" class="timeline-section">
      <div class="container">
        <h2>Our Timeline</h2>
        <div class="timeline">
          <div v-if="timeline.length === 0" class="empty">
            No timeline items yet
          </div>
          <div v-for="item in timeline" :key="item.id" class="timeline-item">
            <div class="timeline-date">{{ item.year }}</div>
            <div class="timeline-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="gallery" class="gallery-section">
      <div class="container">
        <h2>Our Memories</h2>
        <div class="gallery-grid">
          <div v-if="gallery.length === 0" class="empty">
            No gallery items yet
          </div>
          <div v-for="item in gallery" :key="item.id" class="gallery-item">
            <img :src="item.image" :alt="item.title" />
            <p>{{ item.description || item.title }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  setup() {
    const timeline = ref([]);
    const gallery = ref([]);

    const loadData = async () => {
      try {
        const timelineSnap = await getDocs(collection(db, "timeline"));
        timeline.value = timelineSnap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.year - b.year);

        const gallerySnap = await getDocs(collection(db, "gallery"));
        gallery.value = gallerySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      timeline,
      gallery,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.timeline-section {
  padding: 80px 20px;
  background: #f9f9f9;
}

.timeline-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background: #cc0000;
}

.timeline-item {
  margin-bottom: 50px;
  position: relative;
}

.timeline-item:nth-child(odd) .timeline-content {
  margin-left: 0;
  margin-right: 52%;
  text-align: right;
}

.timeline-item:nth-child(even) .timeline-content {
  margin-left: 52%;
  margin-right: 0;
  text-align: left;
}

.timeline-date {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #cc0000;
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: bold;
  z-index: 10;
  top: 0;
}

.timeline-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.timeline-content h3 {
  color: #cc0000;
  margin-bottom: 10px;
}

.gallery-section {
  padding: 80px 20px;
}

.gallery-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.gallery-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.gallery-item p {
  padding: 15px;
  text-align: center;
  color: #cc0000;
  font-weight: 500;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .timeline::before {
    left: 20px;
  }

  .timeline-item:nth-child(odd) .timeline-content,
  .timeline-item:nth-child(even) .timeline-content {
    margin-left: 60px;
    margin-right: 0;
    text-align: left;
  }

  .timeline-date {
    left: 20px;
    transform: translateX(-50%);
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
