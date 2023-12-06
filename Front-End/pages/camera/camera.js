// pages/camera/camera.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.ctx = wx.createCameraContext()
    
  },
  choosePhoto: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: ret => {
        wx.getImageInfo({
          src: ret.tempFilePaths[0],
          success: (ress) => {
            console.log(ress)
            let date = util.formatTime(new Date());
            let ctx = wx.createCanvasContext('firstCanvas')
            let textToWidth = 20
            let textToHeight = 20
            that.setData({
              canvasHeight: ress.height/3 ,
              canvasWidth: ress.width/3
            })
            wx.getLocation({
              type: 'wgs84',
              success(res){
                const latitude = res.latitude
                const longitude = res.longitude
                ctx.drawImage(ret.tempFilePaths[0],0,0,ress.width/3,ress.height/3)
                ctx.setFontSize(14)
                ctx.setFillStyle('blue')
                ctx.fillText(date, textToWidth, textToHeight)
                ctx.fillText(latitude, 20, 50)
                ctx.fillText(longitude, 20, 70)
                ctx.draw(false, () => {
                  setTimeout(()=>{
                    wx.canvasToTempFilePath({
                      canvasId:'firstCanvas',
                      success: (res)=>{
                        console.log(res)
                        that.setData({
                          backgroundimage: res.tempFilePath,
                          shuiyinPaths: res.tempFilePath
                        })
                      }
                    })
                  },500)
                })
              }
            })
          }
        })

        var filePath = ret.tempFilePaths[0]
        that.setData({
          modelData: {
            src1: filePath
          }
        })
        console.log(filePath)

        wx.uploadFile({
          url: 'http://127.0.0.1:8888/login', 
          filePath: filePath,
          name: 'file',
          formData: {
            token: '5A7bnDQKWOjE1VnLy6ryCgSQADcDrYW3'
          },
          success (res) {
            console.log(res.data)
            that.setData({
              list: res.data
            })
          }
        })
      },   
    })
  },
  takePhoto() {
    var that = this;
    this.ctx.takePhoto({
      quality: 'high',
      success: ret => {
        var filePath = ret.tempImagePath;
        that.setData({
          modelData: {
            src1: filePath
          }
        })
        console.log(filePath)
        wx.getImageInfo({
          src: ret.tempImagePath,
          success: (ress) => {
            let date = util.formatTime(new Date());
            let ctx = wx.createCanvasContext('firstCanvas')
            let textToWidth = 20
            let textToHeight = 20
            that.setData({
              canvasHeight: ress.height ,
              canvasWidth: ress.width
            })
            wx.getLocation({
              type: 'wgs84',
              success(res){
                const latitude = res.latitude
                const longitude = res.longitude
                ctx.drawImage(ret.tempImagePath,0,0,ress.width,ress.height)
                ctx.setFontSize(14)
                ctx.setFillStyle('blue')
                ctx.fillText(date, textToWidth, textToHeight)
                ctx.fillText(latitude, 20, 50)
                ctx.fillText(longitude, 20, 70)
                ctx.draw(false, () => {
                  setTimeout(()=>{
                    wx.canvasToTempFilePath({
                      canvasId:'firstCanvas',
                      success: (res)=>{
                        that.setData({
                          backgroundimage: res.tempFilePath,
                          shuiyinPaths: res.tempFilePath
                        })
                      }
                    })
                  },500)
                })
              }
            })
          }
        })

        wx.uploadFile({
          url: 'http://127.0.0.1:8888/login', 
          filePath: filePath,
          name: 'file',
          formData: {
            token: '5A7bnDQKWOjE1VnLy6ryCgSQADcDrYW3'
          },
          success (res) {
            console.log(res.data)
            that.setData({
              list: res.data
            })
          }
        })
      }
    })
  },


  error(e) {
    console.log(e.detail)
  }
})