// 预加载脚本

// 全局方法定义

// 正常来讲必须这么做，但在electron里面没啥意义
// requestAnimationFrame方法兼容性处理
window.requestNextAnimationFrame = (function () {
  let originalWebkitRequestAnimationFrame
  let wrapper
  let callback
  let geckoVersion = 0
  const userAgent = navigator.userAgent
  let index = 0
  const self = this

  // Workaround for Chrome 10 bug where Chrome
  // does not pass the time to the animation function

  if (window.webkitRequestAnimationFrame) {
    // Define the wrapper

    wrapper = function (time) {
      if (time === undefined) {
        time = +new Date()
      }
      self.callback(time)
    }

    // Make the switch

    originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame

    window.webkitRequestAnimationFrame = function (callback, element) {
      self.callback = callback

      // Browser calls the wrapper and wrapper calls the callback

      originalWebkitRequestAnimationFrame(wrapper, element)
    }
  }

  // Workaround for Gecko 2.0, which has a bug in
  // mozRequestAnimationFrame() that restricts animations
  // to 30-40 fps.

  if (window.mozRequestAnimationFrame) {
    // Check the Gecko version. Gecko is used by browsers
    // other than Firefox. Gecko 2.0 corresponds to
    // Firefox 4.0.

    index = userAgent.indexOf('rv:')

    if (userAgent.indexOf('Gecko') !== -1) {
      geckoVersion = userAgent.substr(index + 3, 3)

      if (geckoVersion === '2.0') {
        // Forces the return statement to fall through
        // to the setTimeout() function.

        window.mozRequestAnimationFrame = undefined
      }
    }
  }

  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
      let start, finish

      window.setTimeout(function () {
        start = +new Date()
        callback(start)
        finish = +new Date()

        self.timeout = 1000 / 60 - (finish - start)
      }, self.timeout)
    }
  )
})()

// cancelRequestAnimationFrame方法兼容性处理
window.cancelNextRequestAnimationFrame = window.cancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
