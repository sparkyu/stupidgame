let instance

const BOOM_AUDIO_COUNT = 7

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/bgm.m4a'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/0.m4a'

    this.overAudio  = new Audio()
    this.overAudio.src = 'audio/over.wav'

 //   this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playExplosion() {
    this.boomAudio.src = 'audio/' + Math.floor(Math.random() * BOOM_AUDIO_COUNT) + '.m4a'
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }

  playOver() {
    this.overAudio.play()
  }

}
