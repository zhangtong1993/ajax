//->我们封装一个常用的方法库,发现需要传递的参数比较多,有的参数可以传递也可以不传递,为了方便后期的控制,我们最好把所有的形参变量都融合到一个对象中即可
function ajax(options) {
    //->init parameters
    var _default = {
        url: null,
        type: 'GET',
        dataType: 'JSON',//->预设服务器返回内容的格式,默认是JSON,可以传递TXT、XML...
        async: true,
        cache: true,//->GET请求的时候是否使用缓存,默认是TRUE,使用缓存,想要不走缓存的话我们设置为FALSE,
        data: null,//->设置请求主体中的内容,默认是null,如果当前的请求是POST请求,我们需要设置对应的值,
        success: null//->当服务器把内容返回成功之后,我们执行这个回调函数
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->SEND AJAX
    var xhr = new XMLHttpRequest;
    //如果当前请求方式是GET,并且CACHE中设置的是FALSE,说明不想走缓存数据,我们需要在URL的末尾通过追加随机数的方式避免走缓存的数据
    if (_default.type.toUpperCase() === 'GET' && _default.cache === false) {
        _default.url.indexOf('?') > -1 ? _default.url += '&' : _default.url += '?';
        _default.url += "_=" + Math.random();
    }
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            var dataType = _default.dataType.toUpperCase(),
                value = xhr.responseText;
            switch (dataType) {
                case 'JSON':
                    value = 'JSON' in  window ? JSON.parse(value) : eval('(' + value + ')');
                    break;
                case 'TXT':
                    break;
                case 'XML':
                    value = xhr.responseXML;
                    break;
            }
            //if (typeof _default.success === 'function') {
            //    _default.success.call(xhr, value);
            //}
            _default.success && _default.success.call(xhr, value);
        }
    };
    xhr.send(_default.data);
}
