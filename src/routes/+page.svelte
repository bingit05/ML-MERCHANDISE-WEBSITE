<script>
    import { products } from '$lib/data';
    const anglePerItem = 360 / products.length;
    const radius = 450;
</script>

<main>
  <div class="navbar">
    <div class="head">
      <img src="/logo.CQbV2B4E.png" id="logo" alt="logo">
      <h1>Machine Learning NITS</h1>
    </div>
    
    <ul class="options">
      <li><a href="xxx.com" class="details">Home</a></li>
      <li><a href="/merchandise" class="details">Products</a></li>
      <li><a href="xxx.com" class="details">Members</a></li>
      <li><a href="xxx.com" class="details">Resources</a></li>
      <li><a href="xxx.com" class="details">Contact</a></li>
    </ul>
  </div>

  <div class="shop-container">
    <h1>OFFICIAL PAGE FOR ML CLUB MERCHANDISE</h1>

    <!-- The 3D Viewport wrapper -->
    <div class="scene">
        <!-- The automatically rotating carousel core -->
        <div class="carousel">
            
            <!-- FIX 1: The Bot is back inside the carousel container so it matches the 3D tilt, -->
            <!-- but its CSS animation forces it to remain facing front dynamically! -->
            <img src="/MLBOT.png" alt="bot" class="perfect-center-bot">

            {#each products as product, i (product.id)}
                <div 
                    class="product-card"
                    style:transform="rotateY({i * anglePerItem}deg) translateZ({radius}px)"
                >
                    <div class="image-container">
                        <img src={product.images[0]} alt={product.name} loading="lazy" />
                    </div>
                </div>
            {/each}
        </div>
    </div>
  </div> 
  <div class="container">

  <a href="/merchandise" class="check"> watchout</a>


</div>

<footer>ml club all rights reserved</footer>

</main>

<style>
	.container {
    text-align: center;
}

.check {
    display: inline-block;
    padding: 12px 24px;
    background: #ff6200;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 16px;
}

  .navbar {
    position: fixed;
    display:flex;
    width:100%;
    justify-content: space-between;
    gap: 20px;
    backdrop-filter: blur(30px);
    padding: 5px;
    border-radius: 20px;
    z-index:100;
  }

  .options{
    display: flex;
    align-items: center;
    gap:20px;
    list-style: none;
  }
  .options li {
    position: relative;
  }

  .options a {
    text-decoration: none;
    color: rgb(200, 50, 12);
    position: relative;
    padding-bottom: 5px;
  }

  .options a::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 3px;
    background-color: rgb(200, 50, 12);
    transition: width 0.3s ease;
  }

  .options a:hover {
    color:#e9874a;
  }

  .options a:hover::after {
    width: 100%;
  }

  #logo {
    width: 150px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }

  .head {
    display: flex;
    align-items: center;
    color: rgb(200, 50, 12);
  }

  :global(body) {
        background-color: #0b0b0b;
        color: #f5f5f5;
        font-family: system-ui, -apple-system, sans-serif;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }

    .shop-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 100px;
        box-sizing: border-box;
    }

    .shop-container h1 {
        font-size: 2.5rem;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-bottom: 2rem;
        text-align: center;
    }

    /* 1. The 3D Stage Environment */
    .scene {
        width: 280px;
        height: 380px;
        perspective: 2000px; 
        position: relative;
        margin-top: 50px;
    }

    /* 2. The Auto-Rotating Ring */
    .carousel {
        width: 100%;
        height: 100%;
        position: absolute;
        transform-style: preserve-3d;
        animation: spinCarousel 25s infinite linear;
    }

    .carousel:hover {
        animation-play-state: paused;
    }

    /* FIX 2: Absolute center alignment + Counter-rotation animation */
    .perfect-center-bot {
        position: absolute;
        width: 600px; /* Big scale size */
        height: 500px;
        
        left: 50%;
        top: 50%;
        
        /* Center it perfectly using negative margins instead of transform, 
           leaving the transform property free for the animation engine */
        margin-left: -275px; /* Exactly half of width (550 / 2) */
        margin-top: -275px;  /* Adjust based on your asset height aspect ratio */
        
        pointer-events: none;
        transform-style: preserve-3d;
        
        /* This animation runs counter to the ring rotation to keep it looking completely still */
        animation: holdBotStill 25s infinite linear;
    }
    
    /* Synchronize the pause state */
    .carousel:hover .perfect-center-bot {
        animation-play-state: paused;
    }

    /* 3. Individual Product Cards on the Ring */
    .product-card {
        position: absolute;
        width: 210px;
        height: 200px;
        
        left: 50%;
        top: 50%;
        margin-left: -65px; 
        margin-top: -100px; 
        
        background: #141414;
        border: 1px solid #222;
        border-radius: 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
        
        backface-visibility: visible; 
        transition: border-color 0.3s, box-shadow 0.3s;
    }

    .product-card:hover {
        border-color: #00ff87;
        box-shadow: 0 0 25px rgba(0, 255, 135, 0.2);
    }

    .image-container {
        width: 100%;
        height: 100%;
        border-radius: 14px;
        overflow: hidden;
        background: #1a1a1a;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* 4. Infinite CSS Animation Formulas */
    @keyframes spinCarousel {
        from { transform: rotateX(-10deg) rotateY(0deg); }
        to { transform: rotateX(-10deg) rotateY(360deg); }
    }

    /* FIX 3: Counter-rotation keyframes. 
       When the ring rotates clockwise, this rotates the bot counter-clockwise by the exact same value. 
       This keeps it locked directly in place visually while retaining the exact same center pivot coordinates. */
    @keyframes holdBotStill {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(-360deg); }
    }
</style>