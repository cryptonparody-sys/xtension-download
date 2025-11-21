// Xtension Download Script - CACHE-BUSTING VERSION v2.0
// Force browser to load new version

(function() {
    'use strict';

    console.log('🚀 Xtension Download Script - CACHE-BUSTING VERSION v2.0');

    // Configuration - HTTPS ONLY (no HTTP fallback)
    const CONFIG = {
        serverUrl: 'https://77.90.51.74:8080',
        endpoint: '/api/generate-download-url',
        timeout: 20000,
        retryAttempts: 2
    };

    let isDownloading = false;

    // Clear any cached versions
    if (window.XtensionDownloadLoaded) {
        console.warn('⚠️ XtensionDownload already loaded, clearing cache...');
        // Remove old event listeners
        const oldBtn = document.getElementById('downloadBtn');
        if (oldBtn) {
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.parentNode.replaceChild(newBtn, oldBtn);
        }
    }
    window.XtensionDownloadLoaded = true;

    // Simple alert-based modal to avoid DOM issues
    function showAlert(title, message, type = 'info') {
        console.log(`📢 ${title}: ${message}`);

        if (type === 'error') {
            alert(`❌ ${title}\n\n${message}\n\nPlease refresh the page and try again.`);
        } else if (type === 'success') {
            alert(`✅ ${title}\n\n${message}\n\nCheck your Downloads folder.`);
        } else {
            alert(`ℹ️ ${title}\n\n${message}`);
        }
    }

    // Show loading
    function showLoading(message) {
        console.log('⏳', message);
    }

    // Main download function
    async function startDownload() {
        if (isDownloading) {
            console.log('⚠️ Already downloading...');
            return;
        }

        isDownloading = true;
        console.log('🚀 Starting download process...');

        try {
            showLoading('Connecting to server...');

            // Construct HTTPS URL
            const apiUrl = CONFIG.serverUrl + CONFIG.endpoint;
            console.log('📡 Making HTTPS API call to:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({
                    timestamp: Date.now()
                })
            });

            console.log('📡 Server response status:', response.status);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📡 Server response:', data);

            if (data.success && data.downloadUrl) {
                showLoading('Downloading file...');

                // Download the file
                await downloadFile(data.downloadUrl);

                // Show success
                showAlert('Download Successful!',
                    'Your Xtension.crx file has been downloaded.\n\nTo install:\n1. Click the downloaded file\n2. Click "Keep" if Chrome warns\n3. Click "Install extension"\n4. Click "Add extension"\n\n⚠️ Chrome warnings are normal for custom extensions.',
                    'success');

                isDownloading = false;

            } else {
                throw new Error(data.error || 'Invalid server response');
            }

        } catch (error) {
            console.error('❌ Error:', error);
            isDownloading = false;

            // Handle different types of errors
            let errorMessage = error.message;

            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Cannot connect to server: https://77.90.51.74:8080\n\nThis usually means:\n1. Server is down\n2. Server does not have HTTPS/SSL certificate\n3. Firewall blocking the connection\n\nPlease contact administrator to set up HTTPS on the server.';
            } else if (error.message.includes('Mixed Content')) {
                errorMessage = 'Security error: Browser blocked HTTP request from HTTPS page.\n\nThe server at 77.90.51.74:8080 needs an SSL certificate for HTTPS.';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'CORS error: Server needs to allow GitHub Pages.\n\nServer must include: Access-Control-Allow-Origin: https://cryptonparody-sys.github.io';
            } else if (error.name === 'TypeError' && error.message.includes('null')) {
                errorMessage = 'Page error. Please refresh the page and try again.';
            }

            showAlert('Download Failed', errorMessage, 'error');
        }
    }

    // Download file function
    function downloadFile(url) {
        return new Promise((resolve) => {
            console.log('📥 Downloading file from:', url);

            try {
                // Create download link
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Xtension.crx';
                link.style.display = 'none';

                // Trigger download
                document.body.appendChild(link);
                link.click();

                // Clean up
                setTimeout(() => {
                    if (link.parentNode) {
                        link.parentNode.removeChild(link);
                    }
                }, 100);

                console.log('✅ Download initiated successfully');

                // Give Chrome time to start download
                setTimeout(resolve, 2000);

            } catch (error) {
                console.error('❌ Error downloading file:', error);
                resolve(); // Continue even if download fails
            }
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        console.log('🔧 Setting up event listeners...');

        try {
            // Download button
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                console.log('✅ Download button found');

                // Remove all existing event listeners
                const newDownloadBtn = downloadBtn.cloneNode(true);
                downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);

                // Add click event listener
                newDownloadBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Download button clicked!');
                    startDownload();
                });

                // Add onclick fallback
                newDownloadBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Download button onclick fallback!');
                    startDownload();
                    return false;
                };

                console.log('✅ Event listeners attached successfully');

            } else {
                console.error('❌ Download button not found!');
                showAlert('Error', 'Download button not found. Please refresh the page.', 'error');
            }

        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
            showAlert('Setup Error', 'Failed to setup page controls. Please refresh the page.', 'error');
        }
    }

    // Initialize application
    function init() {
        console.log('🚀 Initializing Xtension Download v2.0...');

        try {
            // Check if download button exists
            const downloadBtn = document.getElementById('downloadBtn');
            if (!downloadBtn) {
                console.log('⏳ Download button not ready, retrying...');
                setTimeout(init, 500);
                return;
            }

            console.log('✅ Download button found, setting up...');

            // Setup event listeners
            setupEventListeners();

            // Make functions globally available
            window.startDownload = startDownload;
            window.testDownload = function() {
                console.log('🧪 Testing download function...');
                startDownload();
            };

            console.log('✅ Xtension Download v2.0 initialized successfully');
            console.log('💡 Available commands: startDownload(), testDownload()');
            console.log('🔧 Server URL:', CONFIG.serverUrl);

            // Show version info in console
            console.log('📦 Version: 2.0 (Cache-Busting)');
            console.log('⏰ Loaded at:', new Date().toISOString());

            // Auto-test after 2 seconds
            setTimeout(() => {
                console.log('🧪 Auto-testing download button...');
                const testBtn = document.getElementById('downloadBtn');
                if (testBtn) {
                    console.log('✅ Download button is ready for use!');
                }
            }, 2000);

        } catch (error) {
            console.error('❌ Error during initialization:', error);
            setTimeout(init, 1000);
        }
    }

    // Start when DOM is ready with multiple fallbacks
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Multiple fallback initializations
    setTimeout(init, 100);
    setTimeout(init, 500);
    setTimeout(init, 1000);

    console.log('📄 Xtension Download Script v2.0 loaded successfully');

})();
