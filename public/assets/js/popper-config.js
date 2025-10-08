// Popper.js configuration to suppress margin warnings and fix dropdown positioning
// This fixes the warning: "CSS 'margin' styles cannot be used to apply padding between the popper and its reference element"

if (typeof window !== 'undefined' && window.Popper) {
  // Suppress the margin warning by configuring Popper defaults
  const originalCreatePopper = window.Popper.createPopper;
  
  window.Popper.createPopper = function(reference, popper, options = {}) {
    // Add default modifiers to prevent margin warnings and improve positioning
    const defaultModifiers = [
      {
        name: 'offset',
        options: {
          offset: [0, 8], // [skidding, distance] - 8px distance
        },
      },
      {
        name: 'preventOverflow',
        options: {
          padding: 8, // 8px padding from boundary
          boundary: 'viewport', // Use viewport as boundary instead of parent
        },
      },
      {
        name: 'flip',
        options: {
          padding: 8, // 8px padding from boundary
          boundary: 'viewport', // Use viewport as boundary
        },
      },
      {
        name: 'computeStyles',
        options: {
          adaptive: true,
          roundOffsets: true,
        },
      },
    ];

    // Merge with existing modifiers
    const mergedOptions = {
      ...options,
      modifiers: [
        ...defaultModifiers,
        ...(options.modifiers || []),
      ],
      strategy: 'absolute', // Ensure absolute positioning
    };

    return originalCreatePopper.call(this, reference, popper, mergedOptions);
  };
}

// Alternative: Suppress console warnings for Popper
if (typeof window !== 'undefined' && window.console) {
  const originalWarn = console.warn;
  console.warn = function(...args) {
    // Filter out Popper margin warnings
    if (args[0] && typeof args[0] === 'string' && 
        args[0].includes('CSS "margin" styles cannot be used to apply padding')) {
      return; // Suppress this specific warning
    }
    originalWarn.apply(console, args);
  };
}
