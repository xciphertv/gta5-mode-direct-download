// ==UserScript==
// @name         GTA5-Mods Direct Download (Stay on Page)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Download directly from detail pages without leaving the page
// @author       xciphertv
// @match        https://www.gta5-mods.com/*/
// @match        https://www.gta5-mods.com/*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to get direct download URL using hidden iframe
    function getDirectDownloadUrl(intermediateUrl) {
        return new Promise((resolve, reject) => {
            // Create hidden iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            
            // Set up timeout
            const timeout = setTimeout(() => {
                document.body.removeChild(iframe);
                reject(new Error('Timeout'));
            }, 10000);
            
            iframe.onload = function() {
                try {
                    // Wait a moment for the page to fully load
                    setTimeout(() => {
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            const directLink = iframeDoc.querySelector('a[href*="files.gta5-mods.com"]');
                            
                            clearTimeout(timeout);
                            document.body.removeChild(iframe);
                            
                            if (directLink) {
                                resolve(directLink.href);
                            } else {
                                reject(new Error('Direct link not found'));
                            }
                        } catch (e) {
                            clearTimeout(timeout);
                            document.body.removeChild(iframe);
                            reject(e);
                        }
                    }, 1500);
                } catch (e) {
                    clearTimeout(timeout);
                    document.body.removeChild(iframe);
                    reject(e);
                }
            };
            
            iframe.onerror = function() {
                clearTimeout(timeout);
                document.body.removeChild(iframe);
                reject(new Error('Failed to load iframe'));
            };
            
            document.body.appendChild(iframe);
            iframe.src = intermediateUrl;
        });
    }

    // Function to create and trigger download
    function triggerDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || '';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Function to show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 280px;
            min-width: 200px;
            word-wrap: break-word;
            white-space: normal;
            overflow-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
        `;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        // Ensure it doesn't go off screen
        const rect = notification.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            notification.style.right = '10px';
            notification.style.left = 'auto';
        }
        if (rect.left < 0) {
            notification.style.left = '10px';
            notification.style.right = 'auto';
        }
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Function to enhance download buttons
    function enhanceDownloadButtons() {
        const downloadButtons = document.querySelectorAll('a.btn-download[href*="/download/"], a[href*="/download/"]:not([href*="files.gta5-mods.com"])');
        
        downloadButtons.forEach(button => {
            // Skip if already enhanced
            if (button.dataset.enhanced) {
                return;
            }
            
            const originalHref = button.href;
            
            // Only process links that go to intermediate download pages
            if (!originalHref.includes('/download/') || originalHref.includes('files.gta5-mods.com')) {
                return;
            }
            
            // Mark as enhanced
            button.dataset.enhanced = 'true';
            
            // Store original properties
            const originalText = button.innerHTML;
            const originalOnClick = button.onclick;
            
            // Remove any existing click handlers
            button.onclick = null;
            
            // Add subtle visual enhancement
            button.title = 'Enhanced: Click to download directly without leaving this page';
            
            // Add enhanced click behavior
            button.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Update button state
                button.innerHTML = '<span class="fa fa-spinner fa-spin"></span> Loading...';
                button.style.pointerEvents = 'none';
                
                try {
                    showNotification('<i class="fa fa-download"></i> Fetching download link...', 'info');
                    
                    // Get the direct download URL
                    const directUrl = await getDirectDownloadUrl(originalHref);
                    
                    // Extract filename from URL
                    const filename = directUrl.split('/').pop();
                    
                    // Update button
                    button.innerHTML = '<span class="fa fa-check"></span> Done!';
                    
                    // Start download
                    triggerDownload(directUrl, filename);
                    
                    showNotification(`<i class="fa fa-check-circle"></i> Download started: ${filename}`, 'success');
                    
                    // Restore button after delay
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.pointerEvents = 'auto';
                    }, 2000);
                    
                } catch (error) {
                    console.error('Download error:', error);
                    
                    // Update button to show error
                    button.innerHTML = '<span class="fa fa-exclamation-triangle"></span> Fallback...';
                    
                    showNotification('<i class="fa fa-exclamation-triangle"></i> Using fallback method...', 'error');
                    
                    // Fallback to original behavior
                    setTimeout(() => {
                        window.open(originalHref, '_blank');
                        button.innerHTML = originalText;
                        button.style.pointerEvents = 'auto';
                    }, 1000);
                }
            });
        });
    }

    // Function to observe page changes
    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    const hasNewDownloadButtons = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === 1) {
                            return node.matches && (
                                node.matches('a[href*="/download/"]') || 
                                node.querySelector && node.querySelector('a[href*="/download/"]')
                            );
                        }
                        return false;
                    });
                    
                    if (hasNewDownloadButtons) {
                        setTimeout(enhanceDownloadButtons, 100);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to add script status indicator
    function addStatusIndicator() {
        if (!window.location.href.includes('gta5-mods.com')) return;
        
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 8px 15px;
            border-radius: 25px;
            font-size: 12px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        indicator.innerHTML = '<i class="fa fa-magic"></i> Direct Download Active';
        indicator.title = 'Click to hide';
        document.body.appendChild(indicator);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            indicator.style.opacity = '0.7';
        }, 5000);
        
        // Hide on click
        indicator.addEventListener('click', () => {
            indicator.remove();
        });
    }

    // Initialize
    function init() {
        console.log('GTA5-Mods Stay-on-Page Direct Download script initializing...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    enhanceDownloadButtons();
                    addStatusIndicator();
                    observeChanges();
                }, 500);
            });
        } else {
            setTimeout(() => {
                enhanceDownloadButtons();
                addStatusIndicator();
                observeChanges();
            }, 500);
        }
    }

    // Start the script
    init();

    console.log('GTA5-Mods Stay-on-Page Direct Download script loaded');

})();