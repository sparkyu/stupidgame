import Animation from '../base/animation'
import DataBus from '../databus'
import Music from '../runtime/music'

const BUBBLE_IMG_SRC = 'images/bubble_0.png'
const BUBBLE_WIDTH = 50
const BUBBLE_HEIGHT = 50
const EXPLO_IMG_PREFIX = 'images/bubble_'
const EXPLO_FRAME_COUNT = 5


let databus = new DataBus()

export default class Bubble extends Animation {
  constructor(ctx) {
    super(BUBBLE_IMG_SRC, BUBBLE_WIDTH, BUBBLE_HEIGHT)

    this.initExplosionAnimation()
  }

  init(x, y, state,broken) {
    this.x = x
    this.y = y

    this.state = state
    this.broken = broken

    this.visible = true
//    console.log('b: ' + this.x + ', ' + this.y + ' ; ' + this.state + ' , ' + this.broken)
  }

  // 预定义气泡破碎的帧动画
  initExplosionAnimation() {
    let frames = []


    for (let i = 1; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  //改变气泡状态
  click() {
    this.img.src = EXPLO_IMG_PREFIX + Math.floor(Math.random() * EXPLO_FRAME_COUNT + 1) + '.png'
    this.state = 1
//    console.log('click ' + this.x + ', ' + this.y + ' ; ' + this.state + ' , ' + this.broken + '  ' + this.img.src)
  }

  //画气泡
  render(ctx) {
      ctx.drawImage(
        this.img,
        this.x,
        this.y,
        BUBBLE_WIDTH,
        BUBBLE_HEIGHT
      )
  }
}
