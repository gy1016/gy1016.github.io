(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{597:function(t,a,s){"use strict";s.r(a);var n=s(12),p=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"基本概念"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#基本概念"}},[t._v("#")]),t._v(" 基本概念")]),t._v(" "),s("ul",[s("li",[t._v("Entry：编译入口，webpack 编译的起点")]),t._v(" "),s("li",[t._v("Compiler：编译管理器，webpack 启动后会创建 compiler 对象，该对象一直存活知道结束退出")]),t._v(" "),s("li",[t._v("Compilation：单次编辑过程的管理器，比如 watch = true 时，运行过程中只有一个 compiler 但每次文件变更触发重新编译时，都会创建一个新的 compilation 对象")]),t._v(" "),s("li",[t._v("Dependence：依赖对象，webpack 基于该类型记录模块间依赖关系")]),t._v(" "),s("li",[t._v("Module：webpack 内部所有资源都会以 module 对象形式存在，所有关于资源的操作、转译、合并都是以 module 为基本单位进行的")]),t._v(" "),s("li",[t._v("Chunk：编译完成准备输出时，webpack 会将 module 按特定的规则组织成一个一个的 chunk，这些 chunk 某种程度上跟最终输出一一对应")]),t._v(" "),s("li",[t._v("Loader：资源内容转换器，其实就是实现从内容 A 转换 B 的转换器")]),t._v(" "),s("li",[t._v("Plugin：webpack 构建过程中，会在特定的时机广播对应的事件，插件监听这些事件，在特定时间点介入编译过程")])]),t._v(" "),s("h2",{attrs:{id:"核心流程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#核心流程"}},[t._v("#")]),t._v(" 核心流程")]),t._v(" "),s("h3",{attrs:{id:"初始化阶段"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#初始化阶段"}},[t._v("#")]),t._v(" 初始化阶段")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("将 process.args + webpack.config.js 合并成用户配置")])]),t._v(" "),s("li",[s("p",[t._v("调用 validateSchema 校验配置")])]),t._v(" "),s("li",[s("p",[t._v("调用 getNormalizedWebpackOptions + applyWebpackOptionsBaseDefaults 合并出最终配置")])]),t._v(" "),s("li",[s("p",[t._v("创建 compiler 对象")])]),t._v(" "),s("li",[s("p",[t._v("遍历用户定义的 plugins 集合，执行插件的 apply 方法")])]),t._v(" "),s("li",[s("p",[t._v("调用 new WebpackOptionsApply().process 方法，加载各种内置插件")])])]),t._v(" "),s("p",[t._v("主要逻辑集中在 WebpackOptionsApply 类，webpack 内置了数百个插件，这些插件并不需要我们手动配置，WebpackOptionsApply 会在初始化阶段根据配置内容动态注入对应的插件，包括：")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("注入 EntryOptionPlugin 插件，处理 entry 配置")])]),t._v(" "),s("li",[s("p",[t._v("根据 devtool 值判断后续用那个插件处理 sourcemap，可选值：EvalSourceMapDevToolPlugin、SourceMapDevToolPlugin、EvalDevToolModulePlugin")])]),t._v(" "),s("li",[s("p",[t._v("注入 RuntimePlugin ，用于根据代码内容动态注入 webpack 运行时")])])]),t._v(" "),s("p",[t._v("到这里，compiler 实例就被创建出来了，相应的环境参数也预设好了，紧接着开始调用 compiler.compile 函数：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 取自 webpack/lib/compiler.js")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("compile")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("callback")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" params "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("newCompilationParams")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("hooks"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("beforeCompile"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("callAsync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("params"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("err")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" compilation "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("newCompilation")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("params"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("hooks"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("make"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("callAsync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("compilation"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("err")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("hooks"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("finishMake"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("callAsync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("compilation"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("err")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n          process"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("nextTick")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            compilation"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("finish")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("err")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n              compilation"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("seal")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("err")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n          "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("从创建 compiler 实例到调用 make 钩子的链路：")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("启动 webpack 触发 lib/webpack.js 文件中 createCompiler 方法")])]),t._v(" "),s("li",[s("p",[t._v("createCompiler 方法内部调用 WebpackOptionsApply 插件，WebpackOptionsApply 定义在 lib/WebpackOptionsApply.js 文件，内部根据 entry 配置决定注入 entry 相关的插件，包括：DllEntryPlugin、DynamicEntryPlugin、EntryPlugin、PrefetchPlugin、ProgressPlugin、ContainerPlugin")])]),t._v(" "),s("li",[s("p",[t._v("Entry 相关插件，如 lib/EntryPlugin.js 的 EntryPlugin 监听 compiler.make 钩子")])]),t._v(" "),s("li",[s("p",[t._v("lib/compiler.js 的 compile 函数内调用 this.hooks.make.callAsync")])]),t._v(" "),s("li",[s("p",[t._v("触发 EntryPlugin 的 make 回调，在回调中执行 compilation.addEntry 函数")])]),t._v(" "),s("li",[s("p",[t._v("compilation.addEntry 函数内部经过一坨与主流程无关的 hook 之后，再调用 handleModuleCreate 函数，正式开始构建内容")])])]),t._v(" "),s("h3",{attrs:{id:"构建阶段"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#构建阶段"}},[t._v("#")]),t._v(" 构建阶段")]),t._v(" "),s("h3",{attrs:{id:"生成阶段"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#生成阶段"}},[t._v("#")]),t._v(" 生成阶段")])])}),[],!1,null,null,null);a.default=p.exports}}]);