<template>
  <router-view v-slot="{ Component }">
    <transition name="scale" mode="out-in">
      <keep-alive>
        <component
          :is="Component"
          v-if="$route.meta.keepAlive && $route.meta.type === 'view'"
        />
      </keep-alive>
    </transition>

    <transition name="scale" mode="out-in">
      <component
        :is="Component"
        v-if="!$route.meta.keepAlive && $route.meta.type === 'view'"
      />
    </transition>

    <transition v-for="item in pageInfo" :key="item" :name="routeType ? item[0] : item[1]" mode="out-in">
      <component
        :is="Component"
        v-if="!$route.meta.keepAlive && $route.meta.type === item[2]"
      />
    </transition>

    <transition name="move" mode="out-in">
      <NavBarVue v-if="$route.meta.type === 'view'" />
    </transition>
  </router-view>
</template>

<script>
import NavBarVue from "@/components/NavBar.vue";
import { userStore } from '@/store/user.js';
import { useRouter } from "vue-router";
import { reactive, toRefs } from "vue";

export default {
  setup(props) {
    const uStore = userStore();
    const router = useRouter();
    const state = reactive({
      routeType: true,
      pageStackLength: 0,  // 记录页面栈的长度
      pushType: true,      // 判断页面是前进还是后退
      pageInfo: [
        ['slide', 'slide', 'page'],
        ['slide', 'scale', 'userSpace'],
        ['scale', 'slide', 'petSpace'],
      ]
    });

    router.beforeEach((to, from, next) => {
      // 由 view页面进入 page页面
      if(to.meta.type === "petSpace" && from.meta.type === "view"){
        state.routeType = false;
        state.pushType = true;
      }else if(to.meta.type === "userSpace" && from.meta.type === "view"){
        state.routeType = true;
        state.pushType = true;
      }
      // 由 page页面进入 page页面
      if ((to.meta.type === "userSpace" && from.meta.type === "petSpace") || (to.meta.type === "petSpace" && from.meta.type === "userSpace")) { 
        state.routeType = state.routeType ? false : true;
        if((uStore.getPageStack().length > state.pageStackLength) !== state.pushType){
          state.routeType = state.routeType ? false : true;
        }
        state.pushType = uStore.getPageStack().length > state.pageStackLength;
      }
      // 由 page页面进入 view页面
      if(to.meta.type === "view" && from.meta.type === "petSpace"){
        state.routeType = false;
      }else if(to.meta.type === "view" && from.meta.type === "userSpace"){
        state.routeType = true;
      }
      next();
    });

    router.afterEach( route => {
      state.pageStackLength = uStore.getPageStack().length;
    });

    return {
      ...toRefs(state),
    };
  },
  components: {
    NavBarVue,
  },
};
</script>

<style lang="less">
// 平移过渡
.move-enter-active,
.move-leave-active {
  position: absolute;
  transition: all .32s ease-out;
}

.move-enter-to,
.move-leave-from {
  bottom: 0;
}

.move-enter-from,
.move-leave-to {
  bottom: -50px;
}

// 缩放过渡
.scale-enter-active,
.scale-leave-active {
  position: absolute;
  transition: all .32s ease-out;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

// 幻灯片过渡
.slide-enter-active,
.slide-leave-active {
  position: absolute;
  transition: all .32s ease-out;
}

.slide-enter-to,
.slide-leave-from {
  right: 0;
  // z-index: 100;
}

.slide-enter-from,
.slide-leave-to {
  right: -100%;
  // z-index: -100;
}
</style>
