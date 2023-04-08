<template>
    <van-tabbar v-model="active" active-color="#fff" inactive-color="#bdc5a7" class="nav">
        <van-tabbar-item to="/home" name="/home" icon="wap-home-o">首页</van-tabbar-item>
        <van-tabbar-item to="/fond" name="/fond" icon="like-o">喜爱</van-tabbar-item>
        <van-tabbar-item to="/comment" name="/comment" icon="comment-o">消息</van-tabbar-item>
        <van-tabbar-item to="/user" name="/user" icon="contact">我的</van-tabbar-item>
        <div class="unradnum_wrap" v-show="unreadnum.num !== 0">
          <span>{{unreadnum.num}}</span>
        </div>
    </van-tabbar>
</template>

<script>
import { ref, onMounted, reactive, toRefs } from 'vue'; 
import { useRouter } from 'vue-router';
import { userStore } from "@/store/user.js";

export default {
  setup() {
    const uStore = userStore();
    const router = useRouter()
    const active = ref('/home');
    const state = reactive({
      unreadnum: null
    });

    state.unreadnum = uStore.getUnreadSum();

    onMounted(()=> {
      active.value = location.pathname === '/' ? '/home' : location.pathname;
    })

    return {
      ...toRefs(state),
      active 
    };
  },

};

</script>

<style lang="less" scoped>
.nav{
  background-color: @primary;
  // position: relative;
  .van-tabbar-item--active{
    background-color: @select;
  }
  .unradnum_wrap{
    position: absolute;
    top: 4px; 
    right: 32%;
    width: .4rem;
    height: .4rem;
    background-color: #ff5e5e;
    border-radius: 50%;
    text-align: center;
    &>span{
      color: #fff;
      font-size: .3rem;
      line-height: .4rem;
    }
  }
}
</style>