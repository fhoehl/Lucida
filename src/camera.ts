import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { query } from 'lit/decorators/query.js'

@customElement('app-lucida-camera')
export class AppLucidaCamera extends LitElement {
  @query('canvas')
    canvas: HTMLCanvasElement | undefined

  @query('video')
    video: HTMLVideoElement | undefined

  @query('#overlaySize')
    overlaySizeSlider: HTMLInputElement | undefined

  @query('#overlayOpacity')
    overlayOpacitySlider: HTMLInputElement | undefined

  @query('#imageInput')
    imageInput: HTMLInputElement | undefined

  context: CanvasRenderingContext2D | null | undefined

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

  async firstUpdated (): Promise<void> {
    if (this.canvas === undefined) return

    super.connectedCallback()
    await this.setupCamera()
    this.context = this.canvas.getContext('2d')
    this.setCanvasSize()

    if (this.canvas === undefined || this.imageInput === undefined) return

    this.canvas.addEventListener('mousedown', (event) => {
      this.dragging = true
      this.dragStart.x = event.clientX - this.overlayPosition.x
      this.dragStart.y = event.clientY - this.overlayPosition.y
      this.error = 'drag'
    })

    this.overlayImage.src =
      'https://cdn.glitch.global/f97da610-c06c-4706-b826-dedb3f30199d/image.webp?v=1679773240891'

    this.imageInput.addEventListener('change', (event) => {
      if (event.target == null || this.imageInput === undefined || this.imageInput.files === null) return

      const file = this.imageInput.files[0]

      if (file !== undefined) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target != null) {
            this.overlayImage.src = String(e.target.result)
          }
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

  setCanvasSize (): void {
    if (this.canvas !== undefined) {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    }
  }

  async setupCamera (): Promise<void> {
    if (this.video === undefined) return

    try {
      const constraints = {
        video: {
          facingMode: { exact: 'environment' }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.video.srcObject = stream

      this.video.addEventListener('loadeddata', () => {
        this.error = 'ok'
        if (this.video !== undefined) {
          void this.video.play()
        }
        // this.canvas.width = this.video.videoWidth;
        // this.canvas.height = this.video.videoHeight;
        requestAnimationFrame(this.updateCanvas)
      })
    } catch (err: any) {
      this.error = err.toString()
      console.error('Error setting up camera:', err)
    }
  }

  drawVideo (): void {
    if (this.context === undefined || this.context === null || this.canvas === undefined || this.video === undefined) return

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

    this.context.drawImage(this.video as CanvasImageSource, xOffset, yOffset, newWidth, newHeight)

    // Draw the overlay image with low opacity and maintain aspect ratio
    const overlayImage = this.overlayImage
    const overlaySizeSlider = this.overlaySizeSlider

    const imgAspectRatio = overlayImage.width / overlayImage.height
    const overlayScale = Number(overlaySizeSlider?.value) / 100
    const imgNewWidth = canvas.width * overlayScale
    const imgNewHeight = imgNewWidth / imgAspectRatio

    const overlayPosition = this.overlayPosition
    const imgXOffset = overlayPosition.x + (canvas.width - imgNewWidth) / 2
    const imgYOffset = overlayPosition.y + (canvas.height - imgNewHeight) / 2

    // Draw the overlay image with low opacity
    this.context.globalAlpha = Number(this.overlayOpacitySlider?.value) / 100 // Set the opacity (0.5 for 50% opacity)
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
