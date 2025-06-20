# GTA5-Mods Direct Download

A Tampermonkey userscript that enhances the GTA5-Mods.com download experience by allowing direct downloads without being redirected to intermediate download pages.

## 🚀 Features

- **Stay on the detail page** – No more being redirected to download pages
- **One-click downloads** – Downloads start immediately when you click the download button
- **Background processing** – Uses hidden iframes to fetch download links without navigation
- **Visual feedback** – Real-time notifications show download progress
- **Font Awesome auto-load** – Injects FA icons if missing
- **Debounced DOM handling** – Handles dynamic elements without performance cost
- **Cloudflare safe** – Designed to work with Cloudflare's bot protection
- **Non-intrusive** – Download buttons look completely normal
- **Fallback protection** – Gracefully handles errors by falling back to normal behavior

## 📦 Installation

### Prerequisites
- A browser that supports userscripts (Chrome, Firefox, Edge, etc.)
- [Tampermonkey](https://www.tampermonkey.net/) browser extension

### Steps
1. Install the Tampermonkey browser extension
2. Click the Tampermonkey icon in your browser
3. Select "Create a new script"
4. Replace the default content with the script code
5. Save the script (Ctrl+S)
6. The script will automatically activate on GTA5-Mods.com

## 🎯 How It Works

### Before (Normal Behavior)
1. Visit mod detail page  
2. Click "Download" button  
3. Get redirected to intermediate download page  
4. Click download button again on that page  
5. File finally downloads

### After (With Script)
1. Visit mod detail page  
2. Click "Download" button  
3. File downloads immediately (you stay on the same page!)

## 🛠️ Technical Details

The script works by:

1. **Detecting download buttons** on GTA5-Mods detail pages  
2. **Intercepting clicks** and preventing normal navigation  
3. **Creating a hidden iframe** that loads the intermediate download page  
4. **Extracting the direct file URL** from the loaded page  
5. **Triggering the download** using the direct URL or fallback  
6. **Cleaning up** the iframe and restoring the button

### Key Technologies
- **Hidden iframes** – Load intermediate pages without navigating away
- **Font Awesome auto-injection** – Ensures icons always display properly
- **DOM manipulation** – Enhance buttons and show notifications
- **Promise-based async/await** – Handle asynchronous iframe loading
- **MutationObserver + debounce** – Detect dynamically loaded content efficiently

## 🔧 Configuration

The script works out of the box with no configuration needed. However, you can customize:

- **Notification duration** – Change the timeout in the `showNotification()` function (default: 3 seconds)
- **Iframe load timeout** – Modify the iframe timeout (default: 10 seconds)
- **Loading indicators** – Customize loading and error text/icon inside the click handler

## 🌐 Compatibility

### Supported Sites
- GTA5-Mods.com (all language variants)

### Supported Browsers
- Chrome  
- Firefox  
- Edge  
- Safari (with Tampermonkey)  
- Any browser that supports userscripts

## 🐛 Troubleshooting

### Common Issues

**Script not working?**
- Ensure Tampermonkey is enabled
- Check that the script is active in the Tampermonkey dashboard
- Refresh the GTA5-Mods page

**Downloads not starting?**
- Check browser popup/download blocking settings
- Ensure you're on a mod detail page (not search results)
- Try disabling other browser extensions temporarily

**Cloudflare errors?**
- The script is designed to avoid these, but if they occur:
  - Clear browser cache
  - Wait a few minutes and retry
  - Let the script fall back to opening the intermediate page in a new tab

## 📋 Changelog

### v1.4 - Robust & Optimized Version
- Injects Font Awesome icons if missing
- Adds safer iframe handling with CORS check
- Increases iframe load delay to 3s for reliability
- Adds `window.open()` fallback for download blocking
- Debounces MutationObserver to improve performance
- Adds observer cleanup on unload
- Improves button and notification UI feedback

### v1.3 - Stay-on-Page Version
- Added hidden iframe method for background downloading
- Implemented real-time notifications
- Removed visual button modifications for cleaner look
- Added smart screen boundary detection for notifications

### v1.2 - Cloudflare Safe Version  
- Replaced fetch() with iframe loading to avoid bot detection
- Added auto-click functionality for intermediate pages

### v1.1 - Enhanced Version
- Added visual button enhancements
- Implemented better error handling
- Added dynamic content detection

### v1.0 - Initial Release
- Basic direct download functionality

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs** – Open an issue with details
2. **Suggest features** – Share ideas for improvements
3. **Submit code** – Fork the repo and create a pull request
4. **Test compatibility** – Try the script on different browsers/systems

### Development Setup
1. Fork this repository  
2. Install Tampermonkey  
3. Load the script in development mode  
4. Make changes and test on GTA5-Mods.com  
5. Submit a pull request with your improvements

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This script is for educational and convenience purposes only. It:
- Does not bypass any security measures  
- Does not violate GTA5-Mods.com's terms of service  
- Simply automates normal user interactions  
- Respects all download restrictions and requirements

Use responsibly and in accordance with GTA5-Mods.com's terms of service.

## 🙏 Acknowledgments

- GTA5-Mods.com for providing an excellent modding platform  
- The Tampermonkey team for creating a powerful userscript manager  
- The modding community for inspiration and feedback

## 📞 Support

If you encounter issues or have questions:

1. Check the [Issues](../../issues) section for existing solutions  
2. Create a new issue with:
   - Browser and version  
   - Tampermonkey version  
   - Steps to reproduce the problem  
   - Error messages (if any)

---

**Enjoy seamless mod downloading! 🎮**
