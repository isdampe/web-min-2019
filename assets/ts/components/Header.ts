import Base from "./_BaseComponent";
import $ from "jquery";

class Header extends Base.Component {
	public onMount(): void {
		console.log("Header did mount");
		this.element.html("Header did mount");
	}
}

export default Base.Init("[data-component-header]", Header);
