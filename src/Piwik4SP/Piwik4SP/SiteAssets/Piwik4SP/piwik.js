if (window.Type) {
    window.Type.registerNamespace('piwik4sp');
} else {
    window.piwik4sp = { '__namespace': true };
}
(function (analytics) {
    analytics.mdsReplaceStartAspx = function (inp) {
        var startAspx = '/start.aspx',
            pos = inp.indexOf(startAspx),
            offset = pos + startAspx.length + 1,
            stop, url;

        if (pos === -1) {
            // no mds-url
            return inp;
        }
        //TODO: What about _spPageContextInfo.serverRequestPath
        if (inp.substring(0, offset - 1) !== document.location.href.substring(0, offset - 1)) {
            console.log('THIS IS ' + document.location.href + ' but we\'re comparing to ' + inp + '. THIS IS BAD!');
            return inp;
        }

        //calculate the real page-url..
        //TODO: is _spPageContextInfo.serverRequestPath what I'm looking for?!
        stop = Math.min.apply(Math, [document.location.href.indexOf('?', offset),
            document.location.href.indexOf('#', offset)].filter(function (x) {
                return x > -1
            }));
        if (stop === window.Infinity) {
            stop = document.location.href.length;
        }
        url = window.decodeURIComponent(document.location.href.substring(offset, stop));
        return window.location.href.substring(0, window.location.href.indexOf('/_layouts')) + url;
    };
    analytics.doTracking = function () {
        if (!analytics.piwikUrl || !analytics.trackingId) {
            return;
        }

        analytics.paq = window._paq; // window._paq was probably modified by piwik. save the modified version for later...

        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        _paq.push(['setCustomUrl', analytics.mdsReplaceStartAspx(document.location.href)])
        _paq.push(['enableHeartBeatTimer']);
        //if (document.title) {
        //    _paq.push(['setDocumentTitle', document.title]);
        //}
        if (_spPageContextInfo) {
            _paq.push(['setCustomVariable', 1, 'Site', _spPageContextInfo.siteAbsoluteUrl, 'page']);
            _paq.push(['setCustomVariable', 2, 'Web', _spPageContextInfo.webAbsoluteUrl, 'page']);
        }
        _paq.push(['setDocumentTitle', analytics.mdsReplaceStartAspx(document.location.href)]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
    };
    analytics.loadWebSettings = function () {
        var ctx = SP.ClientContext.get_current(),
            properties = ctx.get_site().get_rootWeb().get_allProperties();
        ctx.load(properties);
        ctx.executeQueryAsync(function () {
            analytics.piwikUrl = properties.get_fieldValues()['piwik4sp.url'] || false;
            analytics.trackingId = properties.get_fieldValues()['piwik4sp.trackingId'] || false;

            if (!analytics.piwikUrl || !analytics.trackingId) {
                return;
            }

            // load piwik
            window._paq = window._paq || [];
            analytics.doTracking();
            (function () {
                _paq.push(['setTrackerUrl', analytics.piwikUrl + 'piwik.php']);
                _paq.push(['setSiteId', analytics.trackingId]);
                var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
                g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = analytics.piwikUrl + 'piwik.js'; s.parentNode.insertBefore(g, s);
            })();

        }, function (err) {
            console.log && console.log(err.get_message());
        })
    };
    analytics.init = function () {
        if (analytics.paq) {
            // we've been here and ga was loaded.
            window._paq = analytics.paq; // window._paq may have been "cleaned up"..
            analytics.doTracking();
            return;
        }        

        // load tracking-url and -id
        if (!SP.SOD.executeOrDelayUntilScriptLoaded(analytics.loadWebSettings, 'sp.js')) {
            SP.SOD.executeFunc('sp.js', null, function () { });
        }
    };
    analytics.register = function () {
        var thisUrl;
        if (window.RegisterModuleInit && window._spPageContextInfo) {
            thisUrl = '~siteCollection/SiteAssets/piwik4sp/piwik.js'.replace('~siteCollection/', window._spPageContextInfo.siteServerRelativeUrl);
            window.RegisterModuleInit(thisUrl, analytics.init);
        }

        analytics.init();
    };
    window._spBodyOnLoadFunctions.push(analytics.register);
}(window.piwik4sp));
