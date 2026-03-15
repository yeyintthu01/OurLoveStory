<template>
  <div class="admin-overlay">
    <div class="admin-panel">
      <div class="admin-header">
        <h2>Admin Panel</h2>
        <button @click="$emit('close')" class="close-btn">✕</button>
      </div>

      <div class="admin-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="{ active: activeTab === tab }"
          class="tab-btn"
        >
          {{ tab }}
        </button>
      </div>

      <div class="admin-content">
        <!-- Timeline Tab -->
        <div v-if="activeTab === 'Timeline'" class="tab-content">
          <h3>Add Timeline Item</h3>
          <form @submit.prevent="addTimeline">
            <input
              v-model="timelineForm.year"
              type="number"
              placeholder="Year"
              required
            />
            <input
              v-model="timelineForm.title"
              type="text"
              placeholder="Title"
              required
            />
            <textarea
              v-model="timelineForm.description"
              placeholder="Description"
              required
            ></textarea>
            <button type="submit">Add Timeline</button>
          </form>
        </div>

        <!-- Gallery Tab -->
        <div v-if="activeTab === 'Gallery'" class="tab-content">
          <h3>Add Gallery Item</h3>
          <form @submit.prevent="addGallery">
            <input
              v-model="galleryForm.title"
              type="text"
              placeholder="Title"
              required
            />
            <textarea
              v-model="galleryForm.description"
              placeholder="Description"
            ></textarea>
            <input
              type="file"
              @change="onImageSelect"
              accept="image/*"
              required
            />
            <button type="submit" :disabled="uploading">
              {{ uploading ? "Uploading..." : "Add Gallery" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../firebase";

export default {
  emits: ["close", "update"],
  setup(props, { emit }) {
    const activeTab = ref("Timeline");
    const tabs = ["Timeline", "Gallery"];
    const uploading = ref(false);
    const selectedFile = ref(null);

    const timelineForm = ref({
      year: new Date().getFullYear(),
      title: "",
      description: "",
    });

    const galleryForm = ref({
      title: "",
      description: "",
    });

    const onImageSelect = (e) => {
      selectedFile.value = e.target.files[0];
    };

    const addTimeline = async () => {
      try {
        await addDoc(collection(db, "timeline"), {
          year: parseInt(timelineForm.value.year),
          title: timelineForm.value.title,
          description: timelineForm.value.description,
          createdAt: new Date(),
        });
        timelineForm.value = {
          year: new Date().getFullYear(),
          title: "",
          description: "",
        };
        emit("update");
        alert("Timeline item added!");
      } catch (error) {
        console.error("Error adding timeline:", error);
        alert("Error adding timeline item");
      }
    };

    const addGallery = async () => {
      if (!selectedFile.value) {
        alert("Please select an image");
        return;
      }

      uploading.value = true;
      try {
        const imageRef = storageRef(
          storage,
          `gallery/${Date.now()}_${selectedFile.value.name}`,
        );
        await uploadBytes(imageRef, selectedFile.value);
        const imageUrl = await getDownloadURL(imageRef);

        await addDoc(collection(db, "gallery"), {
          title: galleryForm.value.title,
          description: galleryForm.value.description,
          image: imageUrl,
          createdAt: new Date(),
        });

        galleryForm.value = { title: "", description: "" };
        selectedFile.value = null;
        emit("update");
        alert("Gallery item added!");
      } catch (error) {
        console.error("Error adding gallery:", error);
        alert("Error adding gallery item");
      } finally {
        uploading.value = false;
      }
    };

    return {
      activeTab,
      tabs,
      uploading,
      timelineForm,
      galleryForm,
      onImageSelect,
      addTimeline,
      addGallery,
    };
  },
};
</script>

<style scoped>
.admin-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.admin-panel {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.admin-header h2 {
  margin: 0;
  color: #cc0000;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.admin-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #999;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #cc0000;
  border-bottom-color: #cc0000;
}

.admin-content {
  padding: 20px;
}

.tab-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input,
textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #cc0000;
  box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button[type="submit"] {
  padding: 10px;
  background: linear-gradient(135deg, #cc0000, #660000);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.3s;
}

button[type="submit"]:hover:not(:disabled) {
  opacity: 0.9;
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
