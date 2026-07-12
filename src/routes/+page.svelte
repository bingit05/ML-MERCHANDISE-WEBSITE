<script>
    // 1. Accept the server data prop
    let { data } = $props(); 
    
    // 2. Derive your products and angles from the data prop safely
    const products = data.products;
    const anglePerItem = 360 / products.length;
    const radius = 450;

    let menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
    }
</script>

<!-- Your UI can now use 'products' to render the circular items safely -->

<main>
  <div class="navbar">
  <div class="head">
    <!-- Moved inside head but with explicit structural priority -->
    <button 
      class="hamburger" 
      on:click={toggleMenu} 
      type="button"
      aria-label="Menu"
    >
        <span></span>
        <span></span>
        <span></span>
    </button>

    <img src="/logo.CQbV2B4E.png" id="logo" alt="logo">
    <h1>Machine Learning NITS</h1>
  </div>

  <ul class:show={menuOpen} class="options">
    <li><a href="/" on:click={() => menuOpen = false}>Home</a></li>
    <li><a href="/merchandise" on:click={() => menuOpen = false}>Products</a></li>
    <li><a href="/" on:click={() => menuOpen = false}>Members</a></li>
    <li><a href="/" on:click={() => menuOpen = false}>Resources</a></li>
    <li><a href="/" on:click={() => menuOpen = false}>Contact</a></li>
  </ul>
</div>

  <div class="shop-container">
    <h1>OFFICIAL PAGE FOR ML CLUB MERCHANDISE</h1>

    <!-- The 3D Viewport wrapper -->
    <div class="scene">
        <!-- The automatically rotating carousel core -->
        <div class="carousel">
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

  <footer>
    <div class="ending">
        <h4>unoffcial ML CLUB website built for learning purpose</h4>
    </div>
  </footer>
</main>

<style>
.hamburger {
    display: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
}

@media(max-width:768px) {
    .head {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: flex-start; /* Keeps items lined up left */
        gap: 10px;
        position: relative;
    }

    .hamburger {
        display: flex !important; /* Force override */
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        cursor: pointer;
        padding: 15px;
        background: transparent;
        border: none;
        
        
        position: relative;
        z-index: 99999; 
        pointer-events: auto; 
    }

    .hamburger span {
        width: 28px;
        height: 3px;
        background: #ff6200;
        border-radius: 10px;
        display: block;
    }

    /* Target the links layout only on mobile */
    .navbar .options {
        display: none;
        position: absolute;
        top: 100%;
        right: 15px;
        width: 220px;
        background: #111;
        border-radius: 15px;
        padding: 15px;
        flex-direction: column;
        gap: 15px;
        box-shadow: 0 10px 25px rgba(0,0,0,.5);
        z-index: 9999;
    }

    /* Explicitly show it ONLY when menuOpen is true */
    .navbar .options.show {
        display: flex !important; 
    }

    .head h1 {
        font-size: 1.1rem;
    }
    
    #logo {
        width: 70px;
        height: 50px;
    }

    .scene {
        transform: scale(0.55);
        margin-top: 20px;
    }

    .shop-container {
        padding: 40px 10px;
    }
}

.ending {
    text-align: center;
    font-size: medium;
    color: #ff6200;
}

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
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 20px;
    backdrop-filter: blur(30px);
    padding: 5px;
    border-radius: 20px;
    z-index: 100;
    box-sizing: border-box;
}

.options {
    display: flex;
    align-items: center;
    gap: 20px;
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
    color: #e9874a;
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

/* The 3D Stage Environment */
.scene {
    width: 280px;
    height: 380px;
    perspective: 2000px; 
    position: relative;
    margin-top: 50px;
}

/* The Auto-Rotating Ring */
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

/* Centering adjustment (exact half of elements properties width/height) */
.perfect-center-bot {
    position: absolute;
    width: 600px; 
    height: 500px;
    left: 50%;
    top: 50%;
    margin-left: -300px; 
    margin-top: -250px;  
    pointer-events: none;
    transform-style: preserve-3d;
    animation: holdBotStill 25s infinite linear;
}

.carousel:hover .perfect-center-bot {
    animation-play-state: paused;
}

/* Individual Product Cards on the Ring */
.product-card {
    position: absolute;
    width: 210px;
    height: 250px;
    left: 50%;
    top: 50%;
    margin-left: -105px; 
    margin-top: -125px; 
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
    border-color: #ff5100;
    box-shadow: 0 10px 20px rgb(223, 104, 6);
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

@keyframes spinCarousel {
    from { transform: rotateX(-10deg) rotateY(0deg); }
    to { transform: rotateX(-10deg) rotateY(360deg); }
}

@keyframes holdBotStill {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(-360deg); }
}
</style>