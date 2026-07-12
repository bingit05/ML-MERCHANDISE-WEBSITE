<script>
    import { fade } from 'svelte/transition';

    let { data } = $props();

    const product = data.product;

    let activeImageIndex = $state(0);

    function nextImage() {
        if (product.images.length > 0) {
            activeImageIndex =
                (activeImageIndex + 1) %
                product.images.length;
        }
    }

    function prevImage() {
        if (product.images.length > 0) {
            activeImageIndex =
                (activeImageIndex - 1 + product.images.length) %
                product.images.length;
        }
    }
</script>

<!-- Fullscreen Video Layer Container -->
<div class="video-bg-container">
  <!-- Autoplay, loop, and muted combination guarantees endless background execution across browsers -->
  <video 
    src="/bg.mp4" 
    autoplay
    loop 
    muted 
    playsinline>
  </video>
</div>

<div class="dark-overlay"></div>

<div class="navbar">
  <a href="/merchandise" class="back-link">← Back to Products</a>
</div>

{#if product}
  <div class="product-details">
    <div class="carousel-container">
      <div class="image-viewer">
        {#key activeImageIndex}
          <img 
            src={product.images[activeImageIndex]} 
            alt={product.name} 
            transition:fade={{ duration: 300 }} 
          />
        {/key}
        
        {#if product.images.length > 1}
          <button class="nav-btn prev" on:click={prevImage}>❮</button>
          <button class="nav-btn next" on:click={nextImage}>❯</button>
        {/if}
      </div>
      
      <div class="dots">
        {#each product.images as _, index}
          <span class="dot" class:active={index === activeImageIndex}></span>
        {/each}
      </div>
      <div class="availability">
    {#if product.state}
        <span class="available">● Available</span>
    {:else}
        <span class="not-available">● Not Available</span>
    {/if}
</div>
    </div>

    <div class="info">
      <h1>{product.name}</h1>
      <p class="price">{product.price}</p>
      <p class="description">Exclusive Machine Learning NITS club merchandise.</p>
      <a href="/order/{product.id}" class="buy-btn">Buy Now</a>
    </div>


  </div>

  
{:else}
  <div class="error-msg">
    <h2>Oops! Product not found.</h2>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    min-height: 100vh;
    color: white;
    font-family: sans-serif;
    position: relative;
    background-color: #0c0c0c; /* Fallback */
    overflow-x: hidden;
  }

  /* Fullscreen Video Placement */
  .video-bg-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -2; 
    overflow: hidden;
  }
  
  .video-bg-container video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6; /* Static optimal visibility */
  }

  /* Global Tint Overlay for text legibility over moving imagery */
  .dark-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
    pointer-events: none;
  }

  .back-link {
    display: inline-block;
    margin: 20px;
    color: rgb(200, 50, 12);
    text-decoration: none;
  }

  /* Glassmorphic product layout interface wrapper */
  .product-details {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: rgba(20, 20, 20, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;

    display: flex;
    gap: 50px;

    padding: 30px;
    max-width: 1200px;
    width: calc(100% - 40px);
    margin: 20px auto;
    box-sizing: border-box;
}

/* Large tablets */
@media (max-width: 1200px) {
    .product-details {
        max-width: 1000px;
        gap: 35px;
        padding: 25px;
    }
}

/* Tablets */
@media (max-width: 900px) {
    .product-details {
        flex-direction: column;
        gap: 25px;
        padding: 20px;
        width: calc(100% - 30px);
    }
}

/* Mobile */
@media (max-width: 600px) {
    .product-details {
        gap: 20px;
        padding: 15px;
        border-radius: 12px;
        width: calc(100% - 20px);
    }
}

/* Small phones */
@media (max-width: 400px) {
    .product-details {
        padding: 12px;
        gap: 15px;
        border-radius: 10px;
    }
}
  .carousel-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .image-viewer {
    position: relative;
    width: 100%;
    height: 450px; 
    border-radius: 20px;
    overflow: hidden;
    background: #111;
  }

  .image-viewer img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .nav-btn {
    z-index: 10;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    font-size: 1.5rem;
    padding: 12px 18px;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.2s, color 0.2s;
  }

  .nav-btn:hover { background: #e87d0a; }
  .prev { left: 15px; }
  .next { right: 15px; }

  .dots { display: flex; justify-content: center; gap: 8px; }
  .dot { width: 10px; height: 10px; background: #555; border-radius: 50%; transition: background 0.3s; }
  .dot.active { background: #e87d0a; width: 12px; }

  .info { flex: 1; }
  h1 { color: rgb(200, 50, 12); font-size: 2.5rem; margin-top: 0; }
  .price { font-size: 1.5rem; color: #e87d0a; font-weight: bold; }

  .buy-btn {
    display: inline-block;
    text-decoration: none;
    background: #e87d0a;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }
  .buy-btn:hover { background: blueviolet; }

  .error-msg { text-align: center; margin-top: 50px; }
  .navbar { background-color: transparent; }
  .navbar a { text-decoration: none; color:rgb(200, 50, 12); position: relative; padding-bottom: 5px; }
  
  .navbar a::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 3px;
    background-color: rgb(200, 50, 12);
    transition: width 0.3s ease;
  }
  .navbar a:hover::after { width: 100%; }

  .availability{

    font-size: x-large;
    color:red;
    font-style:italic;
    display: inline-block;
    animation: jump 0.8s infinite ease-in-out;

  }


@keyframes jump {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}
</style>