import Base from "./_BaseComponent";
import $ from "jquery";

class Email extends Base.Component {
	private email: string;

	public onMount(): void {
		try {
			this.email = window.atob(this.element.attr("data-component-email"));
		} catch (e) {
			this.email = null;
		}

		if (this.email) this.render();
	}

	private render(): void {
		this.element.html(this.email);
		if (this.element.get(0).tagName == "A")
			this.element.attr("href", `mailto:${this.email}`);
	}
}

export default Base.Init("[data-component-email]", Email);
