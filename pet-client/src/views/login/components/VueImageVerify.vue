<template>
  <div class="img-verify">
    <canvas width="120" height="40" ref="verify" @click="handleDraw"></canvas>
    <p class="text">点击刷新验证码</p>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, defineEmits } from 'vue'

const verify = ref(null)
const state = reactive({
  pool: 'ABDEFGHIJLMNPQRTUY23456789abdefghijmnpqrtuy',
  imgCode: ''
})

// 父子组件传值的事件声明
const emits = defineEmits(['sendImgCode'])
const sendImgCode = code => {
  emits('sendImgCode', code)
}

onMounted(() => {
  handleDraw() // 开始生成验证码
})

// 随机数
const randomNum = (min, max) => parseInt(Math.random() * (max - min) + min)

// 随机生成颜色
const randomColor = (min, max) => {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

// 绘制验证图案
const draw = () => {
  const ctx = verify.value.getContext('2d')
  ctx.fillStyle = randomColor(180, 230)
  ctx.fillRect(0, 0, 120, 40)
  let imgCode = ''

  // 随机产生字符串并进行绘制
  for (let i = 0; i < 4; i++) {
    const text = state.pool[randomNum(0, state.pool.length)]
    imgCode += text
    const fontSize = randomNum(18, 40)
    const deg = randomNum(-30, 30)
    ctx.font = fontSize + 'px Simhei'
    ctx.textBaseline = 'top'
    ctx.fillStyle = randomColor(80, 150)
    ctx.save()
    ctx.translate(30 * i + 15, 15)
    ctx.rotate((deg * Math.PI) / 180)
    ctx.fillText(text, -10, -15)
    ctx.restore()
  }
  // 随机产生5条干扰线,干扰线的颜色要浅一点
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(randomNum(0, 120), randomNum(0, 40))
    ctx.lineTo(randomNum(0, 120), randomNum(0, 40))
    ctx.strokeStyle = randomColor(180, 230)
    ctx.closePath()
    ctx.stroke()
  }
  // 随机产生40个干扰的小点
  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.arc(randomNum(0, 120), randomNum(0, 40), 1, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = randomColor(150, 200)
    ctx.fill()
  }
  return imgCode
}

const handleDraw = () => {
  state.imgCode = draw()
  sendImgCode(state.imgCode) //  向父组件传递验证码
}
</script>

<style lang="less" scoped>
.text {
  font-size: 10px;
  line-height: 10px;
}
</style>
