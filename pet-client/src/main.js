import {
    createApp
} from 'vue';
import App from '@/App.vue';
import router from '@/router'; // 前端路由
import 'lib-flexible/flexible'; // 移动端适配
import '@/assets/style/reset.css';
import '@/assets/style/custom.less';
import 'vant/es/toast/style';
import 'vant/es/notify/style';
import 'vant/es/dialog/style';
import store from '@/store/index.js'; //  pinia仓库

const app = createApp(App);

app.use(router).use(store).mount('#app');