(function () {
    var cancelClick = function () {
        var url = '',
            source = document.location.href.match('[\?&]Source=[^\&]+');
        if (source && source.length > 0) {
            url = decodeURIComponent(source[0].substring(8));
        } else {
            url = _spPageContextInfo.siteAbsoluteUrl;
            url += '/' + _spPageContextInfo.layoutsUrl + '/settings.aspx';
        }
        document.location.href = url;
    },
        okClick = function () {
            var trackerIdInput = document.getElementById('trackingId'),
                trackerUrlInput = document.getElementById('trackingUrl');
            trackerIdInput.value = trackerIdInput.value.trim();
            trackerUrlInput.value = trackerUrlInput.value.trim();
            if (trackerUrlInput.value && trackerUrlInput.value.indexOf('//') < 0) {
                // http/https?
                trackerUrlInput.value = 'http://' + trackerUrlInput.value;
            }
            if (trackerUrlInput.value && !/\/$/.test(trackerUrlInput.value)) {
                trackerUrlInput.value = trackerUrlInput.value + '/';
            }
            ctx = SP.ClientContext.get_current(),
            web = ctx.get_site().get_rootWeb(),
            properties = web.get_allProperties();
            console.log('save: ' + trackerIdInput.value)
            ctx.load(properties);
            ctx.executeQueryAsync(function () {
                properties.set_item('piwik4sp.trackingId', trackerIdInput.value || '');
                properties.set_item('piwik4sp.url', trackerUrlInput.value || '');
                web.update();
                ctx.load(web);
                ctx.executeQueryAsync(function () {
                    cancelClick();
                }, function (err) {
                    console.log && console.log(err.get_message());
                });
            }, function (err) {
                console.log && console.log(err.get_message());
            });
        },
        attachEvent = function (elm, event, handler) {
            if (elm.addEventListener) {
                elm.addEventListener(event, handler, false);
            }
            else if (elm.attachEvent) {
                elm.attachEvent('on' + event, handler);
            }
        },
        load = function () {
            var ctx = SP.ClientContext.get_current(),
                properties = ctx.get_site().get_rootWeb().get_allProperties();
            ctx.load(properties);
            ctx.executeQueryAsync(function () {
                var trackerIdInput = document.getElementById('trackingId'),
                    trackerUrlInput = document.getElementById('trackingUrl'),
                    okBtn = document.getElementById('p-ok'),
                    cancelBtn = document.getElementById('p-cancel'),
                    trackingId = properties.get_fieldValues()['piwik4sp.trackingId'] || '',
                    trackingUrl = properties.get_fieldValues()['piwik4sp.url'] || '';
                trackerIdInput.value = trackingId;
                trackerIdInput.removeAttribute('readonly');
                trackerIdInput.removeAttribute('disabled');
                trackerUrlInput.value = trackingUrl;
                trackerUrlInput.removeAttribute('readonly');
                trackerUrlInput.removeAttribute('disabled');
                attachEvent(okBtn, 'click', okClick);
                okBtn.classList.remove('disabled');
                attachEvent(cancelBtn, 'click', cancelClick);
                cancelBtn.classList.remove('disabled');
            }, function (err) {
                console.log && console.log(err.get_message());
            });
        };
    if (!SP.SOD.executeOrDelayUntilScriptLoaded(load, 'sp.js')) {
        SP.SOD.executeFunc('sp.js', null, function () { });
    }
}())