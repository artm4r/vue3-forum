<template>
  <div class="notifications">
    <transition-group name="notification">
      <div class="notification" :class="`notification-${notification.type}`" v-for="notification in notifications" :key="notification.id">
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)">x</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import useNotifications from "@/composables/useNotification.js";
export default {
  name: "AppNotifications",
  setup() {
    const { notifications, removeNotification } = useNotifications()
    return { notifications, removeNotification }
  },
}
</script>

<style scoped>
  .notifications {
    position: fixed;
    bottom: 20px;
    right: 0;
  }
  .notification {
    background-color: white;
    display: flex;
    justify-content: space-between;
    width: 350px;
    padding: 10px 20px;
    margin-bottom: 8px;
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.15);
  }
  .notification-info{
    border-left: 5px solid #263959;
  }
  .notification-warning{
    border-left: 5px solid #ffc21a;
  }
  .notification-error{
    border-left: 5px solid #ff0000;
  }
  .notification-enter-active,
  .notification-leave-active {
    transition: all .5s ease;
  }
  .notification-enter-from,
  .notification-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  .notification-move {
    transition: transform 0.8s ease;
  }
</style>
