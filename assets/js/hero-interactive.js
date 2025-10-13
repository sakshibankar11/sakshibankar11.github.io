// Interactive white shapes that react to mouse movement
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('#banner.modern-hero');
    
    if (!heroSection) return;
    
    // Create additional interactive white shapes
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
    `;
    
    // Create multiple white shapes
    const shapes = [
        { size: 80, top: '25%', left: '20%', type: 'circle' },
        { size: 60, top: '65%', left: '80%', type: 'circle' },
        { size: 100, top: '40%', right: '25%', type: 'square' },
        { size: 70, top: '75%', left: '15%', type: 'square' },
        { size: 90, top: '30%', right: '8%', type: 'rectangle' },
        { size: 110, top: '60%', right: '35%', type: 'circle' }
    ];
    
    shapes.forEach((shapeData, index) => {
        const shape = document.createElement('div');
        shape.className = `white-shape shape-${index}`;
        
        const isCircle = shapeData.type === 'circle';
        const isRectangle = shapeData.type === 'rectangle';
        const width = isRectangle ? shapeData.size * 1.4 : shapeData.size;
        const height = isRectangle ? shapeData.size * 0.7 : shapeData.size;
        
        shape.style.cssText = `
            position: absolute;
            width: ${width}px;
            height: ${height}px;
            background: rgba(255, 255, 255, 0.04);
            border: 1.5px solid rgba(255, 255, 255, 0.1);
            border-radius: ${isCircle ? '50%' : '12px'};
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.06);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            ${shapeData.top ? 'top: ' + shapeData.top : ''};
            ${shapeData.left ? 'left: ' + shapeData.left : ''};
            ${shapeData.right ? 'right: ' + shapeData.right : ''};
            animation: floatShape${index} ${8 + index}s ease-in-out infinite;
            animation-delay: ${index * 0.5}s;
            transform: rotate(${index * 10}deg);
        `;
        
        shapesContainer.appendChild(shape);
    });
    
    heroSection.appendChild(shapesContainer);
    
    // Add animation keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatShape0 {
            0%, 100% { transform: rotate(0deg) translate(0, 0); opacity: 0.5; }
            50% { transform: rotate(10deg) translate(-20px, -15px); opacity: 0.8; }
        }
        @keyframes floatShape1 {
            0%, 100% { transform: rotate(15deg) translate(0, 0); opacity: 0.6; }
            50% { transform: rotate(-5deg) translate(15px, 20px); opacity: 0.9; }
        }
        @keyframes floatShape2 {
            0%, 100% { transform: rotate(-10deg) translate(0, 0); opacity: 0.4; }
            50% { transform: rotate(5deg) translate(-10px, 25px); opacity: 0.7; }
        }
        @keyframes floatShape3 {
            0%, 100% { transform: rotate(20deg) translate(0, 0); opacity: 0.55; }
            50% { transform: rotate(30deg) translate(18px, -12px); opacity: 0.85; }
        }
        @keyframes floatShape4 {
            0%, 100% { transform: rotate(-15deg) translate(0, 0); opacity: 0.5; }
            50% { transform: rotate(-25deg) translate(-15px, -20px); opacity: 0.8; }
        }
        @keyframes floatShape5 {
            0%, 100% { transform: rotate(5deg) translate(0, 0); opacity: 0.45; }
            50% { transform: rotate(15deg) translate(12px, 18px); opacity: 0.75; }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Mouse move interaction
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    
    heroSection.addEventListener('mouseenter', function() {
        isHovering = true;
    });
    
    heroSection.addEventListener('mouseleave', function() {
        isHovering = false;
        // Reset shapes to original position
        const allShapes = shapesContainer.querySelectorAll('.white-shape');
        allShapes.forEach(shape => {
            shape.style.transform = shape.style.transform.replace(/translate3d\([^)]+\)/, '');
        });
    });
    
    heroSection.addEventListener('mousemove', function(e) {
        if (!isHovering) return;
        
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const allShapes = shapesContainer.querySelectorAll('.white-shape');
        
        allShapes.forEach((shape, index) => {
            const shapeRect = shape.getBoundingClientRect();
            const shapeCenterX = shapeRect.left + shapeRect.width / 2 - rect.left;
            const shapeCenterY = shapeRect.top + shapeRect.height / 2 - rect.top;
            
            // Calculate distance from mouse to shape
            const deltaX = mouseX - shapeCenterX;
            const deltaY = mouseY - shapeCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Parallax effect - shapes move away from cursor
            const maxDistance = 300;
            const strength = Math.max(0, 1 - distance / maxDistance);
            
            const moveX = -deltaX * strength * 0.3;
            const moveY = -deltaY * strength * 0.3;
            
            // Scale and brighten on proximity
            const scale = 1 + (strength * 0.2);
            const brightness = 0.6 + (strength * 0.4);
            
            // Apply transform
            const currentRotation = index * 10;
            shape.style.transform = `
                rotate(${currentRotation + (strength * 5)}deg) 
                translate3d(${moveX}px, ${moveY}px, 0) 
                scale(${scale})
            `;
            shape.style.opacity = brightness;
            shape.style.borderColor = `rgba(255, 255, 255, ${0.1 + strength * 0.2})`;
            shape.style.boxShadow = `0 0 ${30 + strength * 40}px rgba(255, 255, 255, ${0.06 + strength * 0.15})`;
        });
    });
    
    // Add hover effect to hero section itself
    heroSection.style.transition = 'backdrop-filter 0.3s ease';
});

