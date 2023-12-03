---
title: 【拾取专栏】：(二)投影逆变换
description: 将屏幕坐标反投影回到笛卡尔世界坐标；
tags:
  + 拾取专栏
categories:
  + 计算机图形学
---

## 前言

最近开发的时候，频繁的遇见一个操作：得到鼠标当前屏幕坐标所在点对应的世界坐标。虽然知道进行投影逆变换就可以得到，但是从来没有实操过，借着无聊的周末来实践一下。

## 坐标系介绍

计算机图形学的坐标系噂嘟多，再加上GIS的坐标系，那噂嘟没完没了了。这波先理清楚渲染管线种最常见的6种坐标系，下图能够很好的展示前3种坐标：

![计算机图形学中涉及到的坐标系](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/computer-graphics-coordinate-system.png)

下面这6种坐标系的简单介绍(麻虽小):

### 1. 局部坐标系

也称为本地坐标系，模型根据自身建立的坐标系；

### 2. 世界坐标系

场景的绝对坐标系，所有点的坐标都是以该坐标系的原点来确定各自的位置的；

### 3. 视图坐标系

从相机的位置来观察整个3D场景，也可以称之为观察者的本地坐标系。

### 4. 裁剪坐标系

经过投影变换后得到的视锥体坐标系，也就是说渲染管线走完顶点着色器之后得到的是裁剪坐标系；

### 5. NDC坐标系

规范化设备坐标系，将xyz都限制在[-1, 1]；

### 6. 屏幕坐标系

根据视口大小将场景渲染在屏幕当中；

## 坐标转换

下面理一下这几种坐标系的转换方式，这些转换都是可逆的(说明矩阵一定满秩，其实我一直好奇怎么确保一定是满秩)，也就是说我可以根据模型的局部坐标得到屏幕坐标，亦可以从模型的屏幕坐标得到它的局部坐标；

从局部坐标到裁剪坐标放在一起看，且对应的转换矩阵公式也不列出来了，因为列出来我也不一定能讲清楚😶‍🌫️，且GAMES101对模型矩阵、视图矩阵和透视投影矩阵的讲解太透彻了，很多时候是在实践的时候才明白这三个矩阵的秒用和原理。比如当初在缩放模型(缩放、旋转和平移的顺序)，实现布告板(确保物体始终朝向相机)，探究透视投影深度分布的不规律性等，这三个案例都可以专门写个实践案例...

将模型从局部坐标转到裁剪坐标的流程就是由著名顶顶的MVP矩阵实现的，转换过程如下图所示：

![MVP矩阵](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/mvp_matrix.png)

也就是说经过顶点着色器以后得到的是裁剪坐标系下的坐标(👨‍🦳再次强调)，之后会进行透视除法得到NDC坐标，最后经过视口变换就得到了屏幕坐标。但这两步一般是设备帮我们做的，如果想要根据这两种坐标进行逻辑判断，则需要我们去进行模拟，对应的转换公式如下图所示：

![透视除法和视口变换](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/perspective_division_and_viewport_transformation.png)

## 坐标逆变换

em, 顾名思义倒着乘逆矩阵就可以回去，但是要注意屏幕坐标只能得到二维信息，需要得到gl上下文存储屏幕坐标对应顶点的深度信息，这样就齐活了，一路求逆回去就行了(可能要注意下屏幕坐标的原点是在坐下还是在左上，本文默认在左下了，如果在左上直接用viewport的高度减一下就好)。如果该点没有深度，那就取临近点或者插值就好。如此一来就能够根据屏幕坐标得到模型对应的世界坐标甚至局部坐标了。

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

我不断调整点位的时候，发现很多有趣的现象，真的是实践出真知，猛地一刹那，才明白书或视频里的那一句话是什么意思...
