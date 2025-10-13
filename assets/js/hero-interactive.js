// Interactive 3D geometric shapes that react to mouse movement
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('#banner.modern-hero');
    
    if (!heroSection) return;
    
    // Create container for interactive 3D shapes
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'interactive-shapes';
    shapesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        pointer-events: none;
        overflow: hidden;
        perspective: 1500px;
    `;
    
    // Define modern 3D geometric shapes
    const shapes = [
        // Large pentagon - top center
        { 
            size: 160, 
            top: '15%', 
            left: '50%', 
            translateX: '-50%',
            type: 'pentagon',
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
        },
        // Large triangle - bottom left
        { 
            size: 180, 
            top: '70%', 
            left: '18%', 
            type: 'triangle',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        },
        // Medium star - middle right
        { 
            size: 140, 
            top: '40%', 
            right: '15%', 
            type: 'star',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        },
        // Large parallelogram - top right corner
        { 
            size: 150, 
            top: '8%', 
            right: '5%', 
            type: 'parallelogram',
            clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'
        },
        // Medium trapezoid - bottom right
        { 
            size: 130, 
            top: '65%', 
            right: '8%', 
            type: 'trapezoid',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
        },
        // Large rounded square - middle center-left
        { 
            size: 170, 
            top: '45%', 
            left: '25%', 
            type: 'roundedSquare',
            clipPath: null // Will use border-radius
        }
    ];
    
    shapes.forEach((shapeData, index) => {
        const shape = document.createElement('div');
        shape.className = `shape-3d shape-${index}`;
        shape.dataset.shapeIndex = index;
        
        const size = shapeData.size;
        
        shape.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
            border: 2px solid rgba(255, 255, 255, 0.15);
            ${shapeData.clipPath ? 'clip-path: ' + shapeData.clipPath + ';' : 'border-radius: 28px;'}
            box-shadow: 
                0 0 60px rgba(255, 255, 255, 0.12),
                inset 0 0 40px rgba(255, 255, 255, 0.04);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            ${shapeData.top ? 'top: ' + shapeData.top + ';' : ''}
            ${shapeData.left ? 'left: ' + shapeData.left + ';' : ''}
            ${shapeData.right ? 'right: ' + shapeData.right + ';' : ''}
            ${shapeData.translateX ? 'transform: translateX(' + shapeData.translateX + ');' : ''}
            animation: float3DShape${index} ${10 + index * 2}s ease-in-out infinite;
            animation-delay: ${index * 0.8}s;
            transform-style: preserve-3d;
            backdrop-filter: blur(2px);
        `;
        
        shapesContainer.appendChild(shape);
    });
    
    heroSection.appendChild(shapesContainer);
    
    // Add dynamic animation keyframes for each shape
    const styleSheet = document.createElement('style');
    let keyframesCSS = '';
    
    shapes.forEach((_, index) => {
        keyframesCSS += `
            @keyframes float3DShape${index} {
                0%, 100% { 
                    transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
                    opacity: 0.7;
                }
                33% { 
                    transform: translate3d(${-15 + index * 5}px, ${-20 - index * 3}px, ${40 + index * 10}px) 
                               rotateX(${15 + index * 5}deg) 
                               rotateY(${10 + index * 5}deg) 
                               rotateZ(${index * 10}deg);
                    opacity: 1;
                }
                66% { 
                    transform: translate3d(${10 - index * 3}px, ${-10 + index * 2}px, ${30 + index * 5}px) 
                               rotateX(${-10 - index * 3}deg) 
                               rotateY(${-15 + index * 3}deg) 
                               rotateZ(${-index * 8}deg);
                    opacity: 0.85;
                }
            }
        `;
    });
    
    styleSheet.textContent = keyframesCSS;
    document.head.appendChild(styleSheet);
    
    // Enhanced mouse interaction with 3D transforms
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let animationFrameId = null;
    
    heroSection.addEventListener('mouseenter', function() {
        isHovering = true;
        startMouseTracking();
    });
    
    heroSection.addEventListener('mouseleave', function() {
        isHovering = false;
        cancelAnimationFrame(animationFrameId);
        
        // Smoothly reset all shapes
        const allShapes = shapesContainer.querySelectorAll('.shape-3d');
        allShapes.forEach(shape => {
            shape.style.transform = '';
            shape.style.opacity = '';
            shape.style.borderColor = '';
            shape.style.boxShadow = '';
        });
    });
    
    heroSection.addEventListener('mousemove', function(e) {
        if (!isHovering) return;
        
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    function startMouseTracking() {
        if (!isHovering) return;
        
        const rect = heroSection.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const allShapes = shapesContainer.querySelectorAll('.shape-3d');
        
        allShapes.forEach((shape, index) => {
            const shapeRect = shape.getBoundingClientRect();
            const shapeCenterX = shapeRect.left + shapeRect.width / 2 - rect.left;
            const shapeCenterY = shapeRect.top + shapeRect.height / 2 - rect.top;
            
            // Calculate vector from mouse to shape center
            const deltaX = mouseX - shapeCenterX;
            const deltaY = mouseY - shapeCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Maximum interaction distance
            const maxDistance = 400;
            const strength = Math.max(0, 1 - distance / maxDistance);
            
            if (strength > 0) {
                // 3D parallax movement - shapes move away from cursor
                const moveX = -deltaX * strength * 0.4;
                const moveY = -deltaY * strength * 0.4;
                const moveZ = strength * 80; // Depth effect
                
                // 3D rotation based on mouse position
                const rotateX = (deltaY / rect.height) * strength * 25;
                const rotateY = -(deltaX / rect.width) * strength * 25;
                const rotateZ = ((deltaX - deltaY) / rect.width) * strength * 15;
                
                // Scale effect
                const scale = 1 + (strength * 0.25);
                
                // Brightness and glow
                const opacity = 0.7 + (strength * 0.3);
                const borderOpacity = 0.15 + (strength * 0.25);
                const glowIntensity = 60 + (strength * 80);
                const glowOpacity = 0.12 + (strength * 0.2);
                
                // Apply 3D transform
                shape.style.transform = `
                    translate3d(${moveX}px, ${moveY}px, ${moveZ}px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    rotateZ(${rotateZ}deg)
                    scale(${scale})
                `;
                
                // Apply visual effects
                shape.style.opacity = opacity;
                shape.style.borderColor = `rgba(255, 255, 255, ${borderOpacity})`;
                shape.style.boxShadow = `
                    0 0 ${glowIntensity}px rgba(255, 255, 255, ${glowOpacity}),
                    inset 0 0 ${40 + strength * 30}px rgba(255, 255, 255, ${0.04 + strength * 0.06})
                `;
            }
        });
        
        animationFrameId = requestAnimationFrame(startMouseTracking);
    }
    
    // Add subtle parallax effect to the entire section
    heroSection.addEventListener('mousemove', function(e) {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        shapesContainer.style.transform = `
            rotateY(${x * 2}deg) 
            rotateX(${-y * 2}deg)
        `;
    });
    
    heroSection.addEventListener('mouseleave', function() {
        shapesContainer.style.transform = '';
    });
});
