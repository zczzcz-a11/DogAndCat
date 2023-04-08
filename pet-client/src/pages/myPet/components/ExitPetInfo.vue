<template>
  <div class="content_wrap" v-if="show">
    <van-row type="flex" justify="space-between" class="title">
      <van-col class="cancel" @click="cencel">取消</van-col>
      <van-col class="sure" @click="saveInfo">确定</van-col>
    </van-row>
    <van-form>
      <van-cell-group inset>
        <!-- 名字 -->
        <van-field
          v-model="petInfo.petname"
          name="petName"
          label="宠物名"
          placeholder="宠物名"
          :rules="[{ required: true, message: '请填写宠物名' }]"
        />
        <!-- 品种 -->
        <van-field
          v-model="petInfo.petbreed"
          name="petBreed"
          label="宠物品种"
          placeholder="请填写宠物品种，如‘柴犬’，‘金毛’"
          :rules="[{ required: true, message: '请填写宠物品种' }]"
        />
        <!-- 颜色 -->
        <van-field
          v-model="petInfo.petcolor"
          name="petColor"
          label="毛色"
          placeholder="宠物毛色"
          :rules="[{ required: true, message: '请填写宠物毛色' }]"
        />
        <!-- 重量 -->
        <van-field
          v-model="petInfo.petweight"
          name="petWeight"
          label="体重"
          type="number"
          placeholder="体重(kg)"
          :rules="[{ required: true, message: '请输入宠物体重' }]"
        />
        <!-- 年龄 -->
        <van-field name="petAge" label="年龄">
          <template #input>
            <van-stepper v-model="petInfo.petage" />
          </template>
        </van-field>
        <!-- 性别 -->
        <van-field name="petSex" label="性别">
          <template #input>
            <van-radio-group v-model="petInfo.petsex" direction="horizontal">
              <van-radio name="1" checked-color="#8d9f5e">雄</van-radio>
              <van-radio name="2" checked-color="#8d9f5e">雌</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <!-- 种类 -->
        <van-field
          v-model="petInfo.petcategory"
          is-link
          readonly
          name="petCategory"
          label="种类"
          placeholder="点击选择宠物种类"
          @click="showPicker = true"
          :rules="[{ required: true, message: '请选择宠物种类' }]"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker
            :columns="categorys"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>
        <!-- 宠物简介 -->
        <van-field
          name="petMessage"
          v-model="petInfo.petmessage"
          rows="2"
          autosize
          label="简介"
          type="textarea"
          maxlength="100"
          placeholder="关于宠物的信息"
          show-word-limit
          :rules="[{ required: true, message: '请填写宠物简介' }]"
        />
      </van-cell-group>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, onBeforeUpdate } from "vue";
import { userStore } from "@/store/user.js";

export default {
  props: {
    show: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const uStore = userStore(); // 仓库的上下文对象
    const categorys = ["犬", "猫", "鸟", "兔", "鼠", "鱼"];
    const state = reactive({
      petInfo: {}, // 宠物信息
      showPicker: false, // 宠物种类面板的出现
    });

    onMounted(() => {
      state.petInfo = uStore.getPetInfoExit();
    });

    onBeforeUpdate(() => {
      state.petInfo = uStore.getPetInfoExit();
    });

    const cencel = () => {
      // 关闭宠物信息修改界面
      ctx.emit("close", false);
    };

    const onConfirm = (value) => {
      // 宠物种类的确定
      state.petInfo.petcategory = value;
      state.showPicker = false;
      // console.log(state);
    };

    const saveInfo = (value) => {
      // 宠物信息修改
      // 确认修改信息
      ctx.emit("close", false);
      uStore.savePetInfo(state.petInfo);
    };

    // const

    return {
      categorys,
      ...toRefs(state),
      cencel,
      onConfirm,
      saveInfo,
    };
  },
};
</script>

<style lang="less" scoped>
.content_wrap {
  .title {
    padding: 10px 10px;
    .cancel {
      color: #999;
    }
    .sure {
      color: #1989fa;
    }
  }
}
</style>
