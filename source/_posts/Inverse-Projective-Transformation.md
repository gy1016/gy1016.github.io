---
title: 【拾取专栏】：(二)投影逆变换【草稿状态】
description: 将屏幕坐标反投影回到笛卡尔世界坐标；
tags:
  + 拾取专栏
categories:
  + 计算机图形学
---

## 前言

最近开发的时候，频繁的遇见一个操作：得到鼠标当前屏幕坐标所在点对应的世界坐标。虽然知道进行投影逆变换就可以得到，但是从来没有实操过，借着无聊的周末来实践一下。

## 坐标系介绍

### 局部坐标系

也称为本地坐标系，模型根据自身建立的坐标系；

### 世界坐标系

场景的绝对坐标系，所有点的坐标都是以该坐标系的原点来确定各自的位置的；

### 视图坐标系

从摄像头位置来观察整个3D场景，也可以称之为观察者的本地坐标系。

### 裁剪坐标系

经过投影变换后得到的视锥体坐标系；

### NDC坐标系

规范化设备坐标系，将xyz都限制在[-1, 1]；

### 屏幕坐标系

根据视口将场景渲染在屏幕当中；

![计算机图形学中涉及到的坐标系](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/computer-graphics-coordinate-system.png)

## 坐标转换

MVP矩阵的转换如下图所示：

![MVP矩阵](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/mvp_matrix.png)

也就是说经过顶点着色器以后得到的是裁剪坐标系下的坐标，之后会进行透视除法和视口变换得到屏幕坐标。但这两步一般是设备帮我们做的，如果想要根据这两种坐标进行逻辑判断，则需要我们去进行模式，对应的转换公式如下图所示：

![透视除法和视口变换](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/perspective_division_and_viewport_transformation.png)

## 代码模拟

```c++
#include <iostream>
#include <Eigen/Core>
#include <Eigen/Dense>

#define MY_PI 3.1415926
#define TWO_PI (2.0 * MY_PI)
inline double DEG2RAD(double deg) { return deg * MY_PI / 180; }

Eigen:: Matrix4f get_view_matrix(Eigen:: Vector3f eye_pos)
{
  Eigen:: Matrix4f view = Eigen:: Matrix4f:: Identity(); 

  Eigen:: Matrix4f translate; 
  translate << 1, 0, 0, -eye_pos[0], 

      0, 1, 0, -eye_pos[1],
      0, 0, 1, -eye_pos[2],
      0, 0, 0, 1;

  view = view * translate; 

  return view; 
}

Eigen:: Matrix4f get_model_matrix(float angle)
{
  Eigen:: Matrix4f rotation; 
  angle = angle * MY_PI / 180.f; 
  rotation << cos(angle), 0, sin(angle), 0, 

      0, 1, 0, 0,
      -sin(angle), 0, cos(angle), 0,
      0, 0, 0, 1;

  Eigen:: Matrix4f scale; 
  scale << 1, 0, 0, 0, 

      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1;

  Eigen:: Matrix4f translate; 
  translate << 1, 0, 0, 0, 

      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1;

  return translate * rotation * scale; 
}

Eigen:: Matrix4f get_projection_matrix(float eye_fov, float aspect_ratio, float zNear, float zFar)
{
  Eigen:: Matrix4f projection; 
  float top = tan(DEG2RAD(eye_fov / 2.0f)) * abs(zNear); 
  float right = top * aspect_ratio; 

  projection << zNear / right, 0, 0, 0, 

      0, zNear / top, 0, 0,
      0, 0, (zNear + zFar) / (zNear - zFar), (2 * zNear * zFar) / (zNear - zFar),
      0, 0, -1, 0;

  return projection; 
}

Eigen:: Matrix4f get_viewport_matrix(float width, float height)
{
  Eigen:: Matrix4f viewport; 
  float half_width = width / 2.0; 
  float half_height = height / 2.0; 

  viewport << half_width, 0, 0, half_width, 

      0, half_height, 0, half_height,
      0, 0, 1, 0,
      0, 0, 0, 1;

  return viewport; 
}

int main()
{
  Eigen:: Vector3f eye_pos = {0, 0, 10}; 
  Eigen:: Vector4f p = {0, 0, 2, 1}; 

  // Eigen:: Matrix4f model = get_model_matrix(0); 
  Eigen:: Matrix4f view = get_view_matrix(eye_pos); 
  std::cout << "view: \n"

            << view << std::endl;

  Eigen:: Matrix4f projection = get_projection_matrix(45.0, 1920.0 / 1080, 1, 50); 
  std::cout << "projection: \n"

            << projection << std::endl;

  Eigen:: Matrix4f viewport = get_viewport_matrix(1920.0, 1080); 
  std::cout << "viewport: \n"

            << viewport << std::endl;

  Eigen:: Vector4f ndc = projection * view * p; 
  ndc = ndc / ndc[3]; 
  std::cout << "ndc: \n"

            << ndc << std::endl;

  Eigen:: Vector4f screen = viewport * ndc; 
  std::cout << "screen: \n"

            << screen << std::endl;

  return 0; 
}
```

## 后记

我不断调整点位的时候，发现很多有趣的现象，真的是实践出真知，猛地一刹那，才明白书里的那一句话是什么意思...

为什么我的眼里常含泪水，因为我噂嘟🐏了... 

周日8. 就睡了，不然就可以整合一下出个好看一的草稿(不🐏也写不完，好多实践没做)...
