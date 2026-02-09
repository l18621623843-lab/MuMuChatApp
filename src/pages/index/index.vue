<script lang="ts" setup>
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
const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44
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
  <view class="min-h-screen flex flex-col bg-#f5f9ff">
    <view class="glass-panel fixed left-0 right-0 top-0 z-1000 pt-safe">
      <view class="relative h-44px flex items-center px-4">
        <view class="w-70px" />
        <view class="flex-1 text-center">
          <text class="text-17px text-#1f2d3d font-600">聊天</text>
        </view>
        <view class="w-70px flex items-center justify-end gap-3">
          <view class="glass-icon-btn h-32px w-32px flex items-center justify-center rounded-10px transition-all active:scale-95" @click="openAddMenu">
            <text class="text-16px">＋</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view
      class="no-bounce flex-1"
      :style="{ paddingTop: `${headerPadTop}px` }"
      scroll-y
    >
      <view class="glass-card mx-3 mt-3 rounded-17px">
        <view v-for="item in chatList" :key="item.id" class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f0f6ff/50" @click="openChat(item)" @longpress="longPressChat(item)">
          <view class="glass-avatar-wrapper relative h-48px w-48px">
            <image :src="item.avatar" class="block h-full w-full rounded-12px" />
            <view v-if="item.unread" class="absolute h-18px min-w-18px flex items-center justify-center rounded-full bg-#ff5a5f px-1.5 text-11px text-white font-500 shadow-sm -right-3px -top-3px">
              {{ item.unread }}
            </view>
          </view>
          <view class="min-w-0 flex flex-1 flex-col gap-1.5 overflow-hidden">
            <view class="flex items-baseline justify-between gap-2">
              <text class="flex-1 truncate text-15px text-#1f2d3d font-500">{{ item.name }}</text>
              <text class="flex-shrink-0 text-11px text-#9aa4b2">{{ item.time }}</text>
            </view>
            <view class="flex items-center justify-between gap-2">
              <text class="flex-1 truncate text-13px text-#7a8391">{{ item.message }}</text>
            </view>
          </view>
        </view>
        <view class="px-4 py-2.5 text-12px text-#9aa4b2">
          折叠置顶聊天
        </view>
      </view>
    </scroll-view>
  </view>
</template>
