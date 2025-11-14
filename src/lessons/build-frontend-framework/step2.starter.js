// You should already have createElement from step 1
function createElement(tag, props = {}, ...children) {
  return {
    type: tag,
    props: props,
    children: children
  };
}

// Now create a render function
// It should take: element (object from createElement), container (DOM element)
// It should: create a DOM element, set props as attributes, render children recursively

// Your render function here:

