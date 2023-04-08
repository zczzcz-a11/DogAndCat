<template>
  <div class="page">
    <PageHeadVue :name="pageName" />

    <div class="content_wrap">
      <van-form @submit="onSubmit" class="form_box">
        <van-cell-group inset>
          <!-- 图片 -->
          <van-field
            name="petImg"
            label="宠物图片"
            :rules="[{ required: true, message: '请选择宠物图片' }]"
          >
            <template #input>
              <van-uploader
                v-model="petImg"
                :max-count="1"
                :after-read="afterReadImg"
              />
            </template>
          </van-field>
          <!-- 名字 -->
          <van-field
            v-model="petName"
            name="petName"
            label="宠物名"
            placeholder="宠物名"
            :rules="[{ required: true, message: '请填写宠物名' }]"
          />
          <!-- 品种 -->
          <van-field
            v-model="petBreed"
            name="petBreed"
            label="宠物品种"
            placeholder="宠物品种，如‘柴犬’，‘金毛’"
            :rules="[{ required: true, message: '请填写宠物品种' }]"
          />
          <!-- 颜色 -->
          <van-field
            v-model="petColor"
            name="petColor"
            label="毛色"
            placeholder="宠物毛色"
            :rules="[{ required: true, message: '请填写宠物毛色' }]"
          />
          <!-- 重量 -->
          <van-field
            v-model="petWeight"
            name="petWeight"
            label="体重"
            type="number"
            placeholder="体重(kg)"
            :rules="[{ required: true, message: '请输入宠物体重' }]"
          />
          <!-- 年龄 -->
          <van-field name="petAge" label="年龄">
            <template #input>
              <van-stepper v-model="age" />
            </template>
          </van-field>
          <!-- 性别 -->
          <van-field name="petSex" label="性别">
            <template #input>
              <van-radio-group v-model="genderState" direction="horizontal">
                <van-radio name="1" checked-color="#8d9f5e">雄</van-radio>
                <van-radio name="2" checked-color="#8d9f5e">雌</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <!-- 种类 -->
          <van-field
            v-model="petCategory"
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
            v-model="petMessage"
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

        <div class="addBtn">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            color="#8d9f5e"
          >
            添加宠物
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { addUserPet, uploadInfo } from "@/axios/index.js";
import { uploadfile, dataURItoBlob } from "@/utils/baseImg.js";
import PageHeadVue from "@/components/PageHead.vue";
import { userStore } from "@/store/user.js";

export default {
  setup(props) {
    const router = useRouter();
    const uStore = userStore();
    const categorys = ["犬", "猫", "鸟", "兔", "鼠", "鱼"];
    const state = reactive({
      pageName: "添加宠物",
      age: 1,
      petImg: [],
      petName: "",
      petWeight: "",
      petColor: "",
      petBreed: "",
      genderState: "1",
      showPicker: false, // 宠物种类面板的出现
      petCategory: "",
      petMessage: "",
      petImgUrl: "",
    });

    const onConfirm = (value) => {
      // 宠物种类的确定
      state.petCategory = value;
      state.showPicker = false;
      // console.log(state);
    };

    const onSubmit = (value) => {
      // 宠物信息提交
      addUserPet({
        petname: state.petName,
        petbreed: state.petBreed,
        petage: state.age,
        petweight: state.petWeight,
        petcolor: state.petColor,
        petsex: state.genderState,
        petcategory: state.petCategory,
        petmessage: state.petMessage,
        petimg: state.petImgUrl,
      })
        .then((res) => {
          Toast.success(res.mess);
          uStore.getPetInfoSync();
          router.back();
        })
        .catch((err) => {
          Toast.fail(err.mess);
        });
    };

    const afterReadImg = (file) => {
      uploadInfo().then(res => {
        let url = dataURItoBlob(file.content);
        uploadfile(res.data, url).then(res => {
          state.petImgUrl = res;
        })
      })
    };

    return {
      categorys,
      ...toRefs(state),
      onConfirm,
      onSubmit,
      afterReadImg,
    };
  },
  components: {
    PageHeadVue,
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: @primary;
  .content_wrap {
    width: 100%;
    height: calc(100% - 1.6rem);
    background-color: #fff;
    border-radius: 32px 32px 0 0;
    border-top: 4px solid #683931;
    padding: 40px 0px;
    box-sizing: border-box;
    .form_box {
      height: 100%;
      .addBtn {
        width: 90%;
        margin: 0 auto;
        margin-top: 0.5rem;
      }
    }
  }
}
</style>
