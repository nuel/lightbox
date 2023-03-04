function h (el, className, content) {
  const element = document.createElement(el)
  element.classList.add(className)
  element.innerHTML = content || ''
  return element
}

document.querySelectorAll('.lightbox').forEach((lightbox) => {
  const lightboxContent = h('div', 'lightbox-content')
  const lightboxClose = h('a', 'lightbox-close')
  const lightboxPrev = h('a', 'lightbox-prev')
  const lightboxNext = h('a', 'lightbox-next')
  const lightboxCursor = h('div', 'lightbox-cursor')
  const lightboxImageContainer = h('div', 'lightbox-image-container')
  lightboxContent.appendChild(lightboxImageContainer)
  lightboxContent.appendChild(lightboxClose)
  document.body.appendChild(lightboxContent)

  const state = {
    target: null,
    images: [],
    index: 0,
    offset: 0,
    lastOffset: 0,
    dragging: false,
    originX: 0
  }

  lightbox.addEventListener('click', (event) => {
    event.preventDefault()

    // Search for the target image
    if (event.target.nodeName === 'IMG') {
      state.target = event.target
    } else if (event.target.nodeName === 'A') {
      state.target = event.target.querySelector('img')
    }

    // Couldn't find an image
    if (!state.target) return

    // Get all other images in the lightbox
    state.images = Array.from(lightbox.querySelectorAll('img'))

    // If there's more than one image, show the next/prev buttons
    if (state.images.length > 1) {
      lightboxContent.appendChild(lightboxPrev)
      lightboxContent.appendChild(lightboxNext)
      lightboxContent.appendChild(lightboxCursor)

      // Also set the hover listeners
      lightboxPrev.addEventListener('mousemove', handleHover)
      lightboxNext.addEventListener('mousemove', handleHover)
      lightboxClose.addEventListener('mousemove', handleCloseHover)
    }

    // Add all images in the state to the image container
    state.images.forEach(image => {
      const imageElement = h('div', 'lightbox-image')
      const imageContent = h('img')
      imageContent.src = image.src
      imageContent.addEventListener('dragstart', (e) => e.preventDefault())
      imageElement.appendChild(imageContent)
      lightboxImageContainer.appendChild(imageElement)

      // Sliders:
      imageElement.addEventListener('pointerdown', handleDragPointerDown)
      imageElement.addEventListener('pointerup', endDragAnimationLoop)
      imageElement.addEventListener('pointerleave', endDragAnimationLoop)
      imageElement.addEventListener('pointermove', handleDragMove)
    })

    // Get the index of the clicked image
    state.index = state.images.indexOf(state.target)

    // Use the index to offset the image row
    snapOffset()

    // And finally, show the lightbox
    lightboxContent.style.display = 'flex'
  })

  // Close when clicking the background
  lightboxContent.addEventListener('click', (event) => {
    const target = event.target
    if (/lightbox-content|lightbox-image-container/.test(target.classList)) {
      lightboxContent.style.display = 'none'
    }
  })

  // Close when clicking the close button
  lightboxClose.addEventListener('click', () => {
    lightboxContent.style.display = 'none'
  })

  // Previous and next buttons
  function lightboxShowPrev() {
    state.index--
    if (state.index < 0) {
      state.index = state.images.length - 1
    }
    snapOffset()
  }

  function lightboxShowNext() {
    state.index++
    if (state.index >= state.images.length) {
      state.index = 0
    }
    snapOffset()
  }

  function snapOffset() {
    state.offset = state.index * window.innerWidth
    renderOffset()
  }

  function renderOffset() {
    lightboxImageContainer.style.transform = `translateX(${ -1 * state.offset }px)`       
  }

  function handleDragPointerDown(event) {
    state.dragging = true
    state.originX = event.clientX
    state.lastOffset = state.offset
    dragAnimationLoop()
  }

  function handleDragMove(event) {
    if (state.dragging) {
      state.offset = state.lastOffset - (event.clientX - state.originX)
    }
  }

  function dragAnimationLoop() {
    renderOffset()
    if (state.dragging) window.requestAnimationFrame(dragAnimationLoop)
  }

  function endDragAnimationLoop() {
    state.dragging = false
    state.index = Math.round(state.offset / window.innerWidth)
    if (state.index < 0) state.index = 0
    if (state.index >= state.images.length) state.index = state.images.length - 1
    snapOffset()
  }

  function handleHover(event) {
    lightboxCursor.style.display = 'block'

    window.requestAnimationFrame(() => {
      lightboxCursor.className = 'lightbox-cursor'
      lightboxCursor.classList.add(event.target.className.slice(-4))
      lightboxCursor.style.top = event.y + 'px'
      lightboxCursor.style.left = event.x + 'px'
    })
  }

  function handleCloseHover(event) {
    lightboxCursor.style.display = 'none'
  }

  lightboxPrev.addEventListener('click', lightboxShowPrev)
  lightboxNext.addEventListener('click', lightboxShowNext)

  // Keyboard navigation
  document.addEventListener('keydown', (event) => {
    if (lightboxContent.style.display === 'flex') {
      if (event.key === 'ArrowLeft') {
        lightboxShowPrev()
      } else if (event.key === 'ArrowRight') {
        lightboxShowNext()
      } else if (event.key === 'Escape') {
        lightboxContent.style.display = 'none'
      }
    }
  })

  window.addEventListener('resize', snapOffset)
})

window.oncontextmenu = function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}