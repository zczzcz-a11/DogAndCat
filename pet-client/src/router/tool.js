import { userStore } from '@/store/user.js'
const uStore = userStore()

// 根据url进行页面跳转，编程式路由
export const toRelatedPage = (url, router, time = 300, data = {}) => {
  setTimeout(() => {
    uStore.pageStackPush(url)
    router.push({
      path: url,
      query: { ...data }
    })
  }, time)
}

// 回退上级页面
export const back = (router, time = 0) => {
  setTimeout(() => {
    uStore.pageStackShift()
    router.back()
  }, time)
}
