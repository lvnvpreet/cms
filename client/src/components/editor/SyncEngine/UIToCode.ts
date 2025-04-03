// client/src/components/editor/SyncEngine/UIToCode.ts
import { VisualComponent, GeneratedCode, ComponentProps } from '../../../types'; // Import types

/**
 * Converts a single visual component node into its code representation.
 * This function will need to handle different component types and their specific transformations.
 * @param component The visual component to convert.
 * @param component The visual component to convert.
 * @param cssCollector A function to collect CSS rules during traversal.
 * @param jsCollector A function to collect JS snippets during traversal.
 * @returns A string representation of the component in code (e.g., HTML).
 */
function convertComponentToCode(
  component: VisualComponent,
  cssCollector: (id: string, styles: ComponentProps['style']) => void, // Use ComponentProps['style']
  jsCollector: (id: string, event: string, handler: Function) => void // Keep Function for now, refine later
): string {
  // TODO: Implement more sophisticated component-specific conversion logic
  const tagName = component.type.toLowerCase();
  // Use the specific data-component-id from props if provided, otherwise use component.id
  const componentId = component.props['data-component-id'] || component.id;
  let attributes = ` data-component-id="${componentId}"`; // Add unique ID

  for (const key in component.props) {
    const value = component.props[key];
    // Skip internal/special keys and undefined values
    if (key === 'children' || key === 'data-component-id' || value === undefined) continue;

    // TODO: Address challenge: Handling dynamic values and expressions more robustly
    if (key === 'style' && typeof value === 'object' && value !== null) {
      // Collect styles for CSS generation
      cssCollector(componentId, value as ComponentProps['style']); // Assert type

      // Optionally keep inline styles (can be controlled by a flag later)
      const styleString = Object.entries(value)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
        .join(';');
      if (styleString) { // Avoid adding empty style=""
          attributes += ` style="${styleString}"`;
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      // Collect event handlers for JS generation
      const eventName = key.toLowerCase(); // e.g., onclick
      jsCollector(componentId, eventName, value);
      // Add a marker attribute, actual binding happens in JS
      attributes += ` data-event-${eventName}="true"`;
    } else if (typeof value === 'boolean') {
      // Add boolean attributes like 'disabled', 'checked' if true
      if (value) attributes += ` ${key}`;
    } else {
      // Handle standard string/number attributes
      // Ensure proper escaping for attribute values if necessary (basic for now)
      attributes += ` ${key}="${String(value).replace(/"/g, '"')}"`;
    }
  }

  // Handle children
  let innerContent = '';
  // Check if props.children is defined and is a simple type (string/number)
  if (typeof component.props.children === 'string' || typeof component.props.children === 'number') {
    innerContent = String(component.props.children);
  }
  // Otherwise, process the children array recursively
  else if (Array.isArray(component.children)) {
    innerContent = component.children
      .map(child => convertComponentToCode(child, cssCollector, jsCollector))
      .join('\n');
  }
  // Note: We might need to handle cases where props.children is a ReactNode but not string/number

  // Handle self-closing tags
  const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
  if (selfClosingTags.includes(tagName)) {
      return `<${tagName}${attributes} />`;
  } else {
      // Basic indentation for readability (can be improved with a proper formatter)
      const indentedInnerContent = innerContent.split('\n').map(line => `  ${line}`).join('\n');
      return `<${tagName}${attributes}>\n${indentedInnerContent}\n</${tagName}>`;
  }
}

/**
 * Traverses the visual component tree and generates the corresponding code.
 * @param componentTree The root of the visual component tree.
 * @returns An object containing the generated HTML, CSS, and JavaScript code.
 */
export function transformUIToCode(componentTree: VisualComponent): GeneratedCode {
  console.log('Starting UI to Code transformation...');
  // Use more specific types for collectors based on ComponentProps
  const collectedCSS: { [id: string]: ComponentProps['style'] } = {};
  const collectedJS: { id: string; event: string; handler: Function }[] = []; // Keep Function for now

  const cssCollector = (id: string, styles: ComponentProps['style']) => {
    if (styles && Object.keys(styles).length > 0) { // Only collect if there are styles
        collectedCSS[id] = { ...(collectedCSS[id] || {}), ...styles };
    }
  };

  const jsCollector = (id: string, event: string, handler: Function) => {
    collectedJS.push({ id, event, handler });
  };

  // 1. Traverse the component tree and convert each component, collecting CSS/JS info
  const generatedHtml = convertComponentToCode(componentTree, cssCollector, jsCollector);

  // TODO: 2. Apply component-specific transformations (e.g., mapping React components to HTML)

  // 3. Assemble the code
  //    - Generate CSS
  //    - Generate JS
  //    - Address challenge: Preserving custom code modifications (requires diffing/merging - complex)
  //    - Address challenge: Maintaining proper code organization (e.g., separate files)

  // CSS Generation
  let generatedCss = '/* Generated CSS */\n';
  for (const id in collectedCSS) {
    const styles = collectedCSS[id];
    if (!styles || Object.keys(styles).length === 0) continue; // Skip empty styles

    const styleString = Object.entries(styles)
      .map(([k, v]) => `  ${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
      .join('\n');
    generatedCss += `[data-component-id="${id}"] {\n${styleString}\n}\n\n`;
  }

  // JS Generation (Placeholder - Needs significant improvement)
  let generatedJs = '// Generated JavaScript (Basic Event Binding)\n';
  generatedJs += 'document.addEventListener("DOMContentLoaded", () => {\n';
  collectedJS.forEach(({ id, event }) => {
    // WARNING: This is a placeholder. Real implementation needs a way to map
    // these events back to actual functions defined perhaps in a separate script
    // or injected context. Directly embedding functions is not feasible/safe.
    generatedJs += `  const el_${id.replace(/-/g, '_')} = document.querySelector('[data-component-id="${id}"]');\n`; // Sanitize id for variable name
    generatedJs += `  if (el_${id.replace(/-/g, '_')}) {\n`;
    const eventType = event.substring(2); // Remove "on" prefix
    generatedJs += `    el_${id.replace(/-/g, '_')}.addEventListener('${eventType}', (e) => {\n`;
    generatedJs += `      console.log('Event "${eventType}" triggered on element ${id}');\n`;
    generatedJs += `      // Placeholder for actual handler logic associated with ${id}\n`;
    generatedJs += `    });\n`;
    generatedJs += `  }\n`;
  });
  generatedJs += '});\n';


  const generatedCode: GeneratedCode = {
    html: generatedHtml,
    css: generatedCss.trim() ? generatedCss : '/* No CSS generated */', // Handle empty CSS
    javascript: generatedJs.trim() ? generatedJs : '// No JavaScript generated', // Handle empty JS
  };

  console.log('UI to Code transformation complete.');
  return generatedCode;
}

// Example Usage (for testing purposes) - Update to use ComponentProps style
/*
const sampleTree: VisualComponent = {
  id: 'root-123',
  type: 'div',
  props: { className: 'container', style: { padding: '20px', backgroundColor: 'lightblue' } },
  children: [
    {
      id: 'btn-456',
      type: 'button',
      props: { onClick: () => alert('Clicked!'), children: 'Click Me', style: { margin: '5px', cursor: 'pointer' } },
      children: [],
    },
    {
      id: 'txt-789',
      type: 'p',
      props: { children: 'Some text content.' },
      children: [],
    },
    {
      id: 'img-abc',
      type: 'img',
      props: { src: 'image.jpg', alt: 'Sample Image', style: { border: '1px solid black' } },
      children: [],
    },
    {
        id: 'inp-def',
        type: 'input',
        props: { type: 'text', placeholder: 'Enter text', disabled: true },
        children: [],
    }
  ],
};

const code = transformUIToCode(sampleTree);
console.log('--- Generated HTML ---:\n', code.html);
console.log('\n--- Generated CSS ---:\n', code.css);
console.log('\n--- Generated JS ---:\n', code.javascript);
*/
