---
title: 树莓派踩坑记录
description: 树莓派这个ARM架构真的狗，处处坑。
tags:
  + Raspberrypi
categories:
  + Linux
---

## 系统的烧录

默认装的是 `debain` 的树莓派版本，以后看看要不要换其它系统，我买的可是8G内存的版本(●ˇ∀ˇ●)

## Xrdp的安装

不得不说 `windows` 的远程桌面连接真的牛...

## Clash的配置

想当初在机房的 `ubuntu` ，分分钟就配置好了，这托树莓派真是恶心人啊...

## Neovim的安装

使用 `apt` 装的都是老古董了，不用最新版本的好多插件配置不上。但是按照官网给出 `Debain` 系统的安装方法死活装不上，果然还是得自己编译安装，树莓派的 `ARM` 架构踩了好多坑了...

### 下载源码

科学上网后下载个源码还不是轻轻松松，┗|｀O′|┛ 嗷~~

```bash
# 克隆项目
git clone https://github.com/neovim/neovim
# 进入项目内
cd neovim
# 切换分支为稳定版本
git checkout stable
```

### 编译安装

我这里第一次安装反正是报错了，只需要要根据报错提示全装对应的第三方包就好了(●'◡'●)

```bash
make CMAKE_BUILD_TYPE=RelWithDebInfo
```

编译完成之后进行安装：

```bash
sudo make install
```

如果要卸载，准备编译最新版本的话：

```bash
sudo cmake --build build/ --target uninstall
```

### 检查版本

嗯，到了最喜欢的环节O(∩_∩)O：

```bash
nvim --version
```

### 配置插件

你在搞笑吗，(┬┬﹏┬┬)? 什么实力敢自己配置插件，果断先 `lunarvim` :

```bash
LV_BRANCH='release-1.3/neovim-0.9' bash <(curl -s https://raw.githubusercontent.com/LunarVim/LunarVim/release-1.3/neovim-0.9/utils/installer/install.sh)
```

自己去官网复制最新的吧，注意看终端输出，不需要的插件可以不装。好了，再添加个环境变量就可以开始装逼了( •̀ ω •́ )✧

```bash
# 在.bashrc(看你自己喜欢什么终端咯)中添加下面这一行
# 需要自己添加，主要还是因为lunarvim是装在当前用户的.local目录下面
export PATH="$HOME/.local/bin:PATH"
```

添加完后刷一下终端：

```bash
source ~/.bashrc
```

### 常用快捷键总结

```bash
# 目录树
<super> + e
# 打开临时终端
<ctrl> + \
# 切换到右边窗口
<ctrl> + l
# 切换到左边窗口
<ctrl> + h
# 在当前窗口的右侧开辟一个新的垂直分割窗口
<ctrl> + w + v
# 在当前窗口的下方开辟一个新的水平分割窗口
<ctrl> + w + s
# 关闭当前窗口
<ctrl> + w + c
```

## 参考链接

* (Neovim从零配置自定义个人编辑器)[https://www.bilibili.com/video/BV1Td4y1578E/?spm_id_from=333.999.0.0&vd_source=897a01590d1243df954fe9d722c15de5]
