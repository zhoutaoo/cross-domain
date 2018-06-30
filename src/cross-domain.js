(function (window) {
    var CD = function () {
    };
    CD.prototype = {
        DEFAULT_NAME_MASTER: "MASTER",
        DEFAULT_NAME_SLAVE: "SLAVE",
        version: "0.0.1",
        component: {},
        components: {},
        interfaces: {},
        /**
         * 初使化
         */
        init: function () {
            this.component = {
                type: this.isMaster() ? this.DEFAULT_NAME_MASTER : this.DEFAULT_NAME_SLAVE,
                name: this.isMaster() ? this.DEFAULT_NAME_MASTER : window.name,
                url: window.location.host,
                port: window.location.port || 80
            };
            if (!this.component.name) {
                throw new Error("Error iframe must has a name");
            }
            //this.components[this.component.name] = this.component;
            this.register(this.component);
            this.extends("register", function (data) {
                this.components[data.component.name] = data.component;
            });
        },
        /**
         * 是否是Master
         * 如果窗口为顶层窗口则认为是Master
         */
        isMaster: function () {
            return window === window.top;
        },
        /**
         * Salve将自身组件注册到MASTER端
         */
        register: function () {
            this.send(this.DEFAULT_NAME_MASTER, "register", {info: "i'm coming register!", component: this.component});
        },
        /**
         * 扩展接口方法
         * @param {String} name接口名称
         * @param {Function} fun 接口方法
         */
        extends: function (name, fun) {
            this.interfaces[name] = fun;
        },
        /**
         * 打印跨域日志的方法
         *
         * @param {Object} mesg 要打印跨域消息的内容
         */
        log: function (mesg) {
            if (!window.console || typeof window.console === 'undefined')
                return;
            window.console.log("[" + new Date() + "][" + this.version + "][" + this.component.type + "][" + this.component.name + "][" + mesg.type + "][" + window.JSON.stringify(mesg) + "]");
        },
        /**
         * 发送信息到其它组件 - html5原生态方法包装
         *
         * @param {Window} targetWindow目标系统window对象
         * @param {String} targetUrl目标系统 URL
         * @param {Object} mesg 对象
         */
        postMessage: function (targetWindow, targetUrl, mesg) {
            this.log(mesg);
            targetWindow.postMessage(JSON.stringify(mesg), targetUrl);
        },
        /**
         * 发送消息方法
         * @param {String} componentName组件名称
         * @param {String} method接口名称
         * @param {Object} data数据
         * @param {Function} callback回调
         */
        send: function (componentName, method, data, callback, type) {
            if (this.isMaster() && componentName === this.DEFAULT_NAME_MASTER)
                return;
            var source = this.component.name;
            var mesg = {
                source: source,
                target: componentName,
                method: method,
                data: data,
                type: type || "REQUEST"
            };
            if (callback)
                this.extends(method + "Callback", callback);
            var w = this.isMaster() ? window.document[componentName] : window.top;
            var host = this.isMaster() ? this.components[componentName].host : "*";
            //console.info(host);
            this.postMessage(w, "*", mesg);
        },
        /**
         * 处理接收到的其它系统的请求跨域请求
         *
         * @param {Event} event事件对象
         */
        process: function (event) {
            var mesg = JSON.parse(event.data);
            //console.log(event);
            this.log(mesg);
            var interfaceMethd = this.interfaces[mesg.method];
            var result;
            if (interfaceMethd) {
                result = interfaceMethd.call(this, mesg.data);
            } else {
                throw new Error("[" + this.component.name + "] not have interface:[" + mesg.method + "]");
            }
            if (result) {
                this.send(mesg.source, mesg.method + "Callback", result, null, "RETURN");
            }
        },
        /**
         * 绑定窗口事件，用于监听跨域事件
         */
        listen: function () {
            if (window.addEventListener) {// 非IE
                window.addEventListener("message", function (event) {
                    window.CD.process(event);
                }, false);
            } else {// IE
                window.attachEvent("onmessage", function (event) {
                    window.CD.process(event);
                });
            }
        }
    };
    window.CD = new CD();
    window.CD.init();
    window.CD.listen();
})(this);
