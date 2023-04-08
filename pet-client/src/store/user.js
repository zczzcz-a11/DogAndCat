import { defineStore } from 'pinia'
import { Toast } from 'vant'
import { login, userPetList, updataPet, userInfo, updataUser, deletePet, userChatRecord, userFond, setFondCollect, getFondCollect, updataUnreadNum, deleteChatList, deleteRecord } from '@/axios/index.js'
import io from 'socket.io-client'
import config from '@/axios/config.js'

const defaultState = {
  userInfo: {
    // 我的信息
    id: '',
    name: '',
    sign: '',
    userImg: ''
  },
  isLogin: false, // 记录登录状态
  socket: [], // websocket实例
  chatInfo: {
    // 聊天对象的信息
    id: '',
    name: '',
    userImg: '',
    islogin: false,
    listId: ''
  },
  chatList: [], // 聊天对象列表
  unreadObj: {
    // 未读消息总数
    num: 0
  },
  chatMessageList: [], // 聊天对象记录
  userPet: [], // 用户的宠物信息
  userCollect: [], // 用户收藏的宠物信息
  exitPetIndex: 0, // 被修改宠物的index

  pageStack: [] // 全局页面栈
}

export const userStore = defineStore({
  id: 'user', // 命名，唯一
  state: () => {
    return defaultState
  },
  actions: {
    // 聊天信息操作
    socketConnect() {
      console.log('开始建立连接！')
      this.socket = io(config.socketUrl)
      this.socket.on('connect', () => {
        console.log(this.socket.id, '监听客户端连接成功-connect')
      })
      this.socket.emit('login', { id: this.getUserId() }, res => {
        if (!res) console.log('重复登录！')
      })
      // 监听广播信息
      this.socket.on('message', data => {
        this.chatList.forEach(item => {
          if (item.userId === data.id) {
            item.islogin = data.islogin
          }
        })
      })
      // 监听聊天对象发送过来的信息
      this.socket.on('updateChatMessageList', data => {
        this.chatMessageList.push(data)
        this.chatList.forEach(item => {
          if (data.chatlistid === item.id) {
            item.newMsg = data.msg
            item.time = data.mtime
            item.unreadNum += 1
            this.unreadObj.num += 1
          }
        })

        let result = this.chatList.some(item => {
          return data.chatlistid === item.id
        })

        if (!result) this.getChatListSync()
      })
    },
    socketDisconnect() {
      console.log('断开连接！')
      this.socket.disconnect()
    },
    getChatListSync() {
      return new Promise((resolve, reject) => {
        this.socket.emit('chatList', { id: this.getUserId() }, res => {
          if (res) {
            this.chatList = res
            this.setUnreadSum()
            resolve(true)
          }
        })
      })
    },
    setChatInfo(data) {
      const { listId, chatId, chatName, chatImg } = data
      this.chatInfo.id = chatId
      this.chatInfo.name = chatName
      this.chatInfo.userImg = chatImg

      return new Promise((resolve, reject) => {
        userChatRecord({ listId, chatId }).then(res => {
          this.chatInfo.listId = res.data.listid
          // resolve(res.data.list);
          res.data.list.forEach(item => {
            if (item.receiverid === chatId) {
              item.sender = this.userInfo.name
              item.receiver = chatName
              item.senderimg = this.userInfo.userImg
            } else if (item.receiverid === this.userInfo.id) {
              item.sender = chatName
              item.receiver = this.userInfo.name
              item.senderimg = chatImg
            }
          })
          this.chatMessageList = res.data.list
          resolve(true)
        })
      })
    },
    setChatMessageList(data) {
      const recoedItem = data
      this.socket.emit('privateChat', recoedItem, res => {
        if (res.code !== 200) {
          Toast.fail(res.mess)
        } else {
          recoedItem.chatrecordid = res.data
          this.chatMessageList.push(recoedItem)
        }
      })
    },
    getChatMessageList() {
      return this.chatMessageList
    },

    setChatListSync(id) {
      deleteChatList({ id }).then(res => {
        let index = this.chatList.findIndex(item => item.id === id)
        if (index !== -1) this.chatList.splice(index, 1)
        this.setUnreadSum()
      })
    },
    getChatList() {
      return this.chatList
    },

    getChatInfoListId() {
      return this.chatInfo.listId
    },
    getChatInfoName() {
      return this.chatInfo.name
    },
    getChatInfoId() {
      return this.chatInfo.id
    },
    setChatListUnreadNew() {
      updataUnreadNum({ listid: this.chatInfo.listId, userid: this.userInfo.id })
    },

    setUnreadSum() {
      this.unreadObj.num = 0
      this.chatList.forEach(item => {
        if (item.userId === this.chatInfo.id) {
          item.unreadNum = 0
        }
        this.unreadObj.num += item.unreadNum
      })
    },
    getUnreadSum() {
      return this.unreadObj
    },

    deleteRecordSync(id) {
      deleteRecord({ id }).then(res => {
        let index = this.chatMessageList.findIndex(item => item.chatrecordid === id)
        if (index !== -1) this.chatMessageList.splice(index, 1)
      })
    },

    // 全局页面栈操作
    pageStackPush(item) {
      this.pageStack.push(item)
    },
    pageStackShift() {
      this.pageStack.shift()
    },
    getPageStack() {
      return this.pageStack
    },

    // 用户信息操作
    setUserName(name) {
      this.userInfo.name = name
    },
    setUserImg(userImg) {
      this.userInfo.userImg = userImg
    },

    getUserId() {
      return this.userInfo.id
    },
    getUserName() {
      return this.userInfo.name
    },
    getUserImg() {
      return this.userInfo.userImg
    },
    getUserSign() {
      return this.userInfo.sign
    },
    getUserInfo() {
      return this.userInfo
    },

    setUserInfoSync(data) {
      return new Promise((resolve, reject) => {
        updataUser(data).then(res => {
          Toast.success(res.mess)
          this.userInfo = { id: this.userInfo.id, ...data }
          resolve()
        })
      })
    },
    getUserInfoSync() {
      userInfo().then(res => {
        this.userInfo = { ...res.data }
      })
    },
    loginByUserNameSync(username, password) {
      return new Promise((resolve, reject) => {
        login({ username, password }).then(res => {
          const { token, ...userInfo } = res.data
          this.userInfo = userInfo
          localStorage.setItem('token', res.data.token)
          resolve(res.mess)
        })
      })
    },

    // 宠物信息操作
    getPetInfo() {
      return this.userPet
    },
    getPetInfoExit() {
      return JSON.parse(JSON.stringify(this.userPet[this.exitPetIndex]))
    },
    setExitIndex(index) {
      this.exitPetIndex = index
    },
    savePetInfo(item) {
      this.userPet[this.exitPetIndex] = JSON.parse(JSON.stringify(item))
      updataPet({ data: { ...item } }).then(res => {
        Toast.success(res.mess)
      })
    },
    getPetInfoSync() {
      userPetList().then(res => {
        this.userPet = [...res.data]
      })
    },
    deletePetInfo(index) {
      let petid = this.userPet[index].petid
      deletePet({ petid }).then(res => {
        this.userPet.splice(index, 1)
        Toast.success(res.mess)
      })
    },

    // 喜爱宠物信息操作
    getFondInfo() {
      return this.userCollect
    },
    getFondInfoSync() {
      return new Promise((resolve, reject) => {
        userFond().then(res => {
          res.data.forEach(item => {
            item.collect = true
          })
          this.userCollect = [...res.data]
          resolve()
        })
      })
    },
    getCollectByPetId(id) {
      return new Promise((resolve, reject) => {
        getFondCollect({ id }).then(res => {
          resolve(res.data)
        })
      })
    },
    setFondCollectSync(id) {
      return new Promise((resolve, reject) => {
        setFondCollect({ id }).then(res => {
          resolve(res.data)
        })
      })
    },
    setUserCollect(petid) {
      let index = this.userCollect.findIndex(item => item.petid === petid)
      if (index != -1) {
        this.userCollect.splice(index, 1)
        this.setFondCollectSync(petid)
      }
    },

    // 退出登录，做数据清理
    emptyState() {
      window.localStorage.clear()
      location.reload()
    }
  },
  persist: {
    // 开启数据缓存
    enabled: true
  }
})
