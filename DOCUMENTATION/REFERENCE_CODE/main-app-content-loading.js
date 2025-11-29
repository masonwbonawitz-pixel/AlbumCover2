// EXACT CODE FROM MOBILE/DESKTOP - Content Loading
// Reference this when building React version to ensure identical functionality

// Load content from API on page load
async function loadContent() {
    try {
        const response = await fetch('/api/content');
        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }
        const content = await response.json();
        
        // Populate all content fields
        if (content.title) {
            document.querySelector('.title').textContent = content.title;
        }
        
        if (content.price_subtitle) {
            document.querySelector('.price').textContent = content.price_subtitle;
        }
        
        if (content.upload_image_text) {
            const uploadTextEl = document.querySelector('.upload-text');
            if (uploadTextEl) uploadTextEl.textContent = content.upload_image_text;
        }
        
        if (content.upload_subtext) {
            const uploadSubtextEl = document.querySelector('.upload-subtext');
            if (uploadSubtextEl) uploadSubtextEl.textContent = content.upload_subtext;
        }
        
        if (content.section_upload) {
            const sectionUploadEl = document.querySelector('#section-upload');
            if (sectionUploadEl) sectionUploadEl.textContent = content.section_upload;
        }
        
        if (content.section_grid) {
            const sectionGridEl = document.querySelector('#section-grid');
            if (sectionGridEl) sectionGridEl.textContent = content.section_grid;
        }
        
        if (content.panel_title) {
            const panelTitleEl = document.querySelector('.panel-title');
            if (panelTitleEl) panelTitleEl.textContent = content.panel_title;
        }
        
        if (content.canvas_label) {
            const canvasLabelEl = document.querySelector('.canvas-label');
            if (canvasLabelEl) canvasLabelEl.textContent = content.canvas_label;
        }
        
        // Load all other content fields...
        // (See complete mapping in 09-ADMIN-TO-MAIN-INTEGRATION.md)
        
    } catch (error) {
        console.error('Failed to load content:', error);
        // Use default content on error
    }
}

// Load prices from API
async function loadPrices() {
    try {
        const response = await fetch('/api/prices');
        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }
        const prices = await response.json();
        
        // Store prices globally
        window.prices = prices;
        
        // Update price display
        updatePriceDisplay();
        
    } catch (error) {
        console.error('Failed to load prices:', error);
        // Use default prices on error
        window.prices = {
            '48x48': 29.99,
            '75x75': 48.99,
            '96x96': 59.99,
            'stand': 10.00,
            'wall_mounting_dots': 5.99
        };
    }
}

// Load images from API
async function loadImages() {
    try {
        const response = await fetch('/api/images');
        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }
        const images = await response.json();
        
        // Display stand image
        if (images.stand) {
            const standImg = document.getElementById('stand-image');
            if (standImg) {
                standImg.src = images.stand;
                standImg.style.display = 'block';
            }
        }
        
        // Display mounting dots image
        if (images.wall_mounting_dots) {
            const mountingImg = document.getElementById('mounting-image');
            if (mountingImg) {
                mountingImg.src = images.wall_mounting_dots;
                mountingImg.style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Failed to load images:', error);
    }
}

// Load everything on page load
window.addEventListener('load', async () => {
    await loadContent();
    await loadPrices();
    await loadImages();
});

