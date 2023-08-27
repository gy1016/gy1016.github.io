---
title: Qt配合OpenGL的食用
description: 🐏的软光栅构建第一步：构建Qt和OpenGL的绘制环境。
tags: + OpenGL
categories: + 计算机图形学
---

## 前情提要

`OpenGL` 是一套小而美的规范，它没对不同软硬件的环境进行处理，所以一般开发 `OpenGL` 是使用 `GLFW` + `GLAD` 来进行。

`GLFW` 解决操作系统层面的不同：

* 创建窗口

* 定义上下文

* 处理用户输入

`GLAD` 使得代码可以用于不同的 `OpenGL` 驱动：

* OpenGL 本身只是规范/标准

* 各个厂家具体实现方式可以不用，需要通过函数指针调用显卡的函数，但是显卡驱动具体函数的地址，运行时才知道，所以需要借助 GLAD(如果你很熟悉 Windows 的 API，也可以直接调显卡的指针来使用 OpenGL，而不用借助 GLAD )。

之所以用 `Qt` 是因为其提供了类似于 `GLFW` 的窗体应用和提供类似抹平不同驱动的 `GLAD` 的能力。

`QOpenGLWidget` 对标 `GLFW` ，其提供了三个便捷的虚函数，可以重载，用来实现典型的任务：

* paintGL；渲染场景，widget 需要更新时调用；

* resizeGL：设置 OpenGL 视口、投影等，widget 调整大小(及首次显示)时调用；

* initializeGL：设置 OpenGL 资源和状态，第一次调用 paintGL()/resizeGL()之前调用一次；

注意：

* 如果需要从 `paintGL` 以外的位置触发重新绘制，则应调用 `widget` 的 `update()` 函数来安排更新，典型示例是使用计时器设置场景动画；

* 调用 `paintGL`,  `resizeGL` 或 `initializeGL` 时，`widget` 和 `OpenGL` 呈现上下文将变为当前。如果需要从其他位置调用标准`OpenGL API`函数，则必须首先调用`makeCurrent()`；

* 在`paintGL`以外的地方调用绘制函数，没有意义。绘制图像最终将被`paintGL`覆盖；

`QOpenGLFunctions_x_x_Core` 对标 `GLAD` ，其提供对应版本核心模式的所有功能，是对 `OpenGL` 函数的封装：

* `initializeOpenGLFunctions`: 初始化OpenGL函数，将QT里的函数指针指向显卡的函数。比如：

```cpp
// 如果不执行上面那个函数，那么glClearColor将是一个空指针
glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
```

## 开发环境

* Qt：6.2.4

* Visual Studio 2022

* OpenGL 3.3 core

## 添加控件

在主窗体中拖入 `OpenGL Widget` 后，编译不能通过，需要右键 `项目` → `属性` → `Qt Project Settings` → `Qt Modules` 下面添加 `opengl` 和 `openglwidgets` 两个模块，再次编译即可通过。

在主窗体的 `cpp` 代码中，将我们拖入的控件全屏显示(即设为中心控件)：

```cpp
setCentralWidget(ui->openGLWidget);
```

## 编码控制

右键添加类，我将类命名为 `MyOpenGLWidget` ，基类选择 `QOpenGLWidget` 。这个只是实现了能够绘制的窗口。按照前提所讲，如果想要获取显卡提供的功能函数，那就还需要继承指定版本的 `OpenGLFunction` 。

`MyOpenGLWidget.h` 如下所示：

```cpp
#pragma once
#include <QtOpenGLWidgets/QOpenGLWidget>
#include <QtOpenGL/QOpenGLFunctions_3_3_Core>

class MyOpenGLWidget :
    public QOpenGLWidget, QOpenGLFunctions_3_3_Core
{
public:
    explicit MyOpenGLWidget(QWidget* parent = nullptr);

protected:
    virtual void initializeGL();
    virtual void resizeGL(int w, int h);
    virtual void paintGL();
};

```

`MyOpenGLWidget.cpp` 则是实现了各个虚函数，代码如下所示：

```cpp
#include "MyOpenGLWidget.h"

MyOpenGLWidget::MyOpenGLWidget(QWidget* parent) : QOpenGLWidget(parent) {

}

void MyOpenGLWidget::initializeGL()
{
  // 将Qt里的函数指针指向显卡
	initializeOpenGLFunctions();
}

void MyOpenGLWidget::resizeGL(int w, int h)
{
  // 设定画布大小
	glViewport(0, 0, w, h);
}

void MyOpenGLWidget::paintGL()
{
  // 设置清屏颜色
	glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
  // 使用设定的颜色绘制屏幕，达到清屏的效果
	glClear(GL_COLOR_BUFFER_BIT);
}
```

## 实现效果

![Qt and OpenGL Sample1](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/qt_opengl_sample1.png)

## 后续计划

先实现加载一些 `obj` 的模型，在此过程中构建我的软光栅...

路漫漫其修远兮，不如我们去打的(●'◡'●)...
