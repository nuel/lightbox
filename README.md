# lightbox

Idk, I needed a really simple lightbox so I made one. Includes keyboard navigation and support for multiple images.

License: WTFPL

## usage

Add `lightbox.css` and `lightbox.js` to the page. Place images inside a `<div>` with the class `.lightbox`.

### single image

```
<div class="lightbox">
  <a href="img/1.jpg">
    <img src="img/1.jpg" alt="One">
  </a>
</div>
```

### multiple images

```
<div class="lightbox">
  <a href="img/1.jpg"><img src="img/1.jpg" alt="One"></a>
  <a href="img/2.jpg"><img src="img/2.jpg" alt="Two"></a>
  <a href="img/3.jpg"><img src="img/3.jpg" alt="Three"></a>
</div>
```

Note: images do not have to be in an `<a>` tag linking to the same image, but I recommend doing it this way so users without JavaScript have a fallback.