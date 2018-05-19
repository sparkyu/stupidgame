import Animation from '../base/animation'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'
const SUCC_FRAME_COUNT = 30
const SUCC_FRAME_PREFIX = 'images/succ_'

export default class GameInfo extends Animation {
  constructor(ctx) {
    super(atlas.src, 100, 100)

    this.initSuccAnimation()
  }
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "28px Arial"

    ctx.fillText(
      score.toFixed(3),
      20,
      40
    )
  }

  // 预定义胜利的帧动画
  initSuccAnimation() {
    let frames = []


    for (let i = 0; i < SUCC_FRAME_COUNT; i++) {
      frames.push(SUCC_FRAME_PREFIX + i + '.jpg')
      console.log(SUCC_FRAME_PREFIX + i + '.jpg')
    }

    this.initFrames(frames)
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '耗时：' + score.toFixed(3) + '秒',
      screenWidth / 2 - 80,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 255
    }

    this.initSuccAnimation()

  }
}

