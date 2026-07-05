<script>
  import { products } from '$lib/data';
  
  // Track which image index is active for each product
  let activeIndices = $state(products.map(() => 0));

  // Store active intervals for each product index so we can clear them safely
  let hoverIntervals = {};

  
  // Start cycling images when hovering
  function startCycling(productIndex) {
    // Prevent creating duplicate intervals
    if (hoverIntervals[productIndex]) return;

    hoverIntervals[productIndex] = setInterval(() => {
      activeIndices[productIndex] = (activeIndices[productIndex] + 1) % products[productIndex].images.length;
    }, 800); // Changes image every 800ms. You can adjust this speed!
  }

  // Stop cycling images when the mouse leaves
  function stopCycling(productIndex) {
    if (hoverIntervals[productIndex]) {
      clearInterval(hoverIntervals[productIndex]);
      delete hoverIntervals[productIndex];
    }
    // Optional: Reset back to the first image when the user stops hovering
    activeIndices[productIndex] = 0;
  }

 
</script>






<main>
  <div class="navbar">
    <div class="head">
      <img src="logo.CQbV2B4E.png" id="logo" alt="logo">
      <h1>Machine Learning NITS</h1>
    </div>
    
    <ul class="options">
      <li><a href="xxx.com" class="details">Home</a></li>
      <li><a href="xxx.com" class="details">Products</a></li>
      <li><a href="xxx.com" class="details">Members</a></li>
      <li><a href="xxx.com" class="details">Resources</a></li>
      <li><a href="xxx.com" class="details">Contact</a></li>
    </ul>
  </div>

  <div class="hero-title">
  <h1 class="ml-title">ML CLUB</h1>
  <div class="subtitle-wrap">
    <span class="line"></span>
    <h2>PRODUCTS</h2>
    <span class="line"></span>
  </div>
</div>

  <div class="product-grid">
    {#each products as product, i}
      <!-- Changed from on:click to mouseenter/mouseleave events -->
      <div 
        class="card" 
        on:mouseenter={() => startCycling(i)}
        on:mouseleave={() => stopCycling(i)}
      >
        <img src={product.images[activeIndices[i]]} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        
        <a href="/products/{product.id}" class="check">
          check
        </a>
      </div>
    {/each}
  </div>
</main>

<style>

  .hero-title {
  text-align: center;
  margin: 50px 0;
  padding: 100px;
}

.ml-title {
  font-size: 8rem;
  font-weight: 900;
  letter-spacing: 10px;
  margin: 0;

  color: transparent;
  -webkit-text-stroke: 3px #e5d0c1;

  text-shadow:
    0 0 10px #ff6a00,
    0 0 20px #ff6a00,
    0 0 40px #e4d5cf,
    0 0 80px #ffffff;
    
  animation: glow 2s infinite alternate;
}

.subtitle-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.subtitle-wrap h2 {
  color: #ff884d;
  letter-spacing: 12px;
  font-size: 2rem;
  margin: 0;
  text-shadow: 0 0 10px #ff6a00;
}

.line {
  width: 150px;
  height: 3px;
  background: linear-gradient(to right, transparent, #ff6a00, transparent);
  box-shadow: 0 0 20px #ff6a00;
}

@keyframes glow {
  from {
    text-shadow:
      0 0 10px #ff6a00,
      0 0 20px #ff6a00,
      0 0 40px #ff4500;
  }

  to {
    text-shadow:
      0 0 20px #ff6a00,
      0 0 40px #ff6a00,
      0 0 80px #ff3300;
  }
}
  :global(body) {
    margin: 0;
    min-height: 100vh;
    color: white;
    font-family: sans-serif;
    position: relative;
    background-color: #0c0c0c;
    overflow-x: hidden;
    

  }

  
  .head {
    display: flex;
    align-items: center;
    color: rgb(200, 50, 12);
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 100px;
  }
  
  .card {
    border: 1px solid #e9874a;
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    background: rgba(20, 20, 20, 0.4);
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgb(223, 104, 6);
  }

  .card img {
    width: 100%;
    height: 270px;
    object-fit: cover;
    border-radius: 4px;
  }

  .options {
    display: flex;
    list-style: none;
    align-items: center;
    gap: 20px;
    padding: 0 20px;
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
    z-index:2;
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

  .check {
    display: block;
    text-align: center;
    margin-top: 10px;
    padding: 10px;
    background: rgb(200, 50, 12);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .check:hover {
    background: grey;
  }

  .head2 {
    display: flex;
    align-items: center;
    justify-content: center; 
    margin: 20px 0;
  }

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
</style>