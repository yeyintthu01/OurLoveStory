<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>💕 Our Chat</h1>
      <button @click="$emit('close')" class="close-chat-btn">✕</button>
    </div>

    <div class="messages-container">
      <div v-if="messages.length === 0" class="empty-chat">
        <p>Start a conversation with your love</p>
      </div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.sender]"
      >
        <div class="message-content">
          <p>
            {{ msg.text }}
            <span class="message-time"
              >{{ formatTime(msg.createdAt) }}
              <span class="checkmark" :class="{ seen: msg.seen }">{{
                msg.seen ? "✓✓" : "✓"
              }}</span></span
            >
          </p>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="message other">
        <div class="message-content typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <div class="chat-input-section">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        @input="handleTyping"
        type="text"
        placeholder="Type a message..."
        class="chat-input"
      />
      <button @click="sendMessage" class="send-btn">Send</button>
    </div>
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
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export default {
  emits: ["close"],
  setup() {
    const messages = ref([]);
    const newMessage = ref("");
    const isTyping = ref(false);
    let typingTimeout;

    const loadMessages = async () => {
      try {
        const q = query(collection(db, "chat"), orderBy("createdAt", "asc"));
        onSnapshot(q, (snapshot) => {
          messages.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Mark all messages as seen when loaded
          snapshot.docs.forEach((doc) => {
            if (!doc.data().seen && doc.data().sender !== "user") {
              updateDoc(doc(db, "chat", doc.id), { seen: true });
            }
          });
        });
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    const handleTyping = () => {
      isTyping.value = true;
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        isTyping.value = false;
      }, 1000);
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      try {
        await addDoc(collection(db, "chat"), {
          text: newMessage.value,
          sender: "user",
          seen: false,
          createdAt: new Date(),
        });
        newMessage.value = "";
        isTyping.value = false;
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    onMounted(() => {
      loadMessages();
    });

    return {
      messages,
      newMessage,
      isTyping,
      sendMessage,
      handleTyping,
      formatTime,
    };
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a0000, #4d0000);
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.chat-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.close-chat-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.close-chat-btn:hover {
  opacity: 0.8;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.empty-chat {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}

.message {
  display: flex;
  animation: slideIn 0.3s ease-out;
}

.message.user {
  justify-content: flex-end;
}

.message.other {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 20px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: linear-gradient(135deg, #cc0000, #660000);
  color: white;
}

.message.other .message-content {
  background: #e0e0e0;
  color: #333;
}

.message-content p {
  margin: 0;
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 8px;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  white-space: nowrap;
  margin-left: auto;
}

.checkmark {
  margin-left: 4px;
}

.checkmark.seen {
  color: #4db8ff;
}

.chat-input-section {
  display: flex;
  gap: 10px;
}

.chat-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.chat-input:focus {
  outline: none;
  border-color: #cc0000;
  box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.1);
}

.send-btn {
  padding: 12px 25px;
  background: linear-gradient(135deg, #cc0000, #660000);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.send-btn:hover {
  transform: scale(1.05);
}

.send-btn:active {
  transform: scale(0.95);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Typing Indicator Animation */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 15px !important;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    opacity: 0.5;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .chat-container {
    padding: 10px;
  }

  .message-content {
    max-width: 85%;
  }
}
</style>
