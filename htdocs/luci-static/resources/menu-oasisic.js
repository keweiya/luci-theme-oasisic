'use strict';
'require baseclass';
'require ui';

/* luci-theme-oasisic — 侧边栏菜单渲染
 * 参考 themes/luci-theme-bootstrap 的 menu-bootstrap.js：
 * 使用 LuCI 标准的 ui.menu.load() 获取菜单树，
 * 渲染到 header.ut 中的 #oasisicMenu 容器。 */

return baseclass.extend({
	__init__() {
		ui.menu.load().then(L.bind(this.render, this));
	},

	render(tree) {
		const container = document.getElementById('oasisicMenu');
		if (!container)
			return;

		const root = (tree && tree.children)
			? (tree.children.admin ?? Object.values(tree.children)[0])
			: null;
		if (!root)
			return;

		const path = L.env.dispatchpath ?? [];
		const idx = path.indexOf('admin');
		const activeTop = (idx >= 0) ? path[idx + 1] : null;
		const activeSub = (idx >= 0) ? path[idx + 2] : null;

		/* #oasisicMenu 本身就是 ul.oasisic-nav-list，直接追加 li */
		for (const child of ui.menu.getChildren(root)) {
			const isActive = (child.name == activeTop);

			const li = E('li', {
				'class': 'oasisic-nav-item' + (isActive ? ' active' : '')
			}, [
				E('a', {
					'class': 'oasisic-nav-link',
					'href': L.url('admin', child.name)
				}, [
					E('span', { 'class': 'oasisic-nav-label' }, [ _(child.title) ])
				])
			]);

			if (isActive) {
				const sub = this.renderSubMenu(child, activeSub);
				if (sub)
					li.appendChild(sub);
			}

			container.appendChild(li);
		}
	},

	renderSubMenu(node, activeSub) {
		const children = ui.menu.getChildren(node);
		if (children.length == 0)
			return null;

		const ul = E('ul', { 'class': 'oasisic-nav-submenu' });

		for (const child of children) {
			const isActive = (child.name == activeSub);

			ul.appendChild(E('li', {
				'class': 'oasisic-nav-subitem' + (isActive ? ' active' : '')
			}, [
				E('a', {
					'class': 'oasisic-nav-sublink',
					'href': L.url('admin', node.name, child.name)
				}, [ _(child.title) ])
			]));
		}

		return ul;
	}
});
