// EXACT CODE FROM ADMIN.HTML - Save All Function
// Reference this when building React admin panel to ensure identical functionality

async function saveAll() {
    const btn = document.querySelector('.save-all-button');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        // Verify images are saved (they should already be saved from upload, but verify)
        const imagesResponse = await fetch('/admin/images/api');
        if (!imagesResponse.ok) {
            throw new Error(`Failed to load images: Server returned ${imagesResponse.status} ${imagesResponse.statusText}`);
        }
        const contentType = imagesResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await imagesResponse.text();
            throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`);
        }
        const currentImages = await imagesResponse.json();
        
        // Save prices
        const updatedPrices = {
            '48x48': parseFloat(document.getElementById('admin-price-48x48').value) || 0,
            '75x75': parseFloat(document.getElementById('admin-price-75x75').value) || 0,
            '96x96': parseFloat(document.getElementById('admin-price-96x96').value) || 0,
            'stand': parseFloat(document.getElementById('admin-stand-price').value) || 0,
            'wall_mounting_dots': parseFloat(document.getElementById('admin-mounting-price').value) || 0
        };

        const pricesResponse = await fetch(getApiUrl('/admin/prices/api'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPrices)
        });
        
        if (!pricesResponse.ok) {
            const text = await pricesResponse.text();
            throw new Error(`Failed to save prices: Server returned ${pricesResponse.status} ${pricesResponse.statusText}. ${text.substring(0, 200)}`);
        }
        const pricesContentType = pricesResponse.headers.get('content-type');
        if (!pricesContentType || !pricesContentType.includes('application/json')) {
            const text = await pricesResponse.text();
            throw new Error(`Expected JSON but got ${pricesContentType}. Response: ${text.substring(0, 200)}`);
        }

        // Save text content
        const panelTitleEl = document.getElementById('admin-panel-title-preview');
        const canvasLabelEl = document.getElementById('admin-canvas-label-preview');
        const sectionUploadEl = document.getElementById('admin-section-upload');
        const sectionGridEl = document.getElementById('admin-section-grid');
        const sectionAdjustmentsEl = document.getElementById('admin-section-adjustments');
        const sectionPaintingEl = document.getElementById('admin-section-painting');
        
        // Get existing STL text values from loaded content (since fields are removed from admin)
        const existingStlUploadText = textContent.stl_upload_text || 'Choose STL file...';
        const existingStlSubtext = textContent.stl_subtext || 'Or auto-load from server';
        
        const textContentToSave = {
            title: document.getElementById('admin-title').value,
            price_subtitle: document.getElementById('admin-price-subtitle').value,
            upload_image_text: document.getElementById('admin-upload-text').value,
            upload_subtext: document.getElementById('admin-upload-subtext').value,
            // STL upload fields removed from admin panel - preserve existing values
            stl_upload_text: existingStlUploadText,
            stl_subtext: existingStlSubtext,
            info_title: document.getElementById('admin-info-title').value,
            info_description: document.getElementById('admin-info-description').value,
            info_additional: document.getElementById('admin-info-additional').value,
            howto_title: document.getElementById('admin-howto-title').value,
            howto_content: document.getElementById('admin-howto-content').value,
            // Desktop orange text labels - read from contenteditable elements
            panel_title: panelTitleEl ? panelTitleEl.textContent.trim() : 'Edit Your Photo',
            canvas_label: canvasLabelEl ? canvasLabelEl.textContent.trim() : 'Processed (Posterized)',
            section_upload: sectionUploadEl ? sectionUploadEl.textContent.trim() : '1. Upload Color Image',
            section_grid: sectionGridEl ? sectionGridEl.textContent.trim() : '2. Select Grid Size',
            section_adjustments: sectionAdjustmentsEl ? sectionAdjustmentsEl.textContent.trim() : 'Image Adjustments',
            section_painting: sectionPaintingEl ? sectionPaintingEl.textContent.trim() : 'Painting',
            // Additional editable text fields
            grid_btn_48: document.getElementById('admin-grid-btn-48') ? document.getElementById('admin-grid-btn-48').textContent.trim() : '48 × 48',
            grid_btn_75: document.getElementById('admin-grid-btn-75') ? document.getElementById('admin-grid-btn-75').textContent.trim() : '75 × 75',
            grid_btn_96: document.getElementById('admin-grid-btn-96') ? document.getElementById('admin-grid-btn-96').textContent.trim() : '96 × 96',
            slider_contrast_label: document.getElementById('admin-slider-contrast-label') ? document.getElementById('admin-slider-contrast-label').textContent.trim() : 'Contrast',
            slider_brightness_label: document.getElementById('admin-slider-brightness-label') ? document.getElementById('admin-slider-brightness-label').textContent.trim() : 'Brightness',
            slider_tones_label: document.getElementById('admin-slider-tones-label') ? document.getElementById('admin-slider-tones-label').textContent.trim() : 'Tones',
            label_dimensions: document.getElementById('admin-label-dimensions') ? document.getElementById('admin-label-dimensions').textContent.trim() : 'Dimensions:',
            label_addons: document.getElementById('admin-label-addons') ? document.getElementById('admin-label-addons').textContent.trim() : 'Addons:',
            label_48x48: document.getElementById('admin-label-48x48') ? document.getElementById('admin-label-48x48').textContent.trim() : '48×48:',
            label_75x75: document.getElementById('admin-label-75x75') ? document.getElementById('admin-label-75x75').textContent.trim() : '75×75:',
            label_96x96: document.getElementById('admin-label-96x96') ? document.getElementById('admin-label-96x96').textContent.trim() : '96×96:',
            stand_name: document.getElementById('admin-stand-name') ? document.getElementById('admin-stand-name').textContent.trim() : 'Stand',
            stand_upload_btn: document.getElementById('admin-stand-upload-btn') ? document.getElementById('admin-stand-upload-btn').textContent.trim() : 'Upload Image',
            mounting_name: document.getElementById('admin-mounting-name') ? document.getElementById('admin-mounting-name').textContent.trim() : 'Nano Wall Mounting Dots (Pack of 8)',
            mounting_upload_btn: document.getElementById('admin-mounting-upload-btn') ? document.getElementById('admin-mounting-upload-btn').textContent.trim() : 'Upload Image',
            color_black_title: document.getElementById('admin-color-black-title') ? document.getElementById('admin-color-black-title').textContent.trim() : 'Black',
            color_darkgray_title: document.getElementById('admin-color-darkgray-title') ? document.getElementById('admin-color-darkgray-title').textContent.trim() : 'Dark Gray',
            color_lightgray_title: document.getElementById('admin-color-lightgray-title') ? document.getElementById('admin-color-lightgray-title').textContent.trim() : 'Light Gray',
            color_white_title: document.getElementById('admin-color-white-title') ? document.getElementById('admin-color-white-title').textContent.trim() : 'White'
        };

        const contentResponse = await fetch(getApiUrl('/admin/content/api'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(textContentToSave)
        });
        
        if (!contentResponse.ok) {
            const text = await contentResponse.text();
            throw new Error(`Failed to save content: Server returned ${contentResponse.status} ${contentResponse.statusText}. ${text.substring(0, 200)}`);
        }
        const contentContentType = contentResponse.headers.get('content-type');
        if (!contentContentType || !contentContentType.includes('application/json')) {
            const text = await contentResponse.text();
            throw new Error(`Expected JSON but got ${contentContentType}. Response: ${text.substring(0, 200)}`);
        }

        const pricesResult = await pricesResponse.json();
        const contentResult = await contentResponse.json();

        // Check if images exist
        const hasStandImage = currentImages.stand && currentImages.stand.length > 0;
        const hasMountingImage = currentImages.wall_mounting_dots && currentImages.wall_mounting_dots.length > 0;
        
        let imageStatus = '';
        if (!hasStandImage) {
            imageStatus += ' Stand image not uploaded.';
        }
        if (!hasMountingImage) {
            imageStatus += ' Wall mounting dots image not uploaded.';
        }

        if (pricesResult.success && contentResult.success) {
            if (imageStatus) {
                showStatus('success', 'Prices and content saved successfully!' + imageStatus);
            } else {
                showStatus('success', 'All changes saved successfully! Images are saved and will appear on the website.');
            }
        } else {
            showStatus('error', 'Some changes failed to save');
        }
    } catch (error) {
        showStatus('error', 'Error saving: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save All';
    }
}

function showStatus(type, message) {
    const status = document.getElementById('status-message');
    status.className = `status-message ${type}`;
    status.textContent = message;
    setTimeout(() => {
        status.className = 'status-message';
    }, 5000);
}

