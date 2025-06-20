// ==UserScript==
// @name         GTA5-Mods Direct Download (Stay on Page)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Download directly from detail pages without leaving the page
// @author       xciphertv
// @match        https://www.gta5-mods.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Inject Font Awesome if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
        document.head.appendChild(fa);
    }

    // Debounce helper
    function debounce(func, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    // Get direct download URL from iframe
    function getDirectDownloadUrl(intermediateUrl) {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.width = 1;
            iframe.height = 1;

            const timeout = setTimeout(() => {
                document.body.removeChild(iframe);
                reject(new Error('Timeout while loading iframe'));
            }, 10000);

            iframe.onload = function () {
                setTimeout(() => {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        if (!iframeDoc) throw new Error('Iframe content inaccessible');

                        const directLink = iframeDoc.querySelector('a[href*="files.gta5-mods.com"]');

                        clearTimeout(timeout);
                        document.body.removeChild(iframe);

                        if (directLink) {
                            resolve(directLink.href);
                        } else {
                            reject(new Error('Direct link not found'));
                        }
                    } catch (err) {
                        clearTimeout(timeout);
                        document.body.removeChild(iframe);
                        reject(err);
                    }
                }, 3000);
            };

            iframe.onerror = function () {
                clearTimeout(timeout);
                document.body.removeChild(iframe);
                reject(new Error('Iframe load error'));
            };

            document.body.appendChild(iframe);
            iframe.src = intermediateUrl;
        });
    }

    function triggerDownload(url, filename) {
        try {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || '';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch {
            window.open(url, '_blank');
        }
    }

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
            font-size: 14px;
            line-height: 1.4;
        `;
        notification.innerHTML = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function enhanceDownloadButtons() {
        const downloadButtons = document.querySelectorAll('a.btn-download[href*="/download/"], a[href*="/download/"]:not([href*="files.gta5-mods.com"])');
        downloadButtons.forEach(button => {
            if (button.dataset.enhanced) return;

            const originalHref = button.href;
            if (!originalHref.includes('/download/') || originalHref.includes('files.gta5-mods.com')) return;

            button.dataset.enhanced = 'true';
            const originalText = button.innerHTML;

            button.title = 'Enhanced: Click to download directly without leaving this page';
            button.onclick = null;

            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading...';
                button.style.pointerEvents = 'none';

                try {
                    showNotification('<i class="fa fa-download"></i> Fetching download link...', 'info');
                    const directUrl = await getDirectDownloadUrl(originalHref);
                    const filename = directUrl.split('/').pop();

                    triggerDownload(directUrl, filename);

                    button.innerHTML = '<i class="fa fa-check"></i> Downloaded';
                    showNotification(`<i class="fa fa-check-circle"></i> Download started: ${filename}`, 'success');
                } catch (err) {
                    console.error(err);
                    button.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Fallback...';
                    showNotification('<i class="fa fa-exclamation-triangle"></i> Using fallback method...', 'error');
                    setTimeout(() => window.open(originalHref, '_blank'), 1000);
                } finally {
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.pointerEvents = 'auto';
                    }, 2000);
                }
            });
        });
    }

    function observeChanges() {
        const observer = new MutationObserver(debounce(() => {
            enhanceDownloadButtons();
        }, 250));

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Optional cleanup on unload
        window.addEventListener('beforeunload', () => observer.disconnect());
    }

    function addStatusIndicator() {
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

        setTimeout(() => {
            indicator.style.opacity = '0.7';
        }, 5000);

        indicator.addEventListener('click', () => {
            indicator.remove();
        });
    }

    function init() {
        console.log('[Direct DL] Initializing...');
        const ready = () => {
            enhanceDownloadButtons();
            observeChanges();
            addStatusIndicator();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(ready, 500));
        } else {
            setTimeout(ready, 500);
        }
    }

    init();
})();
