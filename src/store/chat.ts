import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type ChatMessageType = 'text'

export interface ChatContact {
  id: string
  name: string
  avatar: string
  username?: string
  phone?: string
  bio?: string
  lastSeenText: string
}

export interface ChatConversation {
  id: string
  title: string
  avatar: string
  isGroup: boolean
  muted: boolean
  pinned: boolean
  unread: number
  lastMessage: string
  lastMessageAt: number
  peerContactId?: string
}

export interface ChatMessage {
  id: string
  convId: string
  senderId: string
  senderName: string
  type: ChatMessageType
  text: string
  at: number
  outgoing: boolean
}

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function formatTimeLabel(ts: number) {
  const now = new Date()
  const d = new Date(ts)
  const sameDay = now.toDateString() === d.toDateString()
  if (sameDay) {
    const hh = `${d.getHours()}`.padStart(2, '0')
    const mm = `${d.getMinutes()}`.padStart(2, '0')
    return `${hh}:${mm}`
  }
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays === 1)
    return '昨天'
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${month}-${day}`
}

function firstLetter(name: string) {
  const s = (name || '').trim()
  if (!s)
    return '#'
  const c = s[0]
  const upper = c.toUpperCase()
  if (upper >= 'A' && upper <= 'Z')
    return upper
  return '#'
}

export const useChatStore = defineStore(
  'chat',
  () => {
    const meId = 'me'
    const meName = 'Me'

    const contacts = ref<ChatContact[]>([])
    const conversations = ref<ChatConversation[]>([])
    const messagesByConvId = ref<Record<string, ChatMessage[]>>({})

    const sortedConversations = computed(() => {
      return [...conversations.value].sort((a, b) => {
        if (a.pinned !== b.pinned)
          return a.pinned ? -1 : 1
        return b.lastMessageAt - a.lastMessageAt
      })
    })

    const totalUnread = computed(() => {
      return conversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
    })

    const contactsBySections = computed(() => {
      const map: Record<string, ChatContact[]> = {}
      for (const c of contacts.value) {
        const k = firstLetter(c.name)
        const arr = map[k] || []
        arr.push(c)
        map[k] = arr
      }
      const keys = Object.keys(map).sort((a, b) => {
        if (a === '#')
          return 1
        if (b === '#')
          return -1
        return a.localeCompare(b)
      })
      return keys.map(k => ({
        letter: k,
        list: (map[k] || []).sort((a, b) => a.name.localeCompare(b.name)),
      }))
    })

    function ensureSeeded() {
      if (contacts.value.length || conversations.value.length)
        return

      const now = Date.now()
      const seedContacts: ChatContact[] = [
        { id: 'c_1', name: '龙', lastSeenText: '近期曾上线', avatar: '/static/images/avatar.jpg', username: 'long', phone: '190 7542 2755', bio: '保持前进。' },
        { id: 'c_2', name: '190 7542 2755', lastSeenText: '很久前上线', avatar: '/static/images/default-avatar.png', phone: '190 7542 2755' },
        { id: 'c_3', name: '蒋龙 应', lastSeenText: '很久前上线', avatar: '/static/images/avatar.jpg', username: 'jiang', bio: '随时聊。' },
      ]
      contacts.value = seedContacts

      const conv1: ChatConversation = {
        id: 'g_1',
        title: '绽骨开发进度群',
        avatar: '/static/images/avatar.jpg',
        isGroup: true,
        muted: false,
        pinned: true,
        unread: 2,
        lastMessage: '清大：群资料 [图片]',
        lastMessageAt: now - 12 * 60 * 1000,
      }
      const conv2: ChatConversation = {
        id: 'd_1',
        title: seedContacts[0].name,
        avatar: seedContacts[0].avatar,
        isGroup: false,
        muted: false,
        pinned: false,
        unread: 0,
        lastMessage: '好的',
        lastMessageAt: now - 90 * 60 * 1000,
        peerContactId: seedContacts[0].id,
      }
      const conv3: ChatConversation = {
        id: 'g_2',
        title: '交易临时小分队',
        avatar: '/static/images/default-avatar.png',
        isGroup: true,
        muted: true,
        pinned: false,
        unread: 3,
        lastMessage: '清大：自产化测试人群：好',
        lastMessageAt: now - 2 * 60 * 60 * 1000,
      }

      conversations.value = [conv1, conv2, conv3]

      messagesByConvId.value = {
        [conv1.id]: [
          { id: uid('m'), convId: conv1.id, senderId: 'u_1', senderName: '清大', type: 'text', text: '今天同步一下进度', at: now - 30 * 60 * 1000, outgoing: false },
          { id: uid('m'), convId: conv1.id, senderId: meId, senderName: meName, type: 'text', text: '收到，我看看', at: now - 25 * 60 * 1000, outgoing: true },
          { id: uid('m'), convId: conv1.id, senderId: 'u_1', senderName: '清大', type: 'text', text: '群资料 [图片]', at: now - 12 * 60 * 1000, outgoing: false },
        ],
        [conv2.id]: [
          { id: uid('m'), convId: conv2.id, senderId: seedContacts[0].id, senderName: seedContacts[0].name, type: 'text', text: '在吗', at: now - 2 * 60 * 60 * 1000, outgoing: false },
          { id: uid('m'), convId: conv2.id, senderId: meId, senderName: meName, type: 'text', text: '在的', at: now - 90 * 60 * 1000, outgoing: true },
        ],
        [conv3.id]: [
          { id: uid('m'), convId: conv3.id, senderId: 'u_2', senderName: '显橙', type: 'text', text: '自产化测试人群：好', at: now - 2 * 60 * 60 * 1000, outgoing: false },
        ],
      }
    }

    function getConversation(convId: string) {
      return conversations.value.find(c => c.id === convId)
    }

    function getContact(contactId: string) {
      return contacts.value.find(c => c.id === contactId)
    }

    function getMessages(convId: string) {
      return messagesByConvId.value[convId] || []
    }

    function setMessages(convId: string, next: ChatMessage[]) {
      messagesByConvId.value = { ...messagesByConvId.value, [convId]: next }
    }

    function touchConversation(convId: string, lastMessage: string, at: number) {
      const conv = getConversation(convId)
      if (!conv)
        return
      conv.lastMessage = lastMessage
      conv.lastMessageAt = at
    }

    function openConversation(convId: string) {
      const conv = getConversation(convId)
      if (!conv)
        return
      conv.unread = 0
    }

    function markUnread(convId: string) {
      const conv = getConversation(convId)
      if (!conv)
        return
      conv.unread = Math.max(1, conv.unread || 0)
    }

    function markRead(convId: string) {
      const conv = getConversation(convId)
      if (!conv)
        return
      conv.unread = 0
    }

    function togglePin(convId: string) {
      const conv = getConversation(convId)
      if (!conv)
        return
      conv.pinned = !conv.pinned
    }

    function toggleMute(convId: string) {
      const conv = getConversation(convId)
      if (!conv)
        return
      conv.muted = !conv.muted
    }

    function deleteConversation(convId: string) {
      conversations.value = conversations.value.filter(c => c.id !== convId)
      const { [convId]: _removed, ...rest } = messagesByConvId.value
      messagesByConvId.value = rest
    }

    function createOrGetDirectConversation(contactId: string) {
      const existing = conversations.value.find(c => !c.isGroup && c.peerContactId === contactId)
      if (existing)
        return existing
      const contact = getContact(contactId)
      if (!contact)
        return undefined
      const now = Date.now()
      const conv: ChatConversation = {
        id: uid('d'),
        title: contact.name,
        avatar: contact.avatar,
        isGroup: false,
        muted: false,
        pinned: false,
        unread: 0,
        lastMessage: '',
        lastMessageAt: now,
        peerContactId: contactId,
      }
      conversations.value = [conv, ...conversations.value]
      setMessages(conv.id, [])
      return conv
    }

    function sendText(convId: string, text: string) {
      const trimmed = (text || '').trim()
      if (!trimmed)
        return
      const now = Date.now()
      const msg: ChatMessage = {
        id: uid('m'),
        convId,
        senderId: meId,
        senderName: meName,
        type: 'text',
        text: trimmed,
        at: now,
        outgoing: true,
      }
      const list = getMessages(convId)
      setMessages(convId, [...list, msg])
      touchConversation(convId, trimmed, now)
    }

    function simulateIncomingText(convId: string, text: string) {
      const trimmed = (text || '').trim()
      if (!trimmed)
        return
      const now = Date.now()
      const conv = getConversation(convId)
      if (!conv)
        return
      const senderId = conv.isGroup ? 'u_1' : (conv.peerContactId || 'u_1')
      const senderName = conv.isGroup ? '清大' : (getContact(conv.peerContactId || '')?.name || '对方')
      const msg: ChatMessage = {
        id: uid('m'),
        convId,
        senderId,
        senderName,
        type: 'text',
        text: trimmed,
        at: now,
        outgoing: false,
      }
      const list = getMessages(convId)
      setMessages(convId, [...list, msg])
      touchConversation(convId, conv.isGroup ? `${senderName}：${trimmed}` : trimmed, now)
      conv.unread += 1
    }

    function conversationTimeLabel(conv: ChatConversation) {
      return formatTimeLabel(conv.lastMessageAt)
    }

    return {
      contacts,
      conversations,
      messagesByConvId,
      sortedConversations,
      totalUnread,
      contactsBySections,
      ensureSeeded,
      getConversation,
      getContact,
      getMessages,
      openConversation,
      markUnread,
      markRead,
      togglePin,
      toggleMute,
      deleteConversation,
      createOrGetDirectConversation,
      sendText,
      simulateIncomingText,
      conversationTimeLabel,
    }
  },
  {
    persist: true,
  },
)
