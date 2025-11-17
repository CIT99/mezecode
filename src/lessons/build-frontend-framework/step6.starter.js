// Step 6: Build a Complete Page
// ===============================
// You've built the framework! Now let's use it to create a complete page.
//
// Your task: Create an appTree that contains:
// - An h1 tag with a heading
// - A p tag with some text
// - An a tag with href and target="_blank"
// - A button with onClick handler (example shown below)
//
// The createElement and render functions are provided for you in the preview.
// You just need to export an appTree using exports.createElement!

// TODO: Create your appTree using exports.createElement
// The preview will use the render function to render your elements

exports.appTree = exports.createElement(
    'div',
    {},
    exports.createElement('div', {style: "background: cyan;text-align:center; padding: 1rem"}, 
                         exports.createElement("strong", {style:"display:block;"}, 'Congratulations! You are almost done!'),
                         exports.createElement("span", {}, 'Add some elements on the page!')),
    // Your code here:
  
    
  );