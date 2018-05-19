import Player from './player/index'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
//var WXBizDataCrypt = require('./WXBizDataCrypt')

const APPID = 'wxe2d357e8861a9aa1'

let ctx = canvas.getContext('2d')
let databus = new DataBus()
var network = require('./runtime/network.js')

function drawShareCanvas(){

    let openDataContext = wx.getOpenDataContext()
    let sharedCanvas = openDataContext.canvas

    let context = canvas.getContext('2d')
    context.drawImage(sharedCanvas, 0, 0)
    
}
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {

    wx.onShareAppMessage(function () {
      // 用户点击了“转发”按钮
      return {
        title: '瞧我这手速！谁敢比我快？',
        imageUrl: canvas.toTempFilePathSync({
          destWidth: 230,
          destHeight: 420
      })
      }
    })

    wx.showShareMenu()

    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }


  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

//    this.getBestScore()

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    
    drawShareCanvas()
  }

  // 全局检测
  collisionDetection() {
    let that = this
    let numberUnClicked = 0
    databus.bubbles.forEach((b) => {
      if (b.state == 1 && b.broken == 0) {
          b.broken = 1
          b.playAnimation()
          that.music.playExplosion()
      }
      numberUnClicked += b.state==0?1:0;
    })
    if (numberUnClicked == 0) {
      databus.gameOver = true
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)
    this.player.render(ctx)
    
    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })
    this.gameinfo.renderGameScore(ctx, databus.score)

    drawShareCanvas()

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      if (!databus.scoreUpdated){
        network.updateScore(databus.score)
        databus.scoreUpdated = true
      }
      this.gameinfo.renderGameOver(ctx, databus.score)

      databus.animations.forEach((ani) => {
        if (ani.isPlaying) {
          ani.aniRender(ctx)
        }
      })
      if (!this.hasEventBind) {
        this.music.playOver()
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    if (databus.gameStart){
      if(databus.time == 0){
        databus.time = new Date().getTime();
      }
      let t = new Date().getTime()
      databus.score = (t - databus.time)/1000
    }

    this.bg.update()

    this.collisionDetection()
  
  }


  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

}
