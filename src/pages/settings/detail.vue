<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'Settings',
  },
})

type SettingItem
  = | { id: string, type: 'nav', title: string, subtitle?: string, rightText?: string }
    | { id: string, type: 'switch', title: string, subtitle?: string, key: string }
    | { id: string, type: 'action', title: string, subtitle?: string, danger?: boolean }

const pageKey = ref('account')
const pageTitle = ref('设置')

const switchState = reactive<Record<string, boolean>>({
  darkMode: false,
  animations: true,
  showPreview: true,
  biometrics: false,
  saveToGallery: true,
})

const schema = computed(() => {
  const k = pageKey.value
  if (k === 'account') {
    return {
      title: '账号',
      sections: [
        [
          { id: 'username', type: 'nav', title: '用户名', subtitle: '设置 @username', rightText: '@devin' },
          { id: 'bio', type: 'nav', title: '个人简介', subtitle: '添加简介', rightText: '保持前进' },
          { id: 'phone', type: 'nav', title: '手机号', subtitle: '管理手机号', rightText: '+86 190****2755' },
        ] satisfies SettingItem[],
        [
          { id: 'logout', type: 'action', title: '退出登录（模拟）', danger: true } satisfies SettingItem,
        ],
      ],
    }
  }
  if (k === 'chat') {
    return {
      title: '聊天设置',
      sections: [
        [
          { id: 'wallpaper', type: 'nav', title: '壁纸', subtitle: '更改聊天背景' },
          { id: 'font', type: 'nav', title: '字体大小', rightText: '默认' },
          { id: 'preview', type: 'switch', title: '消息预览', subtitle: '列表显示消息内容', key: 'showPreview' },
          { id: 'animations', type: 'switch', title: '动画效果', subtitle: '界面动效', key: 'animations' },
        ] satisfies SettingItem[],
      ],
    }
  }
  if (k === 'privacy') {
    return {
      title: '隐私与安全',
      sections: [
        [
          { id: 'lastseen', type: 'nav', title: '最后上线时间', rightText: '所有人' },
          { id: 'passkey', type: 'nav', title: '通行密钥', subtitle: '管理通行密钥' },
          { id: 'biometrics', type: 'switch', title: '生物识别锁', subtitle: '使用指纹/面容解锁', key: 'biometrics' },
        ] satisfies SettingItem[],
        [
          { id: 'sessions', type: 'nav', title: '设备', subtitle: '已登录设备', rightText: '1 台' },
        ] satisfies SettingItem[],
      ],
    }
  }
  if (k === 'notifications') {
    return {
      title: '通知',
      sections: [
        [
          { id: 'sound', type: 'nav', title: '声音', rightText: '默认' },
          { id: 'vibrate', type: 'nav', title: '震动', rightText: '开启' },
          { id: 'mute', type: 'nav', title: '免打扰', rightText: '关闭' },
        ] satisfies SettingItem[],
      ],
    }
  }
  if (k === 'data') {
    return {
      title: '数据和储存',
      sections: [
        [
          { id: 'save', type: 'switch', title: '自动保存到相册', subtitle: '接收的媒体', key: 'saveToGallery' },
          { id: 'network', type: 'nav', title: '网络用量', rightText: '查看' },
          { id: 'clear', type: 'action', title: '清理缓存（模拟）' },
        ] satisfies SettingItem[],
      ],
    }
  }
  if (k === 'devices') {
    return {
      title: '设备',
      sections: [
        [
          { id: 'current', type: 'nav', title: '当前设备', subtitle: 'H5 / 模拟器', rightText: '在线' },
          { id: 'other', type: 'nav', title: '其他设备', subtitle: '无' },
        ] satisfies SettingItem[],
      ],
    }
  }
  if (k === 'language') {
    return {
      title: '语言',
      sections: [
        [
          { id: 'zh', type: 'action', title: '简体中文（当前）' },
          { id: 'en', type: 'action', title: 'English（模拟）' },
          { id: 'ja', type: 'action', title: '日本語（模拟）' },
        ] satisfies SettingItem[],
      ],
    }
  }
  if (k === 'help') {
    return {
      title: '帮助',
      sections: [
        [
          { id: 'faq', type: 'nav', title: '常见问题', subtitle: '查看 FAQ' },
          { id: 'ask', type: 'nav', title: '向我们提问', subtitle: '反馈问题' },
          { id: 'features', type: 'nav', title: '新功能', subtitle: '查看更新' },
        ] satisfies SettingItem[],
      ],
    }
  }
  return {
    title: pageTitle.value,
    sections: [[{ id: 'placeholder', type: 'action', title: '功能开发中（模拟）' } satisfies SettingItem]],
  }
})

const _sys = uni.getSystemInfoSync()
const headerPadTop = Math.max((_sys.safeAreaInsets && _sys.safeAreaInsets.top) || 0, _sys.statusBarHeight || 0) + 44

function setSwitch(key: string, value: boolean) {
  switchState[key] = value
}

function onSwitchChange(key: string, e: any) {
  setSwitch(key, !!e?.detail?.value)
}

function tapItem(item: SettingItem) {
  if (item.type === 'switch')
    return
  if (item.type === 'action') {
    uni.showToast({ title: item.title, icon: 'none' })
    return
  }
  uni.showToast({ title: item.title, icon: 'none' })
}

function goBack() {
  uni.navigateBack()
}

onLoad((query) => {
  pageKey.value = `${query?.key || 'account'}`
  pageTitle.value = `${query?.title || ''}` || pageTitle.value
})
</script>

<template>
  <view class="min-h-screen flex flex-col bg-#f2f2f2">
    <view class="fixed left-0 right-0 top-0 z-1000 bg-#f2f2f2 pt-safe">
      <view class="h-44px flex items-center justify-between px-3">
        <view class="flex items-center gap-2" @click="goBack">
          <text class="text-18px text-#3aa3ff">‹</text>
          <text class="text-14px text-#3aa3ff">返回</text>
        </view>
        <text class="text-16px text-#111 font-700">{{ schema.title }}</text>
        <view class="w-56px" />
      </view>
      <view class="h-1px bg-#e6e6e6" />
    </view>

    <scroll-view class="no-bounce flex-1" :style="{ paddingTop: `${headerPadTop}px` }" scroll-y>
      <view class="px-4 pt-3">
        <view v-for="(section, sIdx) in schema.sections" :key="sIdx" class="mb-3 overflow-hidden rounded-16px bg-white">
          <view
            v-for="(item, idx) in section"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3 transition-colors active:bg-#f5f5f5"
            :class="idx === section.length - 1 ? '' : 'border-b-1 border-#ededed'"
            @click="tapItem(item)"
          >
            <view class="min-w-0 flex flex-1 flex-col gap-1">
              <text class="truncate text-15px font-600" :class="item.type === 'action' && (item as any).danger ? 'text-#ff4d4f' : 'text-#1f1f1f'">{{ item.title }}</text>
              <text v-if="(item as any).subtitle" class="truncate text-12px text-#9b9b9b">{{ (item as any).subtitle }}</text>
            </view>
            <template v-if="item.type === 'switch'">
              <switch :checked="switchState[(item as any).key]" color="#3aa3ff" @change="onSwitchChange((item as any).key, $event)" />
            </template>
            <template v-else>
              <text v-if="(item as any).rightText" class="text-12px text-#9b9b9b">{{ (item as any).rightText }}</text>
              <text class="text-14px text-#c0c0c0">›</text>
            </template>
          </view>
        </view>

        <view class="pb-90px pt-6 text-center text-11px text-#b0b0b0">
          Telegram 风格设置页（可点击模拟）
        </view>
      </view>
    </scroll-view>
  </view>
</template>
