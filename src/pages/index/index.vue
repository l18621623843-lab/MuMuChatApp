<script lang="ts" setup>
import { tabbarStore } from '@/tabbar/store'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '%tabbar.wechat%',
  },
})

const chatList = ref([
  { id: 1, name: '绽骨开发进度群', message: '清大：群资料 [图片]', time: '12:24', unread: 2, avatar: '/static/images/avatar.jpg' },
  { id: 2, name: '（清大）显橙', message: '这歌不错太长太长了', time: '11:56', unread: 0, avatar: '/static/images/default-avatar.png' },
  { id: 3, name: '交易临时小分队', message: '清大：自产化测试人群：好', time: '11:52', unread: 3, avatar: '/static/images/avatar.jpg' },
  { id: 4, name: '现货+需求侧产品讨论群', message: '清大：显橙：执行脚本全部重启下', time: '10:21', unread: 0, avatar: '/static/images/default-avatar.png' },
  { id: 5, name: '谭威威', message: '好的', time: '9:30', unread: 0, avatar: '/static/images/avatar.jpg' },
  { id: 6, name: '大家庭 family', message: '[动画表情]', time: '周六', unread: 0, avatar: '/static/images/default-avatar.png' },
  { id: 7, name: '立海（广电项目生产环境维护/…）', message: '重启一下看看海哥', time: '周五', unread: 1, avatar: '/static/images/avatar.jpg' },
  { id: 8, name: '（清大）周璟', message: '好的', time: '周五', unread: 0, avatar: '/static/images/default-avatar.png' },
  { id: 9, name: '子站攻坚', message: '清大：张玉恒：是否刷新，是否显示菜单', time: '周五', unread: 0, avatar: '/static/images/avatar.jpg' },
  { id: 10, name: '（清大）冬连', message: '收到', time: '周五', unread: 0, avatar: '/static/images/default-avatar.png' },
])
const contactsOnTelegram = [
  { id: 1, name: '龙', status: '近期曾上线', avatar: '/static/images/avatar.jpg' },
  { id: 2, name: '190 7542 2755', status: '很久前上线', avatar: '/static/images/default-avatar.png' },
  { id: 3, name: '慕龙 应', status: '很久前上线', avatar: '/static/images/avatar.jpg' },
]
const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44
const totalUnread = computed(() => chatList.value.reduce((sum, item) => sum + (item.unread || 0), 0))

watchEffect(() => {
  tabbarStore.setTabbarItemBadge(0, totalUnread.value)
})
function openChat(item) {
  item.unread = 0
  uni.showToast({ title: `打开会话：${item.name}`, icon: 'none' })
}
function longPressChat(item) {
  const actions = ['标记为未读', '标记为已读', '删除']
  uni.showActionSheet({
    itemList: actions,
    success(res) {
      const idx = res.tapIndex
      if (actions[idx] === '标记为未读') {
        item.unread = Math.max(1, item.unread || 0)
      }
      else if (actions[idx] === '标记为已读') {
        item.unread = 0
      }
      else if (actions[idx] === '删除') {
        const arr = chatList.value
        arr.splice(arr.indexOf(item), 1)
      }
    },
  })
}
function openAddMenu() {
  uni.showActionSheet({ itemList: ['发起群聊', '添加朋友', '扫一扫'] })
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f2f2f2">
    <view class="fixed left-0 right-0 top-0 z-1000 bg-#f2f2f2 pt-safe">
      <view class="h-44px flex items-center justify-between px-4">
        <text class="text-18px text-#3aa3ff font-700">MuMuChat</text>
        <view class="flex items-center gap-3 text-18px text-#444">
          <text>🔍</text>
          <text>🔒</text>
          <text @click="openAddMenu">⋮</text>
        </view>
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view
      class="no-bounce flex-1"
      :style="{ paddingTop: `${headerPadTop}px` }"
      scroll-y
    >
      <view class="bg-white">
        <view
          v-for="(item, idx) in chatList"
          :key="item.id"
          class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
          :class="idx === chatList.length - 1 ? '' : 'border-b-1 border-#ededed'"
          @click="openChat(item)"
          @longpress="longPressChat(item)"
        >
          <view class="relative h-50px w-50px" style="overflow: visible;">
            <image :src="item.avatar" class="block h-full w-full rounded-full" />
            <view v-if="item.unread" class="absolute right--2px top--2px h-18px min-w-18px flex items-center justify-center rounded-full bg-#ff4d4f px-1.5 text-11px text-white font-600 shadow">
              {{ item.unread }}
            </view>
          </view>
          <view class="min-w-0 flex flex-1 flex-col gap-1 overflow-hidden">
            <view class="flex items-center justify-between gap-2">
              <text class="flex-1 truncate text-15px text-#1f1f1f font-600">{{ item.name }}</text>
              <text class="flex-shrink-0 text-11px text-#9b9b9b">{{ item.time }}</text>
            </view>
            <text class="truncate text-13px text-#9b9b9b">{{ item.message }}</text>
          </view>
        </view>
      </view>

      <view class="mt-4">
        <view class="px-4 py-2 text-12px text-#8f8f8f">
          您在 Telegram 上的联系人
        </view>
        <view class="bg-white">
          <view
            v-for="(contact, idx) in contactsOnTelegram"
            :key="contact.id"
            class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
            :class="idx === contactsOnTelegram.length - 1 ? '' : 'border-b-1 border-#ededed'"
          >
            <image :src="contact.avatar" class="h-44px w-44px rounded-full" />
            <view class="min-w-0 flex flex-1 flex-col gap-1">
              <text class="truncate text-15px text-#1f1f1f font-600">{{ contact.name }}</text>
              <text class="truncate text-12px text-#9b9b9b">{{ contact.status }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
