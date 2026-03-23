<template>
  <div class="diary-container">
    <div class="diary-header">
      <h1>📔 Our Diary</h1>
      <p>Daily moments & routines</p>
    </div>

    <!-- Write Button -->
    <button v-if="!showForm" @click="showForm = true" class="write-btn">
      ✍️ Write Today's Entry
    </button>

    <!-- Write Form -->
    <transition name="slide-fade">
      <div v-if="showForm" class="diary-form">
        <select v-model="newEntry.from" class="diary-input">
          <option value="">From...</option>
          <option value="A Ko">A Ko</option>
          <option value="Shoon">Shoon</option>
        </select>
        <textarea
          v-model="newEntry.content"
          placeholder="How was your day?"
          class="diary-textarea"
        ></textarea>
        <div class="form-buttons">
          <button @click="showForm = false" class="btn-cancel">Cancel</button>
          <button
            @click="submitEntry"
            class="btn-submit"
            :disabled="!newEntry.from || !newEntry.content.trim()"
          >
            Save Entry 📔
          </button>
        </div>
      </div>
    </transition>

    <!-- Entries List -->
    <div class="entries-list">
      <div v-if="entries.length === 0" class="empty">
        <p>No entries yet. Write your first diary entry!</p>
      </div>
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="entry-card"
        @click="openEntry(entry)"
      >
        <div class="entry-header">
          <span class="entry-from">{{ entry.from }}</span>
          <span class="entry-date">{{ formatDate(entry.createdAt) }}</span>
        </div>
        <p class="entry-preview">{{ entry.content.substring(0, 120) }}...</p>
      </div>
    </div>

    <!-- Entry Detail Modal -->
    <transition name="slide-fade">
      <div
        v-if="selectedEntry"
        class="modal-overlay"
        @click.self="selectedEntry = null"
      >
        <div class="entry-modal">
          <div class="modal-header">
            <div>
              <span class="entry-from">{{ selectedEntry.from }}</span>
              <span class="entry-date">
                · {{ formatDate(selectedEntry.createdAt) }}</span
              >
            </div>
            <button @click="selectedEntry = null" class="close-btn">✕</button>
          </div>
          <p class="modal-content">{{ selectedEntry.content }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export default {
  setup() {
    const entries = ref([]);
    const showForm = ref(false);
    const selectedEntry = ref(null);
    const newEntry = ref({ from: "", content: "" });

    const loadEntries = async () => {
      try {
        const q = query(collection(db, "diary"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        entries.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error loading entries:", error);
      }
    };

    const submitEntry = async () => {
      if (!newEntry.value.from || !newEntry.value.content.trim()) return;
      try {
        await addDoc(collection(db, "diary"), {
          from: newEntry.value.from,
          content: newEntry.value.content,
          createdAt: new Date(),
        });
        newEntry.value = { from: "", content: "" };
        showForm.value = false;
        loadEntries();
      } catch (error) {
        console.error("Error saving entry:", error);
      }
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 5) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const openEntry = (entry) => {
      selectedEntry.value = entry;
    };

    onMounted(() => {
      loadEntries();
    });

    return {
      entries,
      showForm,
      newEntry,
      selectedEntry,
      formatDate,
      submitEntry,
      openEntry,
    };
  },
};
</script>

<style scoped>
.diary-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.diary-header {
  text-align: center;
  padding: 25px 15px;
  background: linear-gradient(135deg, #1a0000, #4d0000);
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.diary-header h1 {
  margin: 0;
  font-size: 1.8rem;
}
.diary-header p {
  margin: 5px 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.write-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid #cc0000;
  color: #cc0000;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.write-btn:hover {
  background: #cc0000;
  color: white;
}

.diary-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: slideUp 0.3s ease-out;
}

.diary-input,
.diary-textarea {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.diary-input:focus,
.diary-textarea:focus {
  outline: none;
  border-color: #cc0000;
  box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.1);
}

.diary-textarea {
  min-height: 180px;
  resize: vertical;
  line-height: 1.6;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.btn-cancel {
  flex: 1;
  padding: 10px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-submit {
  flex: 2;
  padding: 10px;
  background: linear-gradient(135deg, #cc0000, #660000);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}

.entry-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid #cc0000;
  animation: fadeIn 0.4s ease-out;
}

.entry-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.entry-from {
  font-size: 0.85rem;
  color: #cc0000;
  font-weight: 600;
}
.entry-date {
  font-size: 0.8rem;
  color: #999;
}
.entry-preview {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.entry-modal {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
}

.modal-content {
  color: #333;
  line-height: 1.8;
  font-size: 1rem;
  white-space: pre-wrap;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
