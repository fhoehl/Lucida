import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import logo from './assets/icon-1024.png'

@customElement('app-lucida-welcome')
export class AppLucidaWelcome extends LitElement {
  render () {
    return html`
      <article class="flow">
        <div class="logo">
          <img alt="open-wc logo" src=${logo} width="1024" height="1024"/>
        </div>
        <h1>Lucida</h1>

        <p>Lucida is a smol camera lucida app for your phone</p>

        <p>To get started you need&ensp;:</ul>
        <ul>
          <li>Use the app on your smartphone</li>
          <li>Allow access to the camera when asked</li>
          <li>A nice pencil</li>
          <li>A piece of paper</li>
          <li>An empty mug or glass</li>
          <li>Something to draw</li>
        </ul>
      </article>

        <div class="pull-right">
          <a class="button" href="/how-to">Start</a>
        </div>

    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
    }

    .logo img {
      aspect-ratio: 1 / 1;
      width: 100%;
      height: auto;
    }
    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
  protected createRenderRoot () {
    return this
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-lucida-welcome': AppLucidaWelcome
  }
}
