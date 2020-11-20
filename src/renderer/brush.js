const Sprite = require('./sprite')
const config = require('../../config')
class Brush {
  constructor(spriteList = [new Sprite()]) {
    this.spriteList = spriteList
  }

  // TODO：初始化
  init(dataPath = '') {

  }

  // 更新
  update() {
    for (const sprite of this.spriteList) {
      if (sprite && sprite.isValid && sprite.isAction) {
        sprite.action()
      }
    }
  }

  // 渲染
  render(ctx) {
    for (const sprite of this.spriteList) {
      if (sprite && sprite.isValid && sprite.isVisible) {
        sprite.draw(ctx)
      }
    }
  }

  // 添加sprite 会按照rank属性自动找位置插入
  add(sprite = new Sprite()) {
    if (this.spriteList.length === 0) {
      this.spriteList.push(sprite)
    } else {
      if (!config.isDev) {
        for (let i = 0; i < this.spriteList.length; i++) {
          if (this.spriteList[i].name === sprite.name) {
            throw new Error('添加sprite失败，已存在相同name的sprite')
          }
        }
      }
      for (let i = 0; i < this.spriteList.length; i++) {
        if (sprite.rank < this.spriteList[i].rank) {
          this.spriteList.splice(i - 1, 0, sprite)
          break
        }
      }
    }
    // this.spriteList.push(sprite)
    // this.spriteList.sort((a, b) => a.rank - b.rank)
  }

  // 清除无效的sprite
  clear() {
    this.spriteList = this.spriteList.filter(sprite => sprite.isValid)
  }
}

module.exports = Brush
