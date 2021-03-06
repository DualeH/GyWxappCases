var util = require('../../../util/util.js')
var playTimeInterval,interval

Page({
  data: {
    recording: false,
    playing: false,
    hasRecord: false,
    recordTime: 0,
    playTime: 0,
    formatedRecordTime: '00:00:00',
    formatedPlayTime: '00:00:00'
  },
  startRecord: function () {
    this.setData({ recording: true })

    var that = this
    interval = setInterval(function () {
      that.data.recordTime += 1
      that.setData({
        formatedRecordTime: util.formatTime(that.data.recordTime)
      })
    }, 1000)
    wx.startRecord({
      success: function (res) {
        that.setData({
          hasRecord: true,
          tempFilePath: res.tempFilePath,
          formatedPlayTime: util.formatTime(that.data.playTime)
        })
      },
      complete: function () {
        that.setData({ recording: false })
        clearInterval(interval)
      }
    })
  },
  stopRecord: function () {
    wx.stopRecord()
    this.setData({recording:false,recordTime:0,formatedRecordTime: '00:00:00'})
    clearInterval(interval)
  },
  playVoice: function () {
    var that = this
    playTimeInterval = setInterval(function () {
      that.data.playTime += 1
      that.setData({
        playing: true,
        formatedPlayTime: util.formatTime(that.data.playTime)
      })
    }, 1000)
    wx.playVoice({
      filePath: this.data.tempFilePath,
      success: function () {
        clearInterval(playTimeInterval)
        that.data.playTime = 0
        that.setData({
          playing: false,
          formatedPlayTime: util.formatTime(that.data.playTime)
        })
      }
    })
  },
  pauseVoice: function () {
    clearInterval(playTimeInterval)
    wx.pauseVoice()
    this.setData({
      playing: false
    })
  },
  stopVoice: function () {
    clearInterval(playTimeInterval)
    this.data.playTime = 0
    this.setData({
      playing: false,
      formatedPlayTime: util.formatTime(this.data.playTime)
    })
    wx.stopVoice()
  },
  clear: function () {
    this.data.recordTime = 0
    this.data.playTime = 0
    this.setData({
      hasRecord: false,
      tempFilePath: '',
      formatedRecordTime: util.formatTime(0)
    })
  },
  onUnload:function(){
    this.stopRecord()
    console.log("voice page has been unloaded!")
  }
})
