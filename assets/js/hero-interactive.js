// Large sophisticated 3D shapes that react to mouse movement
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('#banner.modern-hero');
    
    if (!heroSection) return;
    
    // Create container for interactive shapes
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
        overflow: visible;
        perspective: 2500px;
    `;
    
    // Define 2 sophisticated shapes - positioned around edges, clearly visible
    const shapes = [
        // Triangle - left edge, 60% visible
        { 
            size: 385, 
            top: '35%', 
            left: '-40%',
            type: 'triangle',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            rotation: -35
        },
        // Square - bottom edge, 60% visible
        { 
            size: 336, 
            bottom: '-35%', 
            right: '15%',
            type: 'square',
            clipPath: null,
            rotation: 20
        }
    ];
    
    shapes.forEach((shapeData, index) => {
        const shape = document.createElement('div');
        shape.className = `shape-3d massive-shape-${index}`;
        shape.dataset.shapeIndex = index;
        
        const size = shapeData.size;
        
        shape.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(${135 + index * 45}deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
            border: 3px solid rgba(255, 255, 255, 0.16);
            ${shapeData.clipPath ? 'clip-path: ' + shapeData.clipPath + ';' : 'border-radius: 45px;'}
            box-shadow: 
                0 0 120px rgba(255, 255, 255, 0.15),
                inset 0 0 100px rgba(255, 255, 255, 0.05);
            transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            ${shapeData.top ? 'top: ' + shapeData.top + ';' : ''}
            ${shapeData.bottom ? 'bottom: ' + shapeData.bottom + ';' : ''}
            ${shapeData.left ? 'left: ' + shapeData.left + ';' : ''}
            ${shapeData.right ? 'right: ' + shapeData.right + ';' : ''}
            transform: rotate(${shapeData.rotation}deg);
            animation: spinOrbitShape${index} ${20 + index * 6}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
            animation-delay: ${index * 2}s;
            transform-style: preserve-3d;
            backdrop-filter: blur(1px);
            filter: blur(0.5px);
        `;
        
        shapesContainer.appendChild(shape);
    });
    
    heroSection.appendChild(shapesContainer);
    
    // Add sophisticated spinning and orbiting animations
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes spinOrbitShape0 {
            0% { 
                transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(-35deg);
                opacity: 0.8;
            }
            25% { 
                transform: translate3d(-35px, 40px, 90px) 
                           rotateX(28deg) 
                           rotateY(32deg) 
                           rotateZ(55deg);
                opacity: 1;
            }
            50% { 
                transform: translate3d(-20px, 65px, 70px) 
                           rotateX(40deg) 
                           rotateY(50deg) 
                           rotateZ(145deg);
                opacity: 0.92;
            }
            75% { 
                transform: translate3d(15px, 35px, 80px) 
                           rotateX(25deg) 
                           rotateY(30deg) 
                           rotateZ(235deg);
                opacity: 0.96;
            }
            100% { 
                transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(325deg);
                opacity: 0.8;
            }
        }
        
        @keyframes spinOrbitShape1 {
            0% { 
                transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(20deg);
                opacity: 0.75;
            }
            25% { 
                transform: translate3d(50px, -30px, 75px) 
                           rotateX(22deg) 
                           rotateY(-28deg) 
                           rotateZ(110deg);
                opacity: 0.98;
            }
            50% { 
                transform: translate3d(65px, -15px, 55px) 
                           rotateX(35deg) 
                           rotateY(-40deg) 
                           rotateZ(200deg);
                opacity: 0.88;
            }
            75% { 
                transform: translate3d(35px, -25px, 68px) 
                           rotateX(20deg) 
                           rotateY(-25deg) 
                           rotateZ(290deg);
                opacity: 0.94;
            }
            100% { 
                transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(380deg);
                opacity: 0.75;
            }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Enhanced mouse interaction with smooth parallax
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let animationFrameId = null;
    
    heroSection.addEventListener('mouseenter', function() {
        isHovering = true;
        smoothParallax();
    });
    
    heroSection.addEventListener('mouseleave', function() {
        isHovering = false;
        cancelAnimationFrame(animationFrameId);
        
        // Smoothly reset shapes
        const allShapes = shapesContainer.querySelectorAll('.shape-3d');
        allShapes.forEach((shape, index) => {
            const rotation = index === 0 ? -25 : 15;
            shape.style.transform = `rotate(${rotation}deg)`;
            shape.style.opacity = '';
            shape.style.borderColor = '';
            shape.style.boxShadow = '';
        });
        
        // Reset container
        shapesContainer.style.transform = '';
    });
    
    heroSection.addEventListener('mousemove', function(e) {
        if (!isHovering) return;
        
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    function smoothParallax() {
        if (!isHovering) return;
        
        const rect = heroSection.getBoundingClientRect();
        const allShapes = shapesContainer.querySelectorAll('.shape-3d');
        
        allShapes.forEach((shape, index) => {
            const shapeRect = shape.getBoundingClientRect();
            const shapeCenterX = shapeRect.left + shapeRect.width / 2 - rect.left;
            const shapeCenterY = shapeRect.top + shapeRect.height / 2 - rect.top;
            
            // Calculate distance and direction from mouse
            const deltaX = mouseX - shapeCenterX;
            const deltaY = mouseY - shapeCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Large interaction radius for massive shapes
            const maxDistance = 500;
            const strength = Math.max(0, 1 - distance / maxDistance);
            
            if (strength > 0) {
                // Subtle parallax with gentle movement
                const angle = Math.atan2(deltaY, deltaX);
                const orbitX = Math.cos(angle) * strength * 25;
                const orbitY = Math.sin(angle) * strength * 25;
                const moveX = -orbitX;
                const moveY = -orbitY;
                const moveZ = strength * 50; // Gentle depth
                
                // Gentle 3D rotation
                const rotateX = (deltaY / rect.height) * strength * 15;
                const rotateY = -(deltaX / rect.width) * strength * 15;
                const baseRotation = index === 0 ? -35 : 20;
                const rotateZ = baseRotation + (strength * 12) + ((deltaX - deltaY) / rect.width) * strength * 8;
                
                // Subtle scale
                const scale = 1 + (strength * 0.08);
                
                // Gentle visual enhancements
                const opacity = 0.75 + (strength * 0.15);
                const borderOpacity = 0.16 + (strength * 0.08);
                const glowSize = 120 + (strength * 60);
                const glowOpacity = 0.15 + (strength * 0.1);
                
                // Apply sophisticated transform
                shape.style.transform = `
                    translate3d(${moveX}px, ${moveY}px, ${moveZ}px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    rotateZ(${rotateZ}deg)
                    scale(${scale})
                `;
                
                // Apply visual enhancements
                shape.style.opacity = opacity;
                shape.style.borderColor = `rgba(255, 255, 255, ${borderOpacity})`;
                shape.style.boxShadow = `
                    0 0 ${glowSize}px rgba(255, 255, 255, ${glowOpacity}),
                    inset 0 0 ${100 + strength * 50}px rgba(255, 255, 255, ${0.05 + strength * 0.05})
                `;
            }
        });
        
        animationFrameId = requestAnimationFrame(smoothParallax);
    }
    
    // Subtle parallax for entire container
    heroSection.addEventListener('mousemove', function(e) {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        // Gentle circular motion
        const angle = Math.atan2(y, x);
        const distance = Math.sqrt(x * x + y * y);
        const orbitAmount = distance * 5;
        
        shapesContainer.style.transform = `
            rotateY(${x * 1.5}deg) 
            rotateX(${-y * 1.5}deg)
            translateZ(${10 + orbitAmount}px)
            rotate(${angle * 0.3}rad)
        `;
    });
});
