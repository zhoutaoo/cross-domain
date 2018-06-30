cross-domain
============

# 一个利用html5的跨域api postMessage解决多iframe跨域通信的js框架

# 背景
最初公司只有一个系统来做销售，随着公司业务越来越多，搭建很多类似的系统（这些系统本来是没有任何关系的，每个系统目前都非常复杂），由于目前公司战略有调整，原来的销售是针对某种产品，现在销售工作要针对客户进行多产品的销售促成，这样一个销售人员就需要打开各种系统进行业务操作，非常不方便，而且销售数据间不能有效传递，所就需要把各个不相关的系统整合在一起，实现跨业务线销售和数据共享。若将这想要将这些复杂系统整合在一起，无论是从人力物力上都是不太可能接受的。所以选择了使用iframe将各系统嵌入一个框架系统，各系统从物理上还是分开不变，而从逻辑上（从用户角度看就是一个系统）看起来是一个系统。然而各系统采用了不同的域名，与主框架和其它业务系统有跨域问题（若将所有域名改为同一域名下可能会产生一些系统间页面元素和样式的冲突），故采用了HTML5标准下的postMessage来解决该问题。
# 介绍
## 示意图
![image](https://raw.githubusercontent.com/FreeLanderEden/cross-domain/master/example/principle.jpg)
## 简介与使用
请参考 [简介与使用](https://segmentfault.com/a/1190000015435530)
# Feature
## 组件自动注册机制
页面及js加载完成后自动发送配置信息到master端进行注册，master接收到消息后将组件存储相关信息，无需手工进行任何初使化操作。
## 消息自动回复机制
postMessage为单项信息传递，若调用方发起调用后有值需要被调用方返回则需要被调用方主动发送，故希望实现若被调用方有值需要返回则自动回复给调用方，简化操作。
## 消息自动路由机制
组件间不能直接进行消息发送，全部需要经过master的路由和转发
## 前端数据共享机制
不同域名前端数据进行共享使用，解决组件间数据的频繁共享使用，原理是通过跨域方法对需要共享使用的数据自动转发到每个组件浏览器中的sessionStorage进行存储，关闭浏览器数据即清除。
# Contributing
欢迎大家提供想法和提交代码
# License
The MIT License (MIT)

Copyright (c) 2014 FreeLanderEden
# Communication
* WeChat：zhoutaoo
* WeiBo：@zhoutaoo
* EMail：zhoutaoo@foxmail.com