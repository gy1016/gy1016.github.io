---
title: 【拾取专栏】：(一)颜色拾取
description: 通过颜色拾取来获取到场景中的实体；
tags:
  + 拾取专栏
categories:
  + 计算机图形学
---

根据场景中交互最小单元的不同，我们可以选择不同的拾取方式，来获取最小单元的信息。如果只想知道场景中的交互最小单元是实体，那么使用颜色拾取来获取实体的信息最合适不过了。

## 原理

先不问为什么，直接来看怎么做(很多事情本身就没道理，可能用的用的就明白为什么了)！！！

我们先来看一个渲染帧，这帧里面有3种类别、共5个几何体，且每个几何体有独一无二的 `id` ，如下图所示：

![Render Frame](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/color_pick_render_frame.png)

我们再来看一个颜色拾取帧，这帧和渲染帧基本保持一致，除了将每个几何体的颜色都刷成了场景中 `独一无二` 的颜色值，如下图所示：

![Color Frame](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/color_pick_color_frame.png)

看完这两中不同的帧后，我们再来补充一个信息，WebGL可以读取屏幕上某个像素的值：

> gl.readPixels(x, y, width, height, format, type, pixelColor); 

现在有感觉了吗？还没有？那再看看这个：

> id <==> pixelColor

现在你一定明白了吧，就是这么简单粗暴。其实到这里颜色拾取的原理就已经讲完了，想要编码实现的话还需要考虑一些细节和优化，但我现在的原则就是掌握原理就行了，实现这种东西就不细看了(才怪)。

## 疑惑

### 实体标识和颜色的互转

在颜色拾取帧中，实体原本的纹理都被去掉了，每个实体都用独一无二的颜色进行**刷漆**，当时我就想：这颜色不会重了吧，后面了解了一下，显然是我多虑了。如果采用四通道的纹理颜色，每个通道容量为 `8bit` 即有256个值，那么就共有2<sup>32</sup>个值可取，显然不会重复👨。

那么接下来，我们就看一下如何把实体的id分解为四通道的颜色值：

```js
// 0xFF = 15 * 16^1 + 15 * 16^0 = 255
// id右移0位，最后八位和255按位与，最后除以255，确保值在0-1之间
r = ((id >> 0) & 0xFF) / 0xFF;
// id右移8位，最后八位和255按位与，最后除以255，确保值在0-1之间
g = ((id >> 8) & 0xFF) / 0xFF;
// id右移16位，最后八位和255按位与，最后除以255，确保值在0-1之间
b = ((id >> 16) & 0xFF) / 0xFF;
// id右移24位，最后八位和255按位与，最后除以255，确保值在0-1之间
a = ((id >> 24) & 0xFF) / 0xFF;
```

上面的代码将实体的 `id` 转为了四通道的颜色值，当我们使用 `gl.readPixels` 得到对应像素值后，仅需要进行对应位的左移，就可以把颜色转为实体的 `id` ，转换公式如下所示：

```js
const data = new Uint8Array(4);
gl.readPixels(x, y, width, height, format, type, data);
const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
```

### 何必绘制整张颜色拾取帧

没必要把整个场景的颜色拾取帧都会指出来，我们只需要绘制鼠标点击初那1像素对应的帧就可以。

(●ˇ∀ˇ●) 占位符...

## 参考文章

* [WebGL-Fundamentals](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-picking.html)

* [WebGL编程指南中立方体面的拾取](https://github.com/liujingjie/WebGLexamples/blob/master/ch10/Picking.html)
