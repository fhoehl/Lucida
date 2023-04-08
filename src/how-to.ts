import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import illustration from './assets/how-to.png'

@customElement('app-lucida-how-to')
export class AppLucidaHowTo extends LitElement {
  render (): any {
    return html`
      <article class="flow">
        <h2>How to</h2>
        <p>
          Prop your phone on top of a mug or glass. You will then have to select
          a picture to draw. Drag and scale it as you see fit. You will be able
          to see the tip of your pencil through the screen.
        </p>
        <img
          class="logo"
          alt="Prop your smartphone on top of a mug or glass."
          src=${illustration}
          width="1080"
          height="1920"
        />
        <p>Happy drawing&thinsp;!</p>
      </article>

      <div class="pull-right">
        <a class="button" href="camera">Continue</a>
      </div>
    `
  }

  protected createRenderRoot (): any {
    return this
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-lucida-how-to': AppLucidaHowTo
  }
}
