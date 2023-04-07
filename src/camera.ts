import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { query } from 'lit/decorators/query.js'

import logo from './assets/icon-1024.png'

@customElement('app-lucida-camera')
export class AppLucidaCamera extends LitElement {
  @query('canvas')
    canvas: HTMLCanvasElement

  @query('video')
    video: HTMLElement

  @query('#overlaySize')
    overlaySizeSlider: HTMLElement

  @query('#overlayOpacity')
    overlayOpacitySlider: HTMLElement

  @query('#imageInput')
    imageInput: HTMLInputElement

  context = undefined

  dragging = false

  dragStart = { x: 0, y: 0 }

  overlayPosition = {
    x: 0,
    y: 0
  }

  overlayImage = new Image()

  @property()
    error = 'Booting...'

  static styles = css`
    :host {
      overflow: hidden;
      display: block;
    }

    canvas {
    }

    video {
      display: none;
    }

    .controls {
      position: absolute;
      background: var(--color-yellow);
      border-radius: 100vw 100vw 0 0;
      bottom: 0;
      height: 50vw;
      width: 100vw;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      max-height: 40vh;
      overflow: hidden;
    }

    .controls__wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: flex-end;
      padding: 0 20vw;
    }

    .photo-input input {
      display: none;
    }

    .photo-input {
      text-align: center;
      border-radius: 2em;
      color: var(--color-dark);
      border: 1px solid var(--color-dark);
      padding: 0.25em 1em;
      display: block;
      font-family: sans-serif;
      font-weight: 900;
      cursor: pointer;
    }

    .photo-input:hover {
      background: var(--color-light);
    }

    #overlaySize {
      margin-bottom: 1em;
    }

    #overlayOpacity {
      margin-bottom: 1em;
    }
  `

  render () {
    return html`
      <canvas></canvas>
      <video playsinline muted></video>
      <div class="controls">
        <div class="controls__wrapper">
          <input
            type="range"
            id="overlaySize"
            min="10"
            max="200"
            value="100"
            step="1"
          />
         <input
            type="range"
            id="overlayOpacity"
            min="30"
            max="90"
            value="70"
            step="2"
          />
          <label class="photo-input">
            Pick a photo
            <input type="file" id="imageInput" accept="image/*" />
          </label>
          <p>${this.error}</p>
        </div>
      </div>
    `
  }

  firstUpdated () {
    super.connectedCallback()
    this.setupCamera()
    this.context = this.canvas.getContext('2d')
    this.setCanvasSize()

    this.canvas.addEventListener('mousedown', (event) => {
      this.dragging = true
      this.dragStart.x = event.clientX - this.overlayPosition.x
      this.dragStart.y = event.clientY - this.overlayPosition.y
      this.error = 'drag'
    })

    this.overlayImage.src =
      'https://cdn.glitch.global/f97da610-c06c-4706-b826-dedb3f30199d/image.webp?v=1679773240891'

    this.imageInput.addEventListener('change', (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.overlayImage.src = e.target.result
        }
        reader.readAsDataURL(file)
      }
    })

    this.canvas.addEventListener('mousemove', (event) => {
      if (this.dragging) {
        this.overlayPosition.x = event.clientX - this.dragStart.x
        this.overlayPosition.y = event.clientY - this.dragStart.y
      }
    })

    this.canvas.addEventListener('mouseup', () => {
      this.dragging = false
    })

    this.canvas.addEventListener('touchstart', (event) => {
      event.preventDefault()
      this.dragging = true
      const touch = event.touches[0]
      this.dragStart.x = touch.clientX - this.overlayPosition.x
      this.dragStart.y = touch.clientY - this.overlayPosition.y
    })

    this.canvas.addEventListener('touchmove', (event) => {
      event.preventDefault()
      if (this.dragging) {
        const touch = event.touches[0]
        this.overlayPosition.x = touch.clientX - this.dragStart.x
        this.overlayPosition.y = touch.clientY - this.dragStart.y
      }
    })

    this.canvas.addEventListener('touchend', () => {
      this.dragging = false
    })
  }

  setCanvasSize () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  async setupCamera () {
    try {
      const constraints = {
        video: {
          // facingMode: { exact: "environment" },
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.video.srcObject = stream

      this.video.addEventListener('loadeddata', () => {
        this.error = 'ok'
        this.video.play()
        // this.canvas.width = this.video.videoWidth;
        // this.canvas.height = this.video.videoHeight;
        requestAnimationFrame(this.updateCanvas)
      })
    } catch (err) {
      this.error = err
      this.error = navigator.mediaDevices
      console.error('Error setting up camera:', err)
    }
  }

  drawVideo () {
    const aspectRatio = this.video.videoWidth / this.video.videoHeight
    let newWidth, newHeight
    const canvas = this.canvas

    if (canvas.width / canvas.height > aspectRatio) {
      newWidth = canvas.width
      newHeight = canvas.width / aspectRatio
    } else {
      newWidth = canvas.height * aspectRatio
      newHeight = canvas.height
    }

    const xOffset = (canvas.width - newWidth) / 2
    const yOffset = (canvas.height - newHeight) / 2

    this.context.drawImage(this.video, xOffset, yOffset, newWidth, newHeight)

    // Draw the overlay image with low opacity and maintain aspect ratio
    const overlayImage = this.overlayImage
    const overlaySizeSlider = this.overlaySizeSlider

    const imgAspectRatio = overlayImage.width / overlayImage.height
    const overlayScale = overlaySizeSlider.value / 100
    const imgNewWidth = canvas.width * overlayScale
    const imgNewHeight = imgNewWidth / imgAspectRatio

    const overlayPosition = this.overlayPosition
    const imgXOffset = overlayPosition.x + (canvas.width - imgNewWidth) / 2
    const imgYOffset = overlayPosition.y + (canvas.height - imgNewHeight) / 2

    // Draw the overlay image with low opacity
    this.context.globalAlpha = this.overlayOpacitySlider.value / 100 // Set the opacity (0.5 for 50% opacity)
    this.context.drawImage(
      overlayImage,
      imgXOffset,
      imgYOffset,
      imgNewWidth,
      imgNewHeight
    )
    this.context.globalAlpha = 1 // Reset the opacity
  }

  updateCanvas = () => {
    this.drawVideo()
    requestAnimationFrame(this.updateCanvas)
  }
}
