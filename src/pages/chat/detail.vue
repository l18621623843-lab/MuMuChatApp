<script lang="ts" setup>
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { computed, nextTick, ref } from 'vue'
import { useChatStore } from '@/store/chat'
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'Chat',
  },
})

const chatStore = useChatStore()
chatStore.ensureSeeded()
const userStore = useUserStore()

const convId = ref('')
const draft = ref('')
const scrollIntoView = ref('')
const inputFocused = ref(false)
const keyboardHeight = ref(0)

const conversation = computed(() => chatStore.getConversation(convId.value))
const messages = computed(() => chatStore.getMessages(convId.value))
const myAvatar = computed(() => userStore.userInfo.avatar || '/static/images/default-avatar.png')
const peerAvatar = computed(() => conversation.value?.avatar || '/static/images/default-avatar.png')

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44
const bottomSafe = (_sys.safeAreaInsets && _sys.safeAreaInsets.bottom) || 0
const baseComposerH = 56

function formatTimeDivider(ts: number) {
  const d = new Date(ts)
  const hour = d.getHours()
  const isPm = hour >= 12
  const hour12 = (hour % 12) || 12
  const mm = `${d.getMinutes()}`.padStart(2, '0')
  return `${isPm ? '下午' : '上午'}${hour12}:${mm}`
}

const renderItems = computed(() => {
  const list = messages.value
  const out: Array<
    | { type: 'time', id: string, label: string }
    | { type: 'msg', id: string, msg: typeof list[number] }
  > = []
  let prevTs = 0
  for (const m of list) {
    const gap = prevTs ? (m.at - prevTs) : Number.POSITIVE_INFINITY
    if (!prevTs || gap >= 5 * 60 * 1000) {
      out.push({ type: 'time', id: `t_${m.id}`, label: formatTimeDivider(m.at) })
    }
    out.push({ type: 'msg', id: `m_${m.id}`, msg: m })
    prevTs = m.at
  }
  return out
})

const composerStyle = computed(() => ({
  paddingBottom: `${bottomSafe}px`,
  transform: `translate3d(0, ${keyboardHeight.value ? `-${keyboardHeight.value}px` : '0'}, 0)`,
}))

const scrollPadBottom = computed(() => {
  return `${baseComposerH + bottomSafe + keyboardHeight.value}px`
})

function syncScrollToBottom() {
  const last = renderItems.value[renderItems.value.length - 1]
  if (!last)
    return
  scrollIntoView.value = last.id
}

async function send() {
  const text = draft.value.trim()
  if (!text)
    return
  chatStore.sendText(convId.value, text)
  draft.value = ''
  await nextTick()
  syncScrollToBottom()
  setTimeout(async () => {
    chatStore.simulateIncomingText(convId.value, '收到。')
    chatStore.openConversation(convId.value)
    await nextTick()
    syncScrollToBottom()
  }, 700)
}

function openProfile() {
  const conv = conversation.value
  if (!conv)
    return
  if (conv.peerContactId) {
    uni.navigateTo({ url: `/pages/contacts/detail?contactId=${encodeURIComponent(conv.peerContactId)}` })
  }
  else {
    uni.showToast({ title: '群资料（模拟）', icon: 'none' })
  }
}

function simulateIncoming() {
  chatStore.simulateIncomingText(convId.value, '我这边可以。')
  chatStore.openConversation(convId.value)
  nextTick(() => syncScrollToBottom())
}

function goBack() {
  uni.navigateBack()
}

function handleFocus() {
  inputFocused.value = true
  nextTick(() => syncScrollToBottom())
}

function handleBlur() {
  inputFocused.value = false
}

function voiceSim() {
  uni.showToast({ title: '语音（模拟）', icon: 'none' })
}

function emojiSim() {
  uni.showToast({ title: '表情（模拟）', icon: 'none' })
}

function moreSim() {
  uni.showToast({ title: '更多（模拟）', icon: 'none' })
}

onLoad((query) => {
  convId.value = `${query?.convId || ''}`
  chatStore.openConversation(convId.value)
  nextTick(() => syncScrollToBottom())

  const handler = (res: any) => {
    keyboardHeight.value = res.height || 0
    nextTick(() => syncScrollToBottom())
  }
  uni.onKeyboardHeightChange(handler)

  onUnload(() => {
    const off = (uni as any).offKeyboardHeightChange
    if (typeof off === 'function')
      off(handler)
    else
      uni.onKeyboardHeightChange(() => {})
  })
})

onShow(() => {
  if (convId.value)
    chatStore.openConversation(convId.value)
})
</script>

<template>
  <view class="chat-page min-h-screen flex flex-col">
    <view class="chat-header fixed left-0 right-0 top-0 z-1000 pt-safe">
      <view class="h-44px flex items-center justify-between px-3">
        <view class="flex items-center gap-2" @click="goBack">
          <view class="i-carbon-chevron-left h-22px w-22px text-#2f9bff" />
          <text class="text-14px text-#3aa3ff">返回</text>
        </view>
        <view class="min-w-0 flex flex-1 flex-col items-center" @click="openProfile">
          <text class="max-w-220px truncate text-15px text-#111 font-600">{{ conversation?.title || '会话' }}</text>
          <text class="text-11px text-#9b9b9b">{{ conversation?.isGroup ? '群组 · 点击查看' : '点击查看资料' }}</text>
        </view>
        <view class="flex items-center gap-10px">
          <view class="header-icon-btn" @click="simulateIncoming">
            <view class="i-carbon-add h-18px w-18px text-#2f9bff" />
          </view>
          <view class="header-icon-btn">
            <view class="i-carbon-overflow-menu-vertical h-18px w-18px text-#2f9bff" />
          </view>
        </view>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view
      class="no-bounce flex-1"
      :style="{ paddingTop: `${headerPadTop}px`, paddingBottom: scrollPadBottom }"
      scroll-y
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
    >
      <view class="px-10px py-14px">
        <template v-for="it in renderItems" :key="it.id">
          <view v-if="it.type === 'time'" :id="it.id" class="chat-time-divider">
            <text class="chat-time-text">{{ it.label }}</text>
          </view>

          <view
            v-else
            :id="it.id"
            class="chat-row"
            :class="it.msg.outgoing ? 'outgoing' : 'incoming'"
          >
            <image v-if="!it.msg.outgoing" :src="peerAvatar" class="chat-avatar" />
            <view class="chat-bubble" :class="it.msg.outgoing ? 'outgoing' : 'incoming'">
              <text v-if="conversation?.isGroup && !it.msg.outgoing" class="chat-sender">{{ it.msg.senderName }}</text>
              <text class="chat-text">{{ it.msg.text }}</text>
            </view>
            <image v-if="it.msg.outgoing" :src="myAvatar" class="chat-avatar" />
          </view>
        </template>
      </view>
    </scroll-view>

    <view class="composer fixed bottom-0 left-0 right-0 z-1000" :class="{ focused: inputFocused }" :style="composerStyle">
      <view class="composer-line" />
      <view class="composer-inner">
        <view class="composer-btn" @click="voiceSim">
          <view class="i-carbon-volume-up h-20px w-20px text-#2f9bff" />
        </view>

        <view class="composer-input" :class="{ focused: inputFocused }">
          <input
            v-model="draft"
            class="composer-input-inner"
            placeholder="消息"
            placeholder-class="text-#b0b0b0"
            confirm-type="send"
            @confirm="send"
            @focus="handleFocus"
            @blur="handleBlur"
          >
        </view>

        <template v-if="draft.trim()">
          <view class="composer-send" @click="send">
            <view class="i-carbon-send-filled h-18px w-18px text-white" />
          </view>
        </template>
        <template v-else>
          <view class="composer-btn" @click="emojiSim">
            <view class="i-carbon-face-wink h-20px w-20px text-#2f9bff" />
          </view>
          <view class="composer-btn" @click="moreSim">
            <view class="i-carbon-add h-22px w-22px text-#2f9bff" />
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.chat-page {
  background:
    radial-gradient(circle at 20% 10%, rgba(78, 163, 255, 0.16), rgba(0, 0, 0, 0) 55%),
    radial-gradient(circle at 80% 35%, rgba(58, 163, 255, 0.12), rgba(0, 0, 0, 0) 55%),
    linear-gradient(180deg, #15181f 0%, #10131a 100%);
}

.header-icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow:
    0 10px 22px rgba(58, 163, 255, 0.16),
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    inset 0 -10px 18px rgba(78, 163, 255, 0.1);
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
}

.chat-header {
  background: rgba(242, 242, 242, 0.86);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
}

.chat-time-divider {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.chat-time-text {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
}

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin: 8px 0;
}
.chat-row.incoming {
  justify-content: flex-start;
}
.chat-row.outgoing {
  justify-content: flex-end;
}
.chat-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.chat-bubble {
  max-width: 72%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 20px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
  position: relative;
}
.chat-bubble.incoming {
  background: rgba(255, 255, 255, 0.92);
  color: #1e1e1e;
  border-top-left-radius: 6px;
}
.chat-bubble.outgoing {
  background: rgba(132, 215, 85, 0.95);
  color: #0f1a0f;
  border-top-right-radius: 6px;
}
.chat-sender {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #2f9bff;
}
.chat-text {
  word-break: break-word;
}

.composer {
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(14px) saturate(170%);
  -webkit-backdrop-filter: blur(14px) saturate(170%);
  transition:
    transform 0.22s ease,
    background 0.22s ease;
}
.composer.focused {
  background: rgba(255, 255, 255, 0.94);
}
.composer-line {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
}
.composer-inner {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  box-sizing: border-box;
}
.composer-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 10px 18px rgba(58, 163, 255, 0.12),
    inset 0 1px 1px rgba(255, 255, 255, 0.92),
    inset 0 -10px 16px rgba(78, 163, 255, 0.08);
}
.composer-input {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: rgba(245, 247, 250, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-sizing: border-box;
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}
.composer-input.focused {
  background: rgba(255, 255, 255, 0.98);
  border-color: rgba(47, 155, 255, 0.35);
  box-shadow: 0 10px 20px rgba(58, 163, 255, 0.16);
}
.composer-input-inner {
  width: 100%;
  font-size: 14px;
  color: #222;
}
.composer-send {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: linear-gradient(145deg, #4ea3ff, #2f9bff);
  box-shadow: 0 12px 22px rgba(58, 163, 255, 0.22);
}
</style>
