<template>
  <div class="feed-container">
    <div class="feed-header">
      <h1>💕 OurFeed</h1>
      <p>Our moments and memories</p>
    </div>

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
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

export default {
  setup() {
    const posts = ref([]);
    const expandedPost = ref(null);
    const newComment = ref("");

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
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
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
      formatDate,
      likePost,
      toggleComments,
      addComment,
    };
  },
};
</script>

<style scoped>
.feed-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.feed-header {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #ff6b9d, #ffa07a);
  color: white;
  border-radius: 8px;
  margin-bottom: 30px;
}

.feed-header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.feed-header p {
  margin: 10px 0 0 0;
  opacity: 0.9;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.post-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-header h3 {
  margin: 0;
  color: #2c3e50;
}

.post-date {
  font-size: 12px;
  color: #999;
}

.post-content {
  padding: 20px;
}

.post-content p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: #333;
}

.post-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
}

.post-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.post-footer button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.post-footer button:hover {
  background: #f9f9f9;
}

.post-footer button.liked {
  background: #ffe0e6;
  border-color: #ff6b9d;
}

.comments-section {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  background: #f9f9f9;
}

.comment {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.comment p {
  margin: 5px 0;
  font-size: 14px;
}

.comment strong {
  color: #ff6b9d;
}

.add-comment {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.add-comment input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.add-comment button {
  padding: 10px 20px;
  background: #ff6b9d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
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
</style>
