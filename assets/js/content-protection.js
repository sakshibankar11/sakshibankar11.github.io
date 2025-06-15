// content-protection.js - JavaScript protection methods

(function() {
    'use strict';

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showProtectionMessage();
        return false;
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
    document.addEventListener('keydown', function(e) {
        // F12 - Developer Tools
        if (e.keyCode === 123) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Ctrl+Shift+I - Developer Tools
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Ctrl+Shift+J - Console
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Ctrl+U - View Source
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Ctrl+S - Save Page
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Ctrl+A - Select All
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Ctrl+C - Copy
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Ctrl+V - Paste
        if (e.ctrlKey && e.keyCode === 86) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+X - Cut
        if (e.ctrlKey && e.keyCode === 88) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Ctrl+P - Print
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
    });

    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable image drag
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Disable text selection with mouse
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Blur images on right-click attempt
    document.addEventListener('mousedown', function(e) {
        if (e.button === 2 && e.target.tagName === 'IMG') { // Right click
            e.target.classList.add('blurred');
            setTimeout(function() {
                e.target.classList.remove('blurred');
            }, 3000);
        }
    });

    // Detect developer tools opening
    let devtools = {
        open: false,
        orientation: null
    };

    const threshold = 160;

    const detectDevTools = () => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                handleDevToolsOpen();
            }
        } else {
            devtools.open = false;
        }
    };

    const handleDevToolsOpen = () => {
        document.body.style.display = 'none';
        alert('Developer tools detected! Content has been hidden for security.');
        // Optionally redirect to another page
        // window.location.href = 'protection-notice.html';
    };

    // Check every 500ms
    setInterval(detectDevTools, 500);

    // Disable printing
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        showProtectionMessage();
        return false;
    });

    // Show protection message
    function showProtectionMessage() {
        // Create modal-like message
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #000;
                color: #fff;
                padding: 20px 40px;
                border-radius: 8px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                <h3 style="margin: 0 0 10px 0;">Content Protected</h3>
                <p style="margin: 0;">This content is protected by copyright.<br>Unauthorized copying is not permitted.</p>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // Disable image save shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Clear clipboard when copying is attempted
    document.addEventListener('copy', function(e) {
        e.clipboardData.setData('text/plain', '');
        e.preventDefault();
        showProtectionMessage();
    });

    // Detect if page is opened in iframe (prevent embedding)
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // Disable image context menu specifically
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Add blur protection class
            img.classList.add('blur-protection');
        });
    });

    // Monitor for common screenshot tools (limited effectiveness)
    document.addEventListener('keydown', function(e) {
        // Windows Snipping Tool and Print Screen
        if (e.keyCode === 44) { // Print Screen
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
        
        // Alt + Print Screen
        if (e.altKey && e.keyCode === 44) {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
    });

    // Add watermark to images dynamically
    function addWatermarkToImages() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            // Wrap image in container if not already wrapped
            if (!img.parentElement.classList.contains('image-container')) {
                const container = document.createElement('div');
                container.className = 'image-container';
                img.parentNode.insertBefore(container, img);
                container.appendChild(img);
            }
        });
    }

    // Run when page loads
    document.addEventListener('DOMContentLoaded', addWatermarkToImages);

    // Console warning message
    console.clear();
    console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers. Content on this page is protected by copyright.', 'color: red; font-size: 16px;');
    console.log('%cUnauthorized access or copying of content may violate copyright law.', 'color: red; font-size: 16px;');

    // Override console methods to prevent easy inspection
    const originalLog = console.log;
    console.log = function() {
        if (arguments.length > 0 && typeof arguments[0] === 'string') {
            if (!arguments[0].includes('STOP!') && !arguments[0].includes('protected')) {
                return;
            }
        }
        originalLog.apply(console, arguments);
    };

})();