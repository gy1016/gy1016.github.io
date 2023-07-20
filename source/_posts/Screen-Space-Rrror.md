---
title: 屏幕空间误差
description: 介绍屏幕空间误差的概念，计算方式和应用场景。
tags:
  - Cesium
categories:
  - 计算机图形学
---

## 问题

怎样判断一个 `LOD` 绘制结果是否会使场景看起来更好？一个简单的思路就是利用相机到被观察瓦片的距离来判断，这个距离超过指定的阈值时，就渲染下一级的瓦片。我当初写渲染引擎的时候就是这么干的，于是就有了下面这段憨批代码：

```ts
// Camera.ts
get level() {
  // ...
  const i = MathUtil.rayIntersectEllipsoid(
    cameraPos,
    cameraPosSquared,
    normalDir,
    Ellipsoid.Wgs84.oneOverRadiiSquared
  );
​
  const h = i.near;
​
  // TODO: 这个该用视锥体进行数学计算
  // ! It's ugly but useful!
  if (h <= 100) {
    this._level = 19;
  } else if (h <= 300) {
    this._level = 18;
  } else if (h <= 660) {
    this._level = 17;
  } else if (h <= 1300) {
    this._level = 16;
  } else if (h <= 2600) {
    this._level = 15;
  } else if (h <= 6400) {
    this._level = 14;
  } else if (h <= 13200) {
    this._level = 13;
  } else if (h <= 26000) {
    this._level = 12;
  } else if (h <= 67985) {
    this._level = 11;
  } else if (h <= 139780) {
    this._level = 10;
  } else if (h <= 250600) {
    this._level = 9;
  } else if (h <= 380000) {
    this._level = 8;
  } else if (h <= 640000) {
    this._level = 7;
  } else if (h <= 1280000) {
    this._level = 6;
  } else if (h <= 2600000) {
    this._level = 5;
  } else if (h <= 6100000) {
    this._level = 4;
  } else if (h <= 11900000) {
    this._level = 3;
  } else {
    this._level = 2;
  }
  return this._level;
}
```

这段代码虽然丑陋，但是有用(虽然效果不好)。实际上有更好的判断方式，那就是利用屏幕空间误差(ScreenSpaceError, SSE)，下面介绍 `SSE` 的概念，计算方式和使用效果。

## 概念

首先在介绍`SSE`之前，还需要引入一个叫做几何度量误差(Geometric Error, GE)的概念，其可以定义为：计算机图形图像学领域中用来描述计算机绘制的近似几何模型与理想数学模型之间近似程度的一种度量误差。

而`SSE`时几何度量误差在三维渲染管线处理后最终呈现在屏幕上的一种表现形式，下面有一个图（出处参考链接 1）能很好地表明两者之间的关系，我们希望通过多边形绘制一个圆，实际上在不断近似成圆的过程就可以看做是`HLOD`的切换过程：

![GE vs SSE](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/gevssse.png)

## 计算

## 效果

关于`SSE`我们要考虑两种情况，距离变大和距离变小。前者可以考虑用低细节模型替换高细节模型，后者要考虑用高细节模型替换低细节模型。

## 参考链接

- https://blog.csdn.net/u013589768/article/details/118479937

- https://www.cnblogs.com/onsummer/p/13357226.html
