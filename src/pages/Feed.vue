<template>
  <div class="feed-container">
    <div class="feed-header">
      <h1>💕 OurFeed</h1>
      <p>Our moments and memories</p>
    </div>

    <!-- Create Post Button -->
    <button @click="showPostModal = true" class="create-post-btn">
      What's on your mind?
    </button>

    <!-- Post Creation Section (Modal) -->
    <transition name="slide-fade">
      <div v-if="showPostModal" class="post-creator">
        <textarea
          v-model="newPost.content"
          placeholder="What's on your mind?"
          class="post-textarea"
        ></textarea>
        <div class="creator-buttons">
          <button @click="triggerPhotoUpload" class="btn-photo">
            📷 Add Photo
          </button>
          <button
            @click="createPost"
            class="btn-post"
            :disabled="!newPost.content.trim()"
          >
            Post Status
          </button>
        </div>
        <input
          ref="photoInput"
          type="file"
          @change="onPhotoSelect"
          accept="image/*"
          style="display: none"
        />
        <div v-if="newPost.photoPreview" class="photo-preview">
          <img :src="newPost.photoPreview" alt="Preview" />
          <button @click="removePhoto" class="btn-remove">✕</button>
        </div>
      </div>
    </transition>

    <div class="feed-content">
      <div v-if="posts.length === 0" class="empty">
        <p>No posts yet. Start sharing your moments!</p>
      </div>

      <div v-for="post in posts" :key="post.id" class="feed-post">
        <div class="post-header">
          <h3>{{ post.title }}</h3>
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
        </div>
        <div class="post-content">
          <p>{{ post.content }}</p>
          <img
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="post-image"
          />
        </div>
        <div class="post-footer">
          <button @click="likePost(post.id)" :class="{ liked: post.liked }">
            ❤️ {{ post.likes || 0 }}
          </button>
          <button @click="toggleComments(post.id)">
            💬 {{ post.comments?.length || 0 }}
          </button>
        </div>

        <div v-if="expandedPost === post.id" class="comments-section">
          <div
            v-for="comment in post.comments"
            :key="comment.id"
            class="comment"
          >
            <p>
              <strong>{{ comment.author }}</strong>
            </p>
            <p>{{ comment.text }}</p>
          </div>
          <div class="add-comment">
            <input v-model="newComment" placeholder="Add a comment..." />
            <button @click="addComment(post.id)">Post</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../firebase";

export default {
  setup() {
    const posts = ref([]);
    const expandedPost = ref(null);
    const newComment = ref("");
    const photoInput = ref(null);
    const showSuccessCard = ref(false);
    const isPosting = ref(false);
    const showPostModal = ref(false);
    const newPost = reactive({
      content: "",
      photoPreview: null,
      photoFile: null,
    });

    const loadPosts = async () => {
      try {
        const postsSnap = await getDocs(collection(db, "feed"));
        posts.value = postsSnap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => b.createdAt - a.createdAt);
      } catch (error) {
        console.error("Error loading posts:", error);
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

      if (diffSecs < 60) {
        return "just now";
      } else if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 5) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    };

    const triggerPhotoUpload = () => {
      photoInput.value.click();
    };

    const onPhotoSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        newPost.photoFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          newPost.photoPreview = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const removePhoto = () => {
      newPost.photoFile = null;
      newPost.photoPreview = null;
      photoInput.value.value = "";
    };

    const createPost = async () => {
      if (!newPost.content.trim()) return;

      try {
        isPosting.value = true;
        let imageUrl = null;
        if (newPost.photoFile) {
          const imageRef = storageRef(
            storage,
            `feed/${Date.now()}_${newPost.photoFile.name}`,
          );
          await uploadBytes(imageRef, newPost.photoFile);
          imageUrl = await getDownloadURL(imageRef);
        }

        await addDoc(collection(db, "feed"), {
          title: "Post",
          content: newPost.content,
          image: imageUrl,
          likes: 0,
          comments: [],
          createdAt: new Date(),
        });

        newPost.content = "";
        removePhoto();
        showPostModal.value = false;
        showSuccessCard.value = true;
        setTimeout(() => {
          showSuccessCard.value = false;
        }, 3000);
        loadPosts();
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Error creating post");
      } finally {
        isPosting.value = false;
      }
    };

    const likePost = async (postId) => {
      try {
        const postRef = doc(db, "feed", postId);
        const post = posts.value.find((p) => p.id === postId);
        const newLikes = (post.likes || 0) + (post.liked ? -1 : 1);

        await updateDoc(postRef, {
          likes: newLikes,
        });

        post.likes = newLikes;
        post.liked = !post.liked;
      } catch (error) {
        console.error("Error liking post:", error);
      }
    };

    const toggleComments = (postId) => {
      expandedPost.value = expandedPost.value === postId ? null : postId;
    };

    const addComment = async (postId) => {
      if (!newComment.value.trim()) return;

      try {
        const postRef = doc(db, "feed", postId);
        const comment = {
          id: Date.now(),
          author: "You",
          text: newComment.value,
          createdAt: new Date(),
        };

        await updateDoc(postRef, {
          comments: arrayUnion(comment),
        });

        const post = posts.value.find((p) => p.id === postId);
        if (!post.comments) post.comments = [];
        post.comments.push(comment);
        newComment.value = "";
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };

    onMounted(() => {
      loadPosts();
    });

    return {
      posts,
      expandedPost,
      newComment,
      photoInput,
      newPost,
      showSuccessCard,
      isPosting,
      showPostModal,
      formatDate,
      triggerPhotoUpload,
      onPhotoSelect,
      removePhoto,
      createPost,
      likePost,
      toggleComments,
      addComment,
    };
  },
};
</script>

<style scoped>
.feed-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 15px;
}

.feed-header {
  text-align: center;
  padding: 25px 15px;
  background: linear-gradient(135deg, #1a0000, #4d0000);
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.feed-header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.feed-header p {
  margin: 5px 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* Create Post Button */
.create-post-btn {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  padding: 15px 20px;
  background: transparent;
  color: #999;
  border: 1px solid #444;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s;
  text-align: left;
}

.create-post-btn:hover {
  border-color: #555;
  color: #aaa;
}

/* Slide Fade Transition */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Post Creator */
.post-creator {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  margin-bottom: 15px;
  animation: slideUp 0.4s ease-out;
}

.post-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 10px;
}

.post-textarea:focus {
  outline: none;
  border-color: #ff6b9d;
  box-shadow: 0 0 0 2px rgba(255, 107, 157, 0.1);
}

.creator-buttons {
  display: flex;
  gap: 10px;
}

.btn-photo,
.btn-post {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.85rem;
}

.btn-photo {
  background: #f0f0f0;
  color: #333;
}

.btn-photo:hover {
  background: #e0e0e0;
}

.btn-post {
  background: linear-gradient(135deg, #cc0000, #660000);
  color: white;
}

.btn-post:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-post:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.photo-preview {
  position: relative;
  margin-top: 15px;
}

.photo-preview img {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}

.btn-remove {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
}

.feed-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-style: italic;
}

.feed-post {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.post-header {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 0.95rem;
}

.post-date {
  font-size: 11px;
  color: #999;
}

.post-content {
  padding: 12px 15px;
}

.post-content p {
  margin: 0 0 10px 0;
  line-height: 1.5;
  color: #333;
  font-size: 0.9rem;
}

.post-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}

.post-footer {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
}

.post-footer button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
}

.post-footer button:hover {
  background: #f9f9f9;
}

.post-footer button.liked {
  background: #ffe0e6;
  border-color: #cc0000;
}

.comments-section {
  padding: 12px 15px;
  border-top: 1px solid #eee;
  background: #f9f9f9;
}

.comment {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.comment p {
  margin: 3px 0;
  font-size: 0.85rem;
}

.comment strong {
  color: #cc0000;
}

.add-comment {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.add-comment input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.85rem;
}

.add-comment button {
  padding: 8px 15px;
  background: #cc0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
}

.add-comment button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .feed-container {
    padding: 10px;
  }

  .feed-header h1 {
    font-size: 2rem;
  }
}

/* Success Card */
.success-card {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 20px;
  max-width: 400px;
  z-index: 999;
  animation: slideDown 0.3s ease-out;
}

.success-content {
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  color: #cc0000;
  margin-bottom: 10px;
}

.success-card h3 {
  margin: 10px 0 5px 0;
  color: #1a0000;
  font-size: 1.2rem;
}

.success-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Upload Card */
.upload-card {
  flex: 1;
  background: linear-gradient(135deg, #cc0000, #660000);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  font-size: 0.85rem;
}

.upload-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

/* Upload Card Full */
.upload-card-full {
  background: white;
  border-radius: 8px;
  padding: 40px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.upload-card-full .upload-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(204, 0, 0, 0.2);
  border-top: 3px solid #cc0000;
}

.upload-card-full p {
  color: #666;
  font-size: 1rem;
  margin: 0;
}
</style>
