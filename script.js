// Xtension Download Script - SIMPLIFIED HTTPS VERSION
// Fixed for mixed content and null reference issues

(function() {
    'use strict';

    console.log('🚀 Xtension Download Script - HTTPS VERSION');

    // Configuration - Fixed HTTPS
    const CONFIG = {
        serverUrl: 'https://77.90.51.74:8080',
        endpoint: '/api/generate-download-url',
        timeout: 20000,
        retryAttempts: 2
    };

    let isDownloading = false;

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
        // We'll use console.log instead of modal to avoid DOM issues
    }

    // Main download function - simplified
    async function startDownload() {
        if (isDownloading) {
            console.log('⚠️ Already downloading...');
            return;
        }

        isDownloading = true;
        console.log('🚀 Starting download process...');

        try {
            showLoading('Connecting to server...');

            // Generate download URL
            console.log('📡 Making API call to:', CONFIG.serverUrl + CONFIG.endpoint);

            const response = await fetch(CONFIG.serverUrl + CONFIG.endpoint, {
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
                errorMessage = 'Cannot connect to server. The server may be down or not supporting HTTPS. Please try again later.';
            } else if (error.message.includes('Mixed Content')) {
                errorMessage = 'Security error: Server must use HTTPS. Please contact administrator.';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'CORS error: Server configuration issue. Please contact administrator.';
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

    // Setup event listeners - SIMPLE VERSION
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
        console.log('🚀 Initializing application...');

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

            console.log('✅ Application initialized successfully');
            console.log('💡 Available commands: startDownload(), testDownload()');

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

    console.log('📄 Xtension Download Script loaded successfully - HTTPS VERSION');

})();
