import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persistedstate' // 数据持久化


const store = createPinia();// 创建store实例
store.use(piniaPersist);

export default store;