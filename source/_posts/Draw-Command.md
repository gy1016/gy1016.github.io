---
title: 利用DrawCommand绘制自定义的几何体
description: 使用Cesium引擎去加载我们自己格式的模型。
tags:
  + Cesium
categories:
  + 计算机图形学
---

骚年，你相信吗？你学了 `DrawCommand` 的话，利用 `Cesium` 就没有你画不了的几何体(童叟无欺.jpg)。每款渲染引擎一定都提供了根据**顶点数组数据**来渲染模型的能力， `Cesium` 也不例外，PS：一般情况下，我们认为顶点数组数据包括但不限于：顶点坐标，顶点纹理，顶点法线，顶点切线... 

下面我们介绍 `DrawCommand` 是干嘛的，以及怎么使用。最后，我们会创建一个 `CustomPrimitive` 模块来承载我们自定义的模型，并以立方体的数据为例，来进行展示。(这样一看，是不是如果我们有 `OBJ` 模型，只要将对应顶点数据和纹理数据解析出来就可以进行渲染了呢)。

## 简介

在 `Cesium` 中， `DrawCommand` 指令是将装配好的模型数据进行绘制的核心命令， `Cesium` 维护了一个**命令列表**来进行不同通道(透明、不透明等)数据的绘制，我们可以认为每一个 `Primitive` 都具备自己的 `DrawCommand` ，并且会在自己实例的 `update` 方法中进行命令更新，然后推入**命令列表**当中。除了 `Cesium` 中的 `Primitive` ，像 `Skybox` 和 `Sun` 这些模块也使用 `DrawCommand` 绘制的(当然我这句话是废话， `DrawCommand` 是 `Cesium` 渲染的命令，不用它用谁)。

## 开发

### 自定义几何体模块架构

该板块的设计遵循了 `Primitive` 由 `Geometry` 和 `Material` 构成的设计理念：

![Custom Primitive](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/customprimitive.png)

该板块构建 `CustomGeometry` ， `CustomMaterial` 和 `CustomPrimitive` 这三个类文件，不过由于本人对 `Cesium` 中的材质还不了解，对于本文中纹理的设置，我们先集成在 `CustomPrimitive` 当中，故我们只需按关注另外两个类文件即可( `Cesium` 的 `Material` 会单独写一篇文章，疯狂挖坑)。

### CustomGeometry

写在前面，如果想我门自定义的 `Geometry` 能够被正常使用，那么下面这几个属性是必不可少的： `GeometryAttributes` 、 `PrimitiveType` 和 `BoundingSphere` 。

`CustomGeometry` 板块要求用户输入模型的数据，即 `position` ， `st` ， `normal` 和 `indices` 等**类型数组**数据(本DEMO仅在代码中写了位置和纹理坐标数据的处理)。要注意的是， `indices` 并不属于顶点数据哦。属于VAO(Vertex Array Objec)的属性都被归到了 `attributes` 下面，它们和 `indices` 底层创建 `Buffer` 的方法也有区别。还要注意的是 `indices` 选取的类型，可以根据顶点的数量来进行对应的选取，比如我当初就因为选了 `Uint16Array` 导致模型被部分绘制，这个也可以列为减轻渲染压力的一种优化手段。 `PrimitiveType` 大家应该都很熟悉了，就是决定怎么根据顶点数据来绘制模型的，可以按点、线和三角形等多种方式来进行绘制。包围球因该不用过多介绍，我们直接看对 `CustomGeometry` 的简单封装：

```ts
import { BoundingSphere, ComponentDatatype, GeometryAttribute, GeometryAttributes, PrimitiveType } from 'cesium';

export interface ICustomGeometryOptions {
  // VAO下面的顶点坐标
  position: Float64Array;
  // VAO下面的纹理坐标
  st: Float32Array;
  // 模型顶点的绘制方式，默认为三角形连接
  primitiveType?: PrimitiveType;
}

export class CustomGeometry {
  // 存储顶点数据
  public attributes: GeometryAttributes = new GeometryAttributes();
  // 顶点数据的绘制方式
  public primitiveType: PrimitiveType = PrimitiveType.TRIANGLES;
  // 包围球
  public boundingSphere: BoundingSphere;
  // 顶点的索引信息
  public indices?: Uint16Array;

  constructor(options: ICustomGeometryOptions) {
    const { position, st, primitiveType } = options;
    this.attributes.position = new GeometryAttribute({
      // 对应Float64Array
      componentDatatype: ComponentDatatype.DOUBLE,
      // 一个顶点坐标包含(x, y, z)三个字段
      componentsPerAttribute: 3,
      values: position,
    });

    this.attributes.st = new GeometryAttribute({
      // 对应Float32Array
      componentDatatype: ComponentDatatype.FLOAT,
      // 纹理坐标是平面的(s, t)
      componentsPerAttribute: 2,
      values: st,
    });

    this.primitiveType = primitiveType ?? PrimitiveType.TRIANGLES;
    // 根据顶点坐标数据得到包围球，计算耗时，如果能直接设置最好
    this.boundingSphere = BoundingSphere.fromVertices([...position]);
  }
}

```

### CustomPrimitive

几何数据构建后之后，我们就应该考虑如何构建 `DrawCommand` 命令，并将其推入**命令列表**当中了。 `Primitive` 的构建是有一套核心模板的，其必须包含 `update()` 方法，当然为了能够释放显存和内存也必须要有 `destroy()` 方法。

讲之前我们首先得知道一个叫做着色程序(ShaderProgram, `sp` )的东西，其是由着色器代码编译而产生的程序。而着色器又是由顶点着色器和片元着色器构成的就可以了。编写着色器的代码我们一般称为 `shader` ，后缀名通常为 `*.glsl` 。我们先来看两段仅仅支持 `position` 和 `st` 的简单 `shader` (即一段顶点，一段片元，先顶点后片元，片元拿到的数据是顶点经过光栅化的)。

顶点着色器代码(每个顶点都会走这个代码)如下所示，顺便提一下 `WebGL1` 和 `WebGL2` 使用的着色器语言版本不一样，前者 `OpenGL ES 200` 后者 `OpenGL ES 300` ，后者除了集成了更多的新特性外，与前者最大的区别可能在于，后者用 `in` 替代了前者的 `attribute` ，用 `out` 替代了前者的 `varying` :

```glsl
// 输入顶点坐标数据
in vec3 position;
// 输入纹理坐标数据
in vec2 st;
// 向片元着色器输入经过光栅化的纹理数据
out vec2 v_st;
void main() {
  // 对即将传递的数据进行赋值
  v_st = st;
  // gl_Position是内置变量，即每个顶点的坐标，这里做的不好，mvp矩阵每个顶点都会乘一次，浪费性能，且会造成抖动现象
  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
}
```

片元着色器(每个片元都会执行)代码如下所示，顺便也简单介绍一下片元着色器，其中 `uniform` 变量相当于是常量，在顶点或片元着色器当中都可以使用。片元着色器中与顶点着色器中同名的变量都是由顶点着色器传递过来的，并且经历了光栅化内插：

```glsl
// 传入的二维纹理图片
uniform sampler2D u_texture;
// 经过顶点着色器内插的纹理坐标
in vec2 v_st;
void main() {
  // out_FragColor是内置变量，决定片元的最终颜色，在WebGL1中叫做gl_FragColor
  // texture可以理解为一个采样器，根据传入的纹理坐标从图片中得到对应的纹素
  out_FragColor = texture(u_texture, v_st);
}
```

有了这两段仅支持顶点坐标和纹理坐标的片元着色器后，我们就可以来编写 `CustomPrimitive` 的核心逻辑了，我们直接来看代码，并且根据代码的注释来进行讲解：

```ts
import { Matrix4, SceneMode, CullFace, Color, GeometryPipeline } from 'cesium';
// 下面这些类型文件Cesium并没有提供
// @ts-ignore
import { RenderState, VertexArray, DrawCommand, Pass, BufferUsage, Texture, ShaderProgram, Context } from 'cesium';
import { CustomGeometry } from './CustomGeometry';

export interface ICustomPrimitiveOptions {
  // 在场景中的id，pick的话用得到，但是我们这个primitive不支持pick
  id: number;
  // 是否显示
  show?: boolean;
  // 模型矩阵
  modelMatrix: Matrix4;
  // 对应的几何数据
  geometry: CustomGeometry;
  // 对应的纹理数据
  image: TexImageSource;
}

export class CustomPrimitve {
  // 上面的顶点着色器代码
  static vs = `
    in vec3 position;
    in vec2 st;
    out vec2 v_st;
    void main() {
      v_st = st;
      gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
    }`;

  // 上面的片元着色器代码
  static fs = `
    uniform sampler2D u_texture;
    in vec2 v_st;
    void main() {
      out_FragColor = texture(u_texture, v_st);
    }`;

  // 创建顶点数组
  static getVertexArray(context: Context, geometry: CustomGeometry) {
    let vertexArray = context.cache.customizePrimitive_vertexArray;

    if (vertexArray) {
      return vertexArray;
    }

    vertexArray = VertexArray.fromGeometry({
      context: context,
      geometry: geometry,
      // 根据几何得到需要用到的属性，即返回结果应该是{position: 0, st: 1}
      attributeLocations: GeometryPipeline.createAttributeLocations(geometry as any),
      // 创建出Buffer的使用方式，STATIC_DRAW代表多次绘制使用
      bufferUsage: BufferUsage.STATIC_DRAW,
    });

    context.cache.customizePrimitive_vertexArray = vertexArray;
    return vertexArray;
  }

  public id: number;
  public show: boolean;
  public geometry: CustomGeometry;
  public modelMatrix: Matrix4;
  public image: TexImageSource;
  // 保存着色程序
  private _sp: ShaderProgram;
  // 保存顶点数组
  private _va: VertexArray;
  // 根据传入的image创建纹理
  private _texture: Texture;
  // 着色程序中用到的uniform变量的map
  private _uniforms: { [key: string]: () => any };
  // 自定义几何体的绘制命令
  private _drawCommand: DrawCommand;

  constructor(options: ICustomPrimitiveOptions) {
    const { id, show, geometry, modelMatrix, image } = options;
    this.id = id;
    this.show = show ?? true;
    this.geometry = geometry;
    this.modelMatrix = Matrix4.clone(modelMatrix ?? Matrix4.IDENTITY);
    this.image = image;

    this._sp = undefined;
    this._va = undefined;
    this._texture = undefined;
    this._uniforms = {
      // 对应片元着色器里面的u_texture
      u_texture: () => this._texture,
    };
    this._drawCommand = new DrawCommand({
      owner: this,
    });
  }

  // 会被Cesium在每一帧中进行调用
  update(frameState: RenderState) {
    if (!this.show || frameState.mode !== SceneMode.SCENE3D) return;

    if (!frameState.passes.render) return;

    const context = frameState.context;
    const geometry = this.geometry;
    if (!this._va) this._va = CustomPrimitve.getVertexArray(context, geometry);

    if (!this._texture) {
      this._texture = new Texture({
        context,
        source: this.image,
      });
    }

    // 根据顶点着色器和片元着色器创建着色程序
    this._sp = ShaderProgram.replaceCache({
      context: context,
      shaderProgram: this._sp,
      vertexShaderSource: CustomPrimitve.vs,
      fragmentShaderSource: CustomPrimitve.fs,
      attributeLocations: GeometryPipeline.createAttributeLocations(geometry as any),
    });

    const drawCommand = this._drawCommand;
    // 更新绘制命令的属性
    drawCommand.vertexArray = this._va;
    drawCommand.shaderProgram = this._sp;
    drawCommand.uniformMap = this._uniforms;
    drawCommand.renderState = RenderState.fromCache({
      // 是否开启背面剔除
      cull: {
        enabled: true,
        face: CullFace.BACK,
      },
      // 是否开启深度测试
      depthTest: {
        enabled: true,
      },
    });

    const commandList = frameState.commandList;
    drawCommand.modelMatrix = this.modelMatrix;
    drawCommand.pass = Pass.OPAQUE;
    commandList.push(drawCommand);
  }

  // 请忽略这个愚蠢的写法
  destory() {
    this._sp = this._sp && this._sp.destroy();
    for (const key in this) {
      // @ts-ignore
      this[key] = undefined;
    }
    return undefined;
  }
}
```

## 使用

最后，我们将传入一个立方体的顶点坐标和纹理数据(只要你有其它模型的顶点坐标数据和纹理坐标，你都可以绘制)，利用我们开发的 `CustomPrimitive` 模块来进行实例化，并添加到 `Cesium` 的场景当中。其中纹理坐标是为了能够将下面的纹理图贴到立方体的每个面上:

![Six Face Texture](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/six-face-texture.jpg)

```ts
// 位置数据说明
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3
const position = new Float64Array([
  // 底面四个点
  -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
  // 上面四个点
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
  // 正面四个点
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
  // 后面四个点
  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
  // 左面四个点
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
  // 右面四个点
  0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
]);
const st = new Float32Array([
  // 选择左下图
  0, 0, 0, 0.5, 0.25, 0, 0, 0.5, 0.25, 0.5, 0.25, 0,
  // 选择中下图
  0.25, 0, 0.5, 0, 0.25, 0.5, 0.25, 0.5, 0.5, 0, 0.5, 0.5,
  // 选择中右图
  0.5, 0, 0.5, 0.5, 0.75, 0, 0.5, 0.5, 0.75, 0.5, 0.75, 0,
  // 选择左上图
  0, 0.5, 0.25, 0.5, 0, 1, 0, 1, 0.25, 0.5, 0.25, 1,
  // 选择中上图
  0.25, 0.5, 0.25, 1, 0.5, 0.5, 0.25, 1, 0.5, 1, 0.5, 0.5,
  // 选择右上图
  0.5, 0.5, 0.75, 0.5, 0.5, 1, 0.5, 1, 0.75, 0.5, 0.75, 1,
]);
const customGeometry = new CustomGeometry({
  position,
  st,
});

let modelMatrix = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(106, 26, 250000 / 2));
Matrix4.multiplyByUniformScale(modelMatrix, 500000.0, modelMatrix);
loadImage('https://webglfundamentals.org/webgl/resources/noodles.jpg').then((image) => {
  const customPrimitive = new CustomPrimitve({
    id: 1,
    modelMatrix,
    geometry: customGeometry,
    image,
  });
  viewer.scene.primitives.add(customPrimitive);
});
```

最后的效果如下图所示，项目的完整代码在[这里](https://github.com/gy1016/cesium-learning/tree/master/src/4-custom-geometry)：

![渲染效果图](https://cdn.jsdelivr.net/gh/gy1016/blog-image@main/assets/custom-primitive-result.png)
