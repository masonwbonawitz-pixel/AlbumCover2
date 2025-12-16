# Complete Guide: Adding Your Builder App to Shopify Navigation Menu

## 📖 What This Guide Does

This guide will help you add a button/link in your Shopify store's navigation menu (like the "Design Your Own!" button on stereohoare.com) that opens your builder app. You don't need to know any coding - we'll walk through everything step by step.

---

## 🎯 What You're Going to Do

You're going to add a menu item in your Shopify store that says something like "Design Your Own!" or "Custom Builder" that, when clicked, opens your builder app. There are several ways to do this:

1. **Option 1: Simple Link (EASIEST - Start Here!)** - Just add a link that opens your app
2. **Option 2: App Proxy (More Professional)** - Makes your app appear as part of your store
3. **Option 3: Embedded in Product Page (What stereohoare.com Uses!)** - Create a product and embed your builder in that product's page
4. **Option 4: Embedded in Regular Page** - Creates a regular page that shows your app

**Based on stereohoare.com's implementation, I recommend Option 3** - it's what they use and it works great for custom builders!

---

## 🔍 How stereohoare.com Does It (Option 3)

Looking at stereohoare.com's setup:
- They have a "Design Your Own!" menu item in their navigation
- That menu item links to: `https://stereohoare.com/products/custom-mosaic-builder-cg-dev`
- This is a **product page** (notice `/products/` in the URL)
- The builder is embedded directly in that product page
- Customers can customize and add to cart right from the product page

This is the **Option 3: Embedded in Product Page** approach, which is perfect for custom builders!

---

## ✅ What You Need Before Starting

1. **Your builder app must be online and working**
   - It should be accessible at a URL like: `https://your-builder-app.com` or `https://your-app.herokuapp.com`
   - It must use HTTPS (the "s" in https://) - Shopify requires this
   - You should be able to open it in a web browser and it should work

2. **Access to your Shopify Admin**
   - You need to be able to log into your Shopify store's admin panel
   - You need permission to edit the store's navigation menu and product pages

3. **Shopify API Keys - DO YOU NEED THEM?**
   - **Option 1 (Simple Link)**: ❌ NO API keys needed - just your app URL
   - **Option 2 (App Proxy)**: ✅ YES - You need Admin API access token and API secret key (instructions included)
   - **Option 3 (Embedded in Product Page - Recommended!)**: ❌ NO API keys needed - just your app URL
   - **Option 4 (Embedded in Regular Page)**: ❌ NO API keys needed - just your app URL

**Good News:** If you're using Option 3 (like stereohoare.com), you don't need any API keys! You just need your app's URL.

---

## 🚀 OPTION 1: Simple Link (EASIEST - Recommended to Start!)

This is the simplest way. You just add a link in your menu that points to your app. When customers click it, they'll go to your app (either in the same window or a new tab).

### Step 1: Make Sure Your App is Online

1. Open a web browser (Chrome, Firefox, Safari, etc.)
2. Type your app's URL in the address bar (like `https://your-app.com`)
3. Press Enter
4. **Make sure your app loads and works!** If it doesn't work here, it won't work from Shopify either.

**✅ Checkpoint:** Your app should load in the browser. If it doesn't, you need to fix that first before continuing.

### Step 2: Log Into Shopify Admin

1. Go to `https://your-store-name.myshopify.com/admin` (replace "your-store-name" with your actual store name)
2. Log in with your Shopify account
3. You should see the Shopify admin dashboard

### Step 3: Go to Navigation Settings

1. In the left sidebar, look for **"Online Store"** and click it
2. You'll see a menu appear. Click on **"Navigation"**
3. You should now see a page that says "Menus" at the top

### Step 4: Edit Your Main Menu

1. You'll see a list of menus. Look for one called **"Main menu"** (this is usually the menu at the top of your store)
2. Click on **"Main menu"** to open it
3. You'll see a list of existing menu items (like "Home", "Products", "About Us", etc.)

### Step 5: Add Your New Menu Item

1. Look for a button that says **"Add menu item"** or **"Add link"** and click it
2. A form will appear with two fields:
   - **Name**: This is what customers will see in the menu
   - **Link**: This is where the link goes

3. **Fill in the Name field:**
   - Type something like: `Design Your Own!` or `Custom Builder` or `Create Your Own`
   - This is what will appear in your store's navigation menu

4. **Fill in the Link field:**
   - Click in the Link field
   - You'll see a dropdown that says something like "Search or paste a link"
   - Click on **"Web address"** or **"URL"** (the exact text depends on your Shopify version)
   - Now paste your app's full URL (like `https://your-builder-app.com`)
   - Make sure to include the `https://` part!

5. **Click "Add"** or **"Save"** (the button might be at the bottom of the form)

### Step 6: Save the Menu

1. After adding your menu item, you should see it in the list of menu items
2. You can drag it up or down to change its position in the menu
3. **Click "Save menu"** at the top or bottom of the page
4. You should see a message saying the menu was saved

### Step 7: Test It!

1. Go to your actual store (not the admin). You can do this by:
   - Clicking "View your store" in the top right of the admin, OR
   - Going to `https://your-store-name.myshopify.com` in a new browser tab
2. Look at the navigation menu at the top of your store
3. You should see your new menu item (like "Design Your Own!")
4. **Click on it!**
5. Your app should open (either in the same tab or a new tab, depending on your theme)

**✅ Success!** If your app opens and works, you're done with Option 1!

### Making It Open in a New Tab (Optional)

If you want the app to open in a new tab instead of the same tab, you'll need to edit your theme code. This is a bit more advanced, but here's how:

1. In Shopify Admin, go to **Online Store** → **Themes**
2. Find your active theme and click **"Actions"** → **"Edit code"**
3. Look for a file called `header.liquid` or `navigation.liquid` in the **Sections** or **Snippets** folder
4. Find the line that creates your menu link (it will have your menu item name in it)
5. Look for something like `<a href="...">` and add `target="_blank"` to it, so it looks like: `<a href="..." target="_blank">`
6. Save the file
7. Test again - now it should open in a new tab

**⚠️ Warning:** Only do this if you're comfortable editing code. If you're not sure, it's fine to leave it as-is - the app will still work!

---

## 🎨 OPTION 3: Embedded in Product Page (What stereohoare.com Uses!)

This is the approach stereohoare.com uses! You create a product in Shopify, and embed your builder directly in that product's page. This is great because:
- Customers can customize and add to cart on the same page
- It feels like a natural part of your store
- You can set pricing and variants for the product
- It's SEO-friendly

### Step 1: Create a Product in Shopify

1. In Shopify Admin, go to **Products** → **Add product**
2. **Title**: Enter something like `Custom Album Cover Builder` or `Design Your Own Mosaic`
3. **Description**: Write a description of what customers can do (optional but recommended)
4. **Pricing**: Set a base price (you can adjust this later)
5. **Inventory**: You can set this to "Don't track inventory" if you're making custom items
6. **Don't save yet!** We'll add more in the next steps

### Step 2: Create Product Variants (Optional but Recommended)

If you have different sizes or options, create variants:

1. In the product page, scroll down to **"Variants"**
2. Click **"Add variant"** or **"Add options"**
3. Create variants for your different options (like grid sizes):
   - Example: Option name: "Grid Size"
   - Values: "32×32", "48×48", "64×64", "96×96"
4. Set different prices for each variant if needed
5. **Save the product** (click "Save" at the top)

### Step 3: Get Your Product URL

1. After saving, look at the URL in your browser's address bar
2. It will look like: `https://your-store.myshopify.com/admin/products/1234567890`
3. The number at the end is your Product ID - **write this down!**
4. Your product's public URL will be: `https://your-store.myshopify.com/products/your-product-handle`
   - The "handle" is usually based on your product title (lowercase, with dashes)

### Step 4: Edit Your Product Template

1. In Shopify Admin, go to **Online Store** → **Themes**
2. Find your active theme and click **"Actions"** → **"Edit code"**
3. Look in the **Templates** folder for `product.liquid` (or `product.json` if it's a JSON template)
4. **Before editing, make a backup!** Copy the file or download it first

### Step 5: Add the Builder Embed Code

You need to add code to embed your builder. The exact location depends on your theme, but here's the general approach:

**For Liquid templates (product.liquid):**

Find where the product description is shown (usually around `{{ product.description }}`), and add this code:

```liquid
{% comment %}
  Custom Builder Embed - Add this where you want the builder to appear
{% endcomment %}

<div id="album-builder-container" style="margin: 40px 0; width: 100%;">
  <iframe 
    id="album-builder-iframe"
    src="https://your-builder-app.com"
    style="width: 100%; min-height: 800px; border: none;"
    allow="camera; microphone; fullscreen"
    loading="lazy"
  ></iframe>
</div>

<script>
  // Configure API URL for the embedded app
  window.addEventListener('message', function(event) {
    // Handle messages from iframe if needed
    if (event.data.type === 'builder-ready') {
      console.log('Builder is ready');
    }
  });
  
  // Set API URL when iframe loads
  document.getElementById('album-builder-iframe').addEventListener('load', function() {
    const iframe = this.contentWindow;
    iframe.postMessage({
      type: 'config',
      apiUrl: 'https://your-api-domain.com'  // CHANGE THIS to your API URL
    }, 'https://your-builder-app.com');
  });
</script>
```

**Important:** Replace:
- `https://your-builder-app.com` with your actual builder app URL
- `https://your-api-domain.com` with your actual API/backend URL

**For JSON templates (product.json):**

If your theme uses JSON templates, you'll need to create a custom section. This is more advanced - you might want to get help from a developer for this.

### Step 6: Position the Builder

You can place the builder:
- **Above the product form** (before "Add to Cart" button) - Good for showing customization first
- **Below the product form** (after "Add to Cart" button) - Good if you want product info first
- **Replace the product description** - If you want the builder to be the main focus

**To position it above the form:**
- Find `{% form 'product' %}` in your product template
- Add the builder code **before** this line

**To position it below the form:**
- Find `{% endform %}` in your product template
- Add the builder code **after** this line

### Step 7: Add the Menu Item

1. Go to **Online Store** → **Navigation**
2. Click on **"Main menu"**
3. Click **"Add menu item"**
4. **Name**: Enter `Design Your Own!` (or whatever you want)
5. **Link**: Click the dropdown and select **"Products"**, then select the product you just created
6. Click **"Add"** then **"Save menu"**

### Step 8: Test It!

1. Go to your store (not admin)
2. Click on your new menu item ("Design Your Own!")
3. You should see your product page with the builder embedded in it
4. The builder should load and work
5. Customers can customize and add to cart on the same page!

**✅ Success!** This is exactly how stereohoare.com does it!

---

## 🔧 OPTION 2: App Proxy (More Professional)

This option makes your app appear as if it's part of your Shopify store. Instead of going to `https://your-app.com`, customers will go to `https://your-store.com/apps/album-builder`. This looks more professional and keeps customers on your store's domain.

### ✅ Can You Do This? Quick Answer:

**YES, if:**
- ✅ You're the store owner (you have all permissions automatically)
- ✅ You're staff/collaborator AND the store owner has given you app development permissions

**NO, if:**
- ❌ You're staff/collaborator and don't have permissions (but you can get them - see below!)

**Not sure?** Follow the steps below to check and get permissions if needed.

### 🔐 Do You Have the Right Permissions? (Check This First!)

**Quick Check:**
1. Log into your Shopify admin
2. Go to **Settings** → **Apps and sales channels**
3. Do you see a button that says **"Develop apps"** or **"Manage private apps"**?
   - ✅ **YES** - You have permissions! You can proceed.
   - ❌ **NO** - You need to get permissions (see below)

**Are You the Store Owner?**
- ✅ **YES** - You automatically have ALL permissions! You can create apps, assign API scopes, and get access tokens. Skip to "What You Need for Option 2" below.
- ❌ **NO** - You're a staff member or collaborator. You need the store owner to grant you permissions.

### 📋 How to Get Permissions (If You're Staff/Collaborator)

If you don't see the "Develop apps" option, follow these steps:

**Step 1: Contact the Store Owner**
Send them this message (you can copy and paste):

```
Hi! I need to set up a custom app for our Shopify store to integrate our builder tool. 
Could you please grant me permission to:
- Create custom apps
- Assign API scopes
- Access API credentials

You can do this by going to:
Settings → Users and permissions → [My Name] → Edit permissions
Then enable "Apps and channels" permissions.

Thanks!
```

**Step 2: Store Owner Grants Permissions**
The store owner needs to:
1. Go to **Settings** → **Users and permissions**
2. Find your name in the list
3. Click on your name → **"Edit permissions"**
4. Look for **"Apps and channels"** or **"App development"** section
5. Enable these permissions:
   - ✅ Create custom apps
   - ✅ Manage app settings
   - ✅ Access API credentials
6. Click **"Save"**

**Step 3: Verify You Have Permissions**
1. Log out and log back into Shopify admin
2. Go to **Settings** → **Apps and sales channels**
3. You should now see **"Develop apps"** button
4. If you see it, you're good to go! ✅

**Alternative: Ask Store Owner to Create the App**
If you can't get permissions, you can ask the store owner to:
1. Create the app themselves (following the steps below)
2. Share the API credentials with you (securely - use a password manager or encrypted message)
3. You can then use those credentials in your backend

### What You Need for Option 2

1. **A Shopify Store** - You or the app user you're working with has created a Shopify store
2. **Proper Permissions** - You can see "Develop apps" in Settings → Apps and sales channels (see above if you can't)
3. Your app must be online and working (same as Option 1)
4. You need to configure your backend server to handle App Proxy requests

### Step 1: Create a Shopify App

**Before you start:** Make sure you can see the "Develop apps" option. If you can't, follow the permission steps above.

1. In Shopify Admin, go to **Settings** (bottom of left sidebar)
2. Click on **"Apps and sales channels"**
3. Click on **"Develop apps"** (you might need to click "Allow custom app development" first if you see that)
4. Click **"Create an app"**
5. Enter a name like: `Album Builder App`
6. Enter your email address
7. Click **"Create app"**

### Step 2: Configure App Proxy

1. In your new app's settings, look for **"App Proxy"** in the left sidebar and click it
2. You'll see a form with these fields:
   - **Subpath prefix**: Type `apps` (just the word "apps", nothing else)
   - **Subpath**: Type `album-builder` (or whatever you want - this will be part of the URL)
   - **Proxy URL**: Paste your app's full URL here (like `https://your-builder-app.com`)

3. **Click "Save"**

**Important:** After saving, your app will be accessible at:
`https://your-store-name.myshopify.com/apps/album-builder`

### Step 3: Configure API Scopes (Permissions)

Before you can get your access tokens, you need to set what permissions (scopes) your app needs:

1. In your app settings, look for **"Configuration"** or **"API scopes"** in the left sidebar
2. Click on **"Configure Admin API scopes"** or **"Configure API scopes"**
3. Select the scopes your app needs. For App Proxy, you typically need:
   - `read_products` - To read product information
   - `write_orders` - To create orders (if your app creates orders)
   - `read_orders` - To read order information
   - `write_files` - To upload files (if your app uploads files)
4. Click **"Save"**

**Note:** The scopes you select determine what your access token can do. Only select the scopes you actually need for security.

### Step 4: Get Your API Credentials (Access Tokens)

1. Still in your app settings, click on **"API credentials"** in the left sidebar
2. You'll see:
   - **Admin API access token**: Click **"Install app"** if you see that button first (this generates the token based on your selected scopes), then copy this token
   - **API secret key**: Click **"Reveal token once"** to see it, then copy it immediately (you won't be able to see it again!)

3. **Save these somewhere safe!** You'll need them for your backend server.
   - The **Admin API access token** is what your app uses to authenticate with Shopify
   - The **API secret key** is used to verify that requests are coming from Shopify (for security)

### Step 5: Update Your Backend Server

Your backend server needs to verify that requests are coming from Shopify. This is a security feature.

**You'll need to give these credentials to your developer or add them to your server:**

- `SHOPIFY_API_SECRET` = The API secret key you just copied
- `SHOPIFY_STORE_URL` = Your store URL (like `your-store-name.myshopify.com`)
- `SHOPIFY_ACCESS_TOKEN` = The Admin API access token you just copied (if your backend needs to make API calls)

Your developer will need to add code to verify Shopify's signature on incoming requests. This is important for security!

**About Access Tokens:**
- Access tokens are used to authenticate your app with Shopify's API
- They're tied to the API scopes (permissions) you selected in Step 3
- Keep them secure - never share them publicly or commit them to public code repositories

### Step 6: Add the Menu Item

1. Go to **Online Store** → **Navigation** (same as Option 1, Step 3)
2. Click on **"Main menu"**
3. Click **"Add menu item"**
4. **Name**: Enter `Design Your Own!` (or whatever you want)
5. **Link**: Instead of your app's full URL, enter: `/apps/album-builder`
   - **Important:** Start with a forward slash `/` and use the subpath you set in Step 2
6. Click **"Add"** then **"Save menu"**

### Step 7: Test It!

1. Go to your store (not admin)
2. Click on your new menu item
3. You should be taken to `https://your-store-name.myshopify.com/apps/album-builder`
4. Your app should load, but the URL will show your store's domain!

**✅ Success!** If it works, your app now appears as part of your store!

---

## 📄 OPTION 4: Embedded in Regular Page (Hybrid Approach)

This creates a regular page on your Shopify store that shows your app inside it. It's like Option 3, but uses a regular page instead of a product page.

### Step 1: Create a New Page

1. In Shopify Admin, go to **Online Store** → **Pages**
2. Click **"Add page"**
3. **Title**: Enter something like `Design Your Own` or `Custom Builder`
4. **Content**: We'll add code here in the next step
5. **Visibility**: Make sure it's set to "Visible" (not hidden)
6. **Don't save yet!** We need to add code first.

### Step 2: Add the Embed Code

1. In the page editor, look for a button that says **"Show HTML"** or **"</>"** (code icon) and click it
2. This switches the editor to HTML mode
3. Delete any existing content
4. Paste this code:

```html
<div style="width: 100%; height: 100vh; border: none;">
  <iframe 
    src="https://your-builder-app.com" 
    style="width: 100%; height: 100vh; border: none;"
    allow="camera; microphone; fullscreen"
  ></iframe>
</div>
```

5. **Replace `https://your-builder-app.com`** with your actual app URL
6. Click **"Save"**

### Step 3: Add the Menu Item

1. Go to **Online Store** → **Navigation**
2. Click on **"Main menu"**
3. Click **"Add menu item"**
4. **Name**: Enter `Design Your Own!`
5. **Link**: Click the dropdown and select **"Pages"**, then select the page you just created
6. Click **"Add"** then **"Save menu"**

### Step 4: Test It!

1. Go to your store
2. Click on your new menu item
3. You should see a page that shows your app embedded in it
4. The app should work normally!

**✅ Success!** Your app is now embedded in a Shopify page!

---

## 🐛 Troubleshooting

### Problem: Menu item doesn't appear

**Solutions:**
- Make sure you clicked "Save menu" after adding the item
- Check that your theme is using the "Main menu" - some themes use different menu names
- Try refreshing your browser (Ctrl+F5 or Cmd+Shift+R)
- Clear your browser cache

### Problem: Link doesn't work / Shows error

**Solutions:**
- Make sure your app URL is correct (test it in a browser first)
- Make sure your app uses HTTPS (not HTTP)
- Check that your app is actually online and working
- Look at your browser's error console (F12) for specific error messages

### Problem: App loads but looks broken

**Solutions:**
- Your app might not be designed to work when embedded - try Option 1 instead
- Check if your app needs specific settings or configurations
- Make sure your app's CSS/styles are loading correctly
- Check if your app needs to be configured to work in an iframe

### Problem: "Access Denied" or security errors

**Solutions:**
- Make sure your app URL uses HTTPS
- If using App Proxy (Option 2), check that your backend is verifying Shopify signatures correctly
- Check your server logs for specific error messages
- Your app might have iframe restrictions - check your app's security settings

### Problem: Menu item appears but in wrong position

**Solutions:**
- In the Navigation settings, you can drag menu items up and down to reorder them
- Drag your new item to where you want it
- Click "Save menu"

### Problem: Builder doesn't appear on product page

**Solutions:**
- Make sure you saved the product template after adding the code
- Check that you're viewing the correct product
- Clear your browser cache
- Check the browser console (F12) for errors
- Make sure the iframe code is in the right place in the template

---

## 📋 Quick Checklist

Use this to make sure you've done everything:

### For Option 1 (Simple Link):
- [ ] My app is online and working at a URL
- [ ] I can access my Shopify admin
- [ ] I added a menu item in Navigation → Main menu
- [ ] I entered a name for the menu item
- [ ] I entered my app's full URL (with https://)
- [ ] I saved the menu
- [ ] I tested it on my store and it works!

### For Option 3 (Embedded in Product Page - Like stereohoare.com):
- [ ] My app is online and working
- [ ] I created a product in Products → Add product
- [ ] I set up product variants (optional)
- [ ] I edited my product template (product.liquid)
- [ ] I added the iframe embed code with my app URL
- [ ] I saved the product template
- [ ] I added a menu item linking to the product
- [ ] I tested it and the builder appears on the product page!

### For Option 2 (App Proxy):
- [ ] My app is online and working
- [ ] I created a Shopify app in Settings → Apps and sales channels
- [ ] I configured App Proxy with subpath prefix "apps" and a subpath
- [ ] I set the Proxy URL to my app's URL
- [ ] I got my API credentials (access token and secret key)
- [ ] I configured my backend server to verify Shopify signatures
- [ ] I added a menu item pointing to `/apps/my-subpath`
- [ ] I tested it and it works!

### For Option 4 (Embedded in Regular Page):
- [ ] My app is online and working
- [ ] I created a new page in Online Store → Pages
- [ ] I added the iframe code with my app URL
- [ ] I saved the page
- [ ] I added a menu item linking to that page
- [ ] I tested it and it works!

---

## 🎨 Customizing the Menu Item

### Changing the Name

1. Go to **Online Store** → **Navigation**
2. Click on **"Main menu"**
3. Find your menu item and click on it to edit
4. Change the name
5. Click **"Save menu"**

### Changing the Position

1. In the Navigation settings, find your menu item
2. Click and drag it up or down
3. You can also indent it to make it a submenu item (drag it to the right)
4. Click **"Save menu"**

### Removing the Menu Item

1. In Navigation settings, find your menu item
2. Click the trash icon or "Remove" button next to it
3. Click **"Save menu"**

---

## 🔒 Security Notes

- **Always use HTTPS** for your app URL (not HTTP)
- If using App Proxy, make sure your backend verifies Shopify's request signatures
- Don't share your API credentials publicly
- Keep your Shopify admin password secure
- If embedding in an iframe, make sure your app allows iframe embedding (check your app's security headers)

---

## 📞 Need Help?

If you're stuck:

1. **Check the Troubleshooting section** above
2. **Test your app URL directly** in a browser - if it doesn't work there, it won't work from Shopify
3. **Check your browser's console** (press F12, click "Console" tab) for error messages
4. **Check your server logs** if you have access to them
5. **Contact your developer** if you have one - they can help with the technical parts

---

## 🎉 You're Done!

Once your menu item is working, customers can click it to access your builder app directly from your Shopify store, just like stereohoare.com does with their "Design Your Own!" button!

**Remember:** 
- **Option 3 (Embedded in Product Page)** is what stereohoare.com uses - it's great for custom builders!
- Start with **Option 1** if you want the simplest setup
- You can always upgrade to a more integrated approach later

---

## 📝 Quick Reference: Where to Find Things in Shopify

- **Navigation Menu**: Online Store → Navigation
- **Products**: Products → Add product
- **Pages**: Online Store → Pages
- **Themes**: Online Store → Themes
- **Edit Theme Code**: Online Store → Themes → Actions → Edit code
- **Apps**: Settings → Apps and sales channels → Develop apps
- **App Proxy**: Settings → Apps and sales channels → [Your App] → App Proxy
- **API Credentials**: Settings → Apps and sales channels → [Your App] → API credentials

---

## 🔑 API Keys & Credentials Summary

Here's a quick reference for what you need for each option:

### Option 1: Simple Link
**Required:**
- ✅ Your app's public URL (e.g., `https://your-app.com`)
- ❌ NO Shopify API keys needed

### Option 2: App Proxy
**Required:**
- ✅ Your app's public URL
- ✅ **Proper permissions** to create custom apps and assign API scopes
- ✅ **Admin API access token** (from Shopify app settings - generated after selecting API scopes)
- ✅ **API secret key** (from Shopify app settings)
- ✅ **Store URL** (e.g., `your-store.myshopify.com`)

**⚠️ CHECK PERMISSIONS FIRST:**
- **Are you the store owner?** → ✅ You have all permissions automatically! Skip to step 2.
- **Are you staff/collaborator?** → Check if you can see "Develop apps" button:
  - ✅ **YES** - You have permissions! Proceed to step 2.
  - ❌ **NO** - You need permissions. See the "How to Get Permissions" section above for detailed instructions on asking the store owner.

**Where to get them:**
1. **First, make sure you have permissions** (see check above)
2. Go to Shopify Admin → Settings → Apps and sales channels → Develop apps
3. Create an app (or use existing)
4. **Configure API scopes** (permissions) - select what your app needs access to
5. Go to API credentials tab
6. Click "Install app" to generate the Admin API access token (based on your selected scopes)
7. Copy the Admin API access token
8. Click "Reveal token once" to see the API secret key (save it immediately - you can't see it again!)

**Important:** The access token is tied to the API scopes you selected. If you need different permissions later, you'll need to update the scopes and regenerate the token.

### Option 3: Embedded in Product Page (Recommended - Like stereohoare.com)
**Required:**
- ✅ Your app's public URL (e.g., `https://your-app.com`)
- ✅ Your backend/API URL (if your app needs to connect to a backend)
- ❌ NO Shopify API keys needed for basic embedding

**Note:** If you want your builder to add items to Shopify cart programmatically, you might need Storefront API access, but that's optional and separate from this setup.

### Option 4: Embedded in Regular Page
**Required:**
- ✅ Your app's public URL (e.g., `https://your-app.com`)
- ❌ NO Shopify API keys needed

---

**Last Updated:** This guide covers Shopify's interface as of 2024. If your Shopify admin looks different, the features are still there - they might just be in a slightly different location.

