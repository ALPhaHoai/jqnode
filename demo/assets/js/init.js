console.log('Script started executing');

// Minimal test - just try to format code blocks
console.log('Testing code block formatting');

const codeBlocks = document.querySelectorAll('.code-block');
console.log('Found code blocks:', codeBlocks.length);

codeBlocks.forEach(function (block, index) {
    console.log('Block', index + 1, 'content length:', block.textContent.length);
});

console.log('Basic test completed');

// Code formatting function using Prism.js
function formatCode(code) {
    // Create a container using the jqnode library
    const $container = $('<div class="formatted-code"></div>');

    // Create Prism.js compatible structure
    const $pre = $('<pre class="language-javascript"></pre>');
    const $code = $('<code class="language-javascript"></code>');

    // Set the code content
    $code.text(code);
    $pre.append($code);
    $container.append($pre);

    return $container;
}

// Format code blocks after a short delay to ensure DOM is ready
setTimeout(function () {
    console.log('Formatting code blocks after timeout...');
    const codeBlocks = document.querySelectorAll('.code-block');
    console.log('Found', codeBlocks.length, 'code blocks to format');

    if (codeBlocks.length > 0 && typeof formatCode === 'function') {
        console.log('Running code formatting...');
        codeBlocks.forEach(function (block, index) {
            console.log('Processing block', index + 1);
            const code = block.innerText.trim();
            console.log('Code length:', code.length);
            if (code.length > 0) {
                try {
                    const $formatted = formatCode(code);
                    block.innerHTML = '';
                    if ($formatted && $formatted.nodes && $formatted.nodes.length > 0) {
                        const container = $formatted.nodes[0];
                        while (container.firstChild) {
                            block.appendChild(container.firstChild);
                        }
                        const codeElement = block.querySelector('code.language-javascript');
                        if (codeElement && typeof Prism !== 'undefined') {
                            Prism.highlightElement(codeElement);
                            console.log('Applied Prism.js highlighting to code block', index + 1);
                        }
                    }
                } catch (error) {
                    console.error('Error formatting code block', index + 1, ':', error);
                }
            }
        });
        console.log('Code formatting completed');
    } else {
        console.log('No code blocks found or formatCode not available');
    }
}, 100);

// Add click handlers for method navigation
document.addEventListener('DOMContentLoaded', function () {
    const methodItems = document.querySelectorAll('.method-item');

    methodItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const targetSection = this.getAttribute('data-section');
            if (targetSection) {
                const sectionElement = document.getElementById(targetSection);
                if (sectionElement) {
                    // Add a small offset to account for any fixed headers
                    const offset = 20;
                    const elementPosition = sectionElement.offsetTop - offset;

                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth',
                    });

                    // Add a brief highlight effect to the target section
                    sectionElement.style.transition = 'background-color 0.3s ease';
                    sectionElement.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
                    setTimeout(function () {
                        sectionElement.style.backgroundColor = '';
                    }, 1000);
                }
            }
        });
    });
});

// Initialize on page load
window.addEventListener('load', function () {
    // Check if library is loaded
    if (typeof $ === 'undefined') {
        alert('jqnode library not loaded! Make sure dist/jqnode.umd.js exists.');
        return;
    }

    console.log('jqnode library loaded successfully!');
    console.log('Available globally as: $');
    console.log(
        'Version info:',
        $.fn ? 'jQuery-compatible interface available' : 'Basic interface only',
    );
});

// Method navigation click handlers are already set up above
