(function (e, t, n) {
	if (e.snaptr) return;
	var a = (e.snaptr = function () {
		a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
	});
	a.queue = [];
	var s = 'script';
	r = t.createElement(s);
	r.async = !0;
	r.src = n;
	var u = t.getElementsByTagName(s)[0];
	u.parentNode.insertBefore(r, u);
})(window, document, 'https://sc-static.net/scevent.min.js');

snaptr('init', 'fcb9ff21-6f99-4d81-8345-85593d4c9781', {
	user_email: '_INSERT_USER_EMAIL_'
});

snaptr('track', 'PAGE_VIEW');
