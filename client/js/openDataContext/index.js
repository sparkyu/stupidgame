
function drawRankList(score) {
  console.log('draw ', score)
  
  let sharedCanvas = wx.getSharedCanvas()
  let ctx = sharedCanvas.getContext('2d')
  ctx.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height)
  ctx.fillStyle = "#ffffff"
  ctx.font = "15px Arial"
  ctx.fillText(
    '最好成绩：' + score.toString(),
    110,
    40
  )
  //  ctx.fillRect(100, 20, 100, 20)
  
}

let curScore = 0
let openId = null
wx.onMessage(data => {
  console.log("onMessage ",data)
  if(data.text == 'getScore'){
    openId = data.openId

    wx.getUserCloudStorage({
      "keyList": [openId],
      success: res => {
        if(res.KVDataList.length != 0){
          curScore = res.KVDataList[0].value
          console.log("更新本地分数", openId, curScore)
        }
        console.log("获取当前分数", openId, curScore)
        drawRankList(curScore)
      },
      fail:res =>{
        console.log(res)        
      }
    })

  }

  if(data.text == 'updateScore'){
    console.log('new ', data.score, ' cur ', curScore)
    if (curScore == 0 || data.score == 0|| curScore > data.score){

      wx.setUserCloudStorage({
        "KVDataList": [
          { 'key': openId, 'value': data.score.toString()},
          ],
        success: res => {
          curScore = data.score
          console.log(res.errMsg, res)
          wx.getUserCloudStorage({
            "keyList": [openId],
            success: res => {
              console.log('更新后拉取数据',openId, res.KVDataList[0].value)
              drawRankList(curScore)
            },
            fail: res => {
              console.log(res)
            }
          })
        },
        fail: res => {
          console.log(res.errMsg, res, openId, data.score)
        },
      })
    }
  }



    /*
    wx.getUserInfo({
      openIdList: ['selfOpenId'],
      lang: 'zh_CN',
      success: (res) => {
        console.log('success', res.data)
      },
      fail: (res) => {
        reject(res)
      },
    })*/
    
})