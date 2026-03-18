<template>
  <div class="letters-container">
    <div class="letters-header">
      <h1>💌 Our Letters</h1>
      <p>Words from the heart</p>
    </div>

    <!-- Write Letter Form -->
    <transition name="slide-fade">
      <div v-if="showForm" class="letter-form">
        <h3>Write a Letter</h3>
        <select v-model="newLetter.from" class="letter-input">
          <option value="">From...</option>
          <option value="A Ko">A Ko</option>
          <option value="Shoon">Shoon</option>
        </select>

        <textarea
          v-model="newLetter.content"
          placeholder="Write your letter here..."
          class="letter-textarea"
        ></textarea>
        <div class="form-buttons">
          <button @click="showForm = false" class="btn-cancel">Cancel</button>
          <button
            @click="submitLetter"
            class="btn-submit"
            :disabled="!newLetter.from || !newLetter.content.trim()"
          >
            Send Letter 💌
          </button>
        </div>
      </div>
    </transition>

    <!-- Write Button -->
    <button v-if="!showForm" @click="showForm = true" class="write-btn">
      ✍️ Write a Letter
    </button>

    <!-- Letters List -->
    <div class="letters-list">
      <div v-if="letters.length === 0" class="empty">
        <p>No letters yet. Write your first letter!</p>
      </div>
      <div
        v-for="letter in letters"
        :key="letter.id"
        class="letter-card"
        @click="openLetter(letter)"
      >
        <div class="letter-card-header">
          <span class="letter-from">From {{ letter.from }}</span>
          <span class="letter-date">{{ formatDate(letter.createdAt) }}</span>
        </div>
        <h3 class="letter-title"></h3>
        <p class="letter-preview">{{ letter.content.substring(0, 100) }}...</p>
      </div>
    </div>

    <!-- Letter Detail Modal -->
    <transition name="slide-fade">
      <div
        v-if="selectedLetter"
        class="letter-modal-overlay"
        @click.self="selectedLetter = null"
      >
        <div class="letter-modal">
          <div class="modal-header">
            <div>
              <span class="letter-from">From {{ selectedLetter.from }}</span>
              <span class="letter-date">
                · {{ formatDate(selectedLetter.createdAt) }}</span
              >
            </div>
            <button @click="selectedLetter = null" class="close-btn">✕</button>
          </div>
          <h2 class="modal-title"></h2>
          <p class="modal-content">{{ selectedLetter.content }}</p>
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
    const letters = ref([]);
    const showForm = ref(false);
    const selectedLetter = ref(null);
    const newLetter = ref({ from: "", content: "" });

    const loadLetters = async () => {
      try {
        const q = query(
          collection(db, "letters"),
          orderBy("createdAt", "desc"),
        );
        const snap = await getDocs(q);
        letters.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error loading letters:", error);
      }
    };

    const submitLetter = async () => {
      if (!newLetter.value.from || !newLetter.value.content.trim()) return;
      try {
        await addDoc(collection(db, "letters"), {
          from: newLetter.value.from,
          content: newLetter.value.content,
          createdAt: new Date(),
        });
        newLetter.value = { from: "", content: "" };
        showForm.value = false;
        loadLetters();
      } catch (error) {
        console.error("Error submitting letter:", error);
      }
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const openLetter = (letter) => {
      selectedLetter.value = letter;
    };

    onMounted(() => {
      loadLetters();
    });

    return {
      letters,
      showForm,
      newLetter,
      selectedLetter,
      formatDate,
      submitLetter,
      openLetter,
    };
  },
};
</script>

<style scoped>
.letters-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.letters-header {
  text-align: center;
  padding: 25px 15px;
  background: linear-gradient(135deg, #1a0000, #4d0000);
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.letters-header h1 {
  margin: 0;
  font-size: 1.8rem;
}
.letters-header p {
  margin: 5px 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* Write Button */
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

/* Letter Form */
.letter-form {
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

.letter-form h3 {
  margin: 0;
  color: #1a0000;
}

.letter-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.letter-input:focus {
  outline: none;
  border-color: #cc0000;
  box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.1);
}

.letter-textarea {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  min-height: 200px;
  resize: vertical;
  line-height: 1.6;
  transition: all 0.3s;
}

.letter-textarea:focus {
  outline: none;
  border-color: #cc0000;
  box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.1);
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
  transition: opacity 0.3s;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Letters List */
.letters-list {
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

.letter-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid #cc0000;
  animation: fadeIn 0.4s ease-out;
}

.letter-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.letter-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.letter-from {
  font-size: 0.85rem;
  color: #cc0000;
  font-weight: 600;
}
.letter-date {
  font-size: 0.8rem;
  color: #999;
}
.letter-title {
  margin: 0 0 8px 0;
  color: #1a0000;
  font-size: 1.1rem;
}
.letter-preview {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Modal */
.letter-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.letter-modal {
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
  margin-bottom: 15px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;
}

.modal-title {
  margin: 0 0 20px 0;
  color: #1a0000;
  font-size: 1.4rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.modal-content {
  color: #333;
  line-height: 1.8;
  font-size: 1rem;
  white-space: pre-wrap;
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
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
