import Sprite from '../base/sprite'
import Bubble from './bubble'
import DataBus  from '../databus'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 玩家相关常量设置
const BUBBLE_IMG_SRC = 'images/bubble_0.png'
const BUBBLE_X_NUMBER = 6
const BUBBLE_Y_NUMBER = 10
const BUBBLE_X_INTERVAL = 0
const BUBBLE_Y_INTERVAL = 0
const BUBBLE_AREA_WIDTH   = 50
const BUBBLE_AREA_HEIGHT  = 50
//适配各种屏幕
let BLANK_BOTTOM = (screenHeight - BUBBLE_AREA_HEIGHT * BUBBLE_Y_NUMBER) > 100 ? (screenHeight - BUBBLE_AREA_HEIGHT * BUBBLE_Y_NUMBER)/2 : 10
let BLANK_TOP = screenHeight - BUBBLE_AREA_HEIGHT * BUBBLE_Y_NUMBER - BLANK_BOTTOM
let BLANK_LEFT_AND_RIGHT = Math.floor(screenWidth - BUBBLE_AREA_WIDTH * BUBBLE_X_NUMBER)/2

let databus = new DataBus()

export default class Player extends Sprite {
  constructor(ctx) {
    super(BUBBLE_IMG_SRC, BUBBLE_AREA_WIDTH, BUBBLE_AREA_HEIGHT)

   databus.bublles = []

  //在可用区域内均匀分布
   for (let i = 0; i < BUBBLE_X_NUMBER; i++) {
     let x_b = Math.floor(BLANK_LEFT_AND_RIGHT + ((screenWidth - BLANK_LEFT_AND_RIGHT * 2 + BUBBLE_X_INTERVAL) / BUBBLE_X_NUMBER * (i+0.5) - (BUBBLE_AREA_WIDTH + BUBBLE_X_INTERVAL)/2))
    for(let j = 0; j < BUBBLE_Y_NUMBER; j++){
      let b = databus.pool.getItemByClass('bubble', Bubble);
      let y_b = Math.floor(BLANK_TOP + ((screenHeight - BLANK_TOP - BLANK_BOTTOM + BUBBLE_Y_INTERVAL) / BUBBLE_Y_NUMBER * (j+0.5) - (BUBBLE_AREA_HEIGHT + BUBBLE_Y_INTERVAL) / 2))
      b.init(x_b, y_b, 0, 0);
      databus.bubbles.push(b)
      console.log("new bubble", x_b, y_b)
    }
  }



   // 初始化事件监听
   this.initEvent()
   this.render(ctx)
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在气泡上
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(x >= this.x - deviation
      && y >= this.y - deviation
      && x <= this.x + this.width + deviation
      && y <= this.y + this.height + deviation)
  }


  /**
   * 玩家响应手指的触摸事件
   */
  initEvent() {
    console.log('click')
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      
      for (let i = 0; i < databus.bubbles.length; i++) {
        let b = databus.bubbles[i]
        if (b.isCollideWith(x, y)) {
          this.touched = true
          b.click()
          b.playAnimation()
          if(!databus.gameStart){
            databus.gameStart = true;
          }
          break
        }
      }
    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      this.touched = false
    }).bind(this))
  }

  //画所有气泡
  render(ctx){
    databus.bubbles.forEach((b) => {
      b.render(ctx)
    })
  }
}
