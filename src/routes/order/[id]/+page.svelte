<script>
    import { enhance } from '$app/forms';
    
    let { data, form } = $props();

    let isOtpSent = $state(false);
    let lockedEmail = $state('');
    let fullName = $state('');
    let quantity = $state(1);
    let size = $state('');
    let address = $state('');

    // Safely fallback to 0 if the product hasn't loaded yet
    let numericPrice = $derived(data.product?.price ? Number(data.product.price.replace(/[^0-9.]/g, '')) : 0);
    let estimatedTotal = $derived(numericPrice * quantity);

    $effect(() => {
        if (form?.otpSent) {
            isOtpSent = true;
            lockedEmail = form.email; 
        }
    });
</script>



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

<main class="checkout-wrapper">
    {#if data.product}
        <div class="product-header">
            <h2>Checkout: {data.product.name}</h2>
            <p class="price-tag">Unit Price: {data.product.price}</p>
        </div>

        <div class="product-preview">
            <img src={data.product.images?.[0]} alt={data.product.name} width="120" />
        </div>
    {:else}
        <p>Loading your order configuration...</p>
    {/if}

    <hr />

    {#if form?.orderPlaced}
        <div class="status-card success">
            <h3>🎉 Order Confirmed!</h3>
            <p>Your receipt and package details are processing.</p>
            <p><strong>Order ID:</strong> {form.orderId}</p>
        </div>
    {:else}
        <form method="POST" action="?/sendOtp" use:enhance class:hidden={isOtpSent}>
            <h3>1. Delivery Information</h3>
            
            <label>
                Full Name
                <input type="text" name="fullName" bind:value={fullName} required />
            </label>

            <label>
                Email Address
                <input type="email" name="email" required />
            </label>

            <div class="form-row">
                <label class="flex-1">
                    Size
                    <select name="size" bind:value={size} required>
                        <option value="" disabled selected>Select size</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </label>

                <label class="flex-1">
                    Quantity
                    <input type="number" name="quantity" bind:value={quantity} min="1" required />
                </label>
            </div>

            <label>
                Shipping Address
                <textarea name="address" rows="3" bind:value={address} placeholder="Street address, apartment, city, state, ZIP" required></textarea>
            </label>

            <div class="total-bar">
                <strong>Est. Total: ${estimatedTotal}</strong>
            </div>

            <button type="submit">Send Email Verification Code</button>
        </form>

        <form method="POST" action="?/verifyAndOrder" use:enhance class:hidden={!isOtpSent}>
            <h3>2. Verification Required</h3>
            <p>A verification string was sent to <strong>{lockedEmail}</strong>.</p>
            
            <!-- Hidden inputs ensure all state data passes cleanly on OTP verification form submit -->
            <input type="hidden" name="email" value={lockedEmail} />
            <input type="hidden" name="fullName" value={fullName} />
            <input type="hidden" name="quantity" value={quantity} />
            <input type="hidden" name="size" value={size} />
            <input type="hidden" name="address" value={address} />

            <label>
                Enter 6-Digit OTP
                <input type="text" name="otp" placeholder="000000" maxlength="6" class="otp-input" required />
            </label>

            <button type="submit" class="confirm-btn">Confirm OTP & Place Order</button>
        </form>
    {/if}

    {#if form?.message}
        <div class="status-card error">
            <p>{form.message}</p>
        </div>
    {/if}
</main>

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
    .checkout-wrapper { max-width: 500px; margin: 2rem auto; padding: 2rem; border: 1px solid #ea7c0e; border-radius: 8px; font-family: sans-serif; background-color: #06090b; }
    .product-header { display: flex; justify-content: space-between; align-items: center; }
    .price-tag { color: #2b7a78; font-weight: bold; font-size: 1.2rem; }
    .product-preview { text-align: center; margin: 1rem 0; }
    .product-preview img { border-radius: 4px; object-fit: cover; }
    form { display: flex; flex-direction: column; gap: 1.2rem; }
    label { display: flex; flex-direction: column; gap: 0.4rem; font-weight: 500; }
    input, select, textarea { padding: 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; font-family: inherit; }
    textarea { resize: vertical; }
    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }
    .otp-input { text-align: center; font-size: 1.5rem; letter-spacing: 0.2rem; }
    button { padding: 0.8rem; background-color: #d7650e; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    button:hover { background-color: #2b7a78; }
    .confirm-btn { background-color: #2b7a78; }
    .confirm-btn:hover { background-color: #3aafa9; }
    .total-bar { margin: 0.5rem 0; font-size: 1.2rem; }
    .status-card { padding: 1rem; border-radius: 6px; text-align: center; margin-top: 1rem; }
    .status-card.success { background-color: #def2f1; color: #17252a; border: 1px solid #3aafa9; }
    .status-card.error { background-color: #ffdde1; color: #c0392b; border: 1px solid #e74c3c; }
    .hidden { display: none; }
</style>