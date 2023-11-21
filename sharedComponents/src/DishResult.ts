import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("dish-result")
class DishResult extends LitElement {
  static styles = css`
    :host {
      color: blue;
    }
  `;

  @property() dishName?: string;
  @property() dishDescription?: string;
  @property() imgSrc?: string;

  render() {
    return html`<ul>
      <li><img src=${this.imgSrc} /></li>
      <li>${this.dishName}</li>
      <li>${this.dishDescription}</li>
    </ul>`;
  }
}

export default DishResult;
