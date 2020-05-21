import $ from "jquery";

class Component {
	protected element: JQuery;

	public constructor(element: HTMLElement) {
		this.element = $(element);
		this.onMount();
	}

	public onMount(): void {
		// This will be overridden.
	}

	public debounce(fn: Function, wait: number, immediate: boolean) {
		let timeout: any;

		return function() {
			let context = this,
				args = arguments;
			let later = function() {
				timeout = null;
				if (!immediate) fn.apply(context, args);
			};
			let callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) fn.apply(context, args);
		};
	}

	public throttle(fn: Function, limit: number) {
		let lastFunc: any;
		let lastRan: any;

		return function() {
			const context = this;
			const args = arguments;
			if (!lastRan) {
				fn.apply(context, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(function() {
					if (Date.now() - lastRan >= limit) {
						fn.apply(context, args);
						lastRan = Date.now();
					}
				}, limit - (Date.now() - lastRan));
			}
		};
	}
}

const Init = (selector: string, component: any) => {
	return () => {
		$(selector).each(function() {
			new component(this);
		});
	};
};

export default {
	Component: Component,
	Init: Init,
};
