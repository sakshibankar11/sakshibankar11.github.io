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
    
    // Define 2 large sophisticated shapes that overflow the screen
    const shapes = [
        // Massive triangle - overflowing from left
        { 
            size: 550, 
            top: '35%', 
            left: '-18%',
            type: 'triangle',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            rotation: -25
        },
        // Giant rounded square - overflowing from bottom
        { 
            size: 480, 
            bottom: '-22%', 
            left: '35%',
            type: 'square',
            clipPath: null,
            rotation: 15
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
            animation: floatMassiveShape${index} ${18 + index * 4}s ease-in-out infinite;
            animation-delay: ${index * 1.5}s;
            transform-style: preserve-3d;
            backdrop-filter: blur(1px);
            filter: blur(0.5px);
        `;
        
        shapesContainer.appendChild(shape);
    });
    
    heroSection.appendChild(shapesContainer);
    
    // Add sophisticated animation keyframes
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatMassiveShape0 {
            0%, 100% { 
                transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(-25deg);
                opacity: 0.8;
            }
            33% { 
                transform: translate3d(-40px, -50px, 100px) 
                           rotateX(20deg) 
                           rotateY(25deg) 
                           rotateZ(-15deg);
                opacity: 1;
            }
            66% { 
                transform: translate3d(30px, -35px, 70px) 
                           rotateX(-15deg) 
                           rotateY(-20deg) 
                           rotateZ(-30deg);
                opacity: 0.92;
            }
        }
        
        @keyframes floatMassiveShape1 {
            0%, 100% { 
                transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(15deg);
                opacity: 0.75;
            }
            50% { 
                transform: translate3d(45px, 40px, 85px) 
                           rotateX(18deg) 
                           rotateY(-22deg) 
                           rotateZ(25deg);
                opacity: 0.98;
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
                // Sophisticated parallax - shapes move away slowly
                const moveX = -deltaX * strength * 0.5;
                const moveY = -deltaY * strength * 0.5;
                const moveZ = strength * 120; // Deep 3D effect
                
                // Elegant 3D rotation
                const rotateX = (deltaY / rect.height) * strength * 30;
                const rotateY = -(deltaX / rect.width) * strength * 30;
                const baseRotation = index === 0 ? -25 : 15;
                const rotateZ = baseRotation + ((deltaX - deltaY) / rect.width) * strength * 20;
                
                // Subtle scale
                const scale = 1 + (strength * 0.15);
                
                // Enhanced visuals
                const opacity = 0.75 + (strength * 0.25);
                const borderOpacity = 0.16 + (strength * 0.14);
                const glowSize = 120 + (strength * 100);
                const glowOpacity = 0.15 + (strength * 0.15);
                
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
        
        shapesContainer.style.transform = `
            rotateY(${x * 3}deg) 
            rotateX(${-y * 3}deg)
            translateZ(20px)
        `;
    });
});
