// client/src/components/editor/SyncEngine/CodeToUI.ts

/**
 * @fileoverview Transforms code (HTML, CSS, JS/TSX) into a structured representation
 * of UI components suitable for rendering in the UI Editor.
 */

import { parse, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse'; // Import traverse and NodePath
import * as babelTypes from '@babel/types'; // Import babelTypes
import postcss, { Root as PostcssRoot } from 'postcss'; // Import Root type
import { Parser } from 'htmlparser2';
import { DomHandler, Node as DomHandlerNode, Element as DomHandlerElement, Text as DomHandlerText } from 'domhandler'; // Import Element and Text types
import { v4 as uuidv4 } from 'uuid';
import { VisualComponent, CodeFile, ComponentProps } from '../../../types'; // Import ComponentProps

// TODO: Import necessary parsing libraries (PostCSS, htmlparser2) - DONE
// TODO: Import necessary traversal libraries - Not needed currently

/**
 * Represents a structured UI component instance derived from code.
 * Using VisualComponent from types.ts now.
 * The sourceCodeLocation might be added directly to VisualComponent if needed,
 * or handled separately during mapping.
 */
// interface IntermediateComponentRepresentation { ... } // Fully removed/commented out

// Example of adding source location to VisualComponent if desired (modify types.ts accordingly)
// export interface VisualComponent {
//   // ... existing fields
//   sourceCodeLocation?: {
//     filePath: string;
//     startLine: number;
//     startColumn: number;
//     endLine: number;
//     endColumn: number;
//   };
// }

/**
 * Parses a single code file into an Abstract Syntax Tree (AST) or other structured format.
 * @param file - The code file to parse.
 * @returns A structured representation (e.g., Babel AST, PostCSS Root, domhandler Node array) or null if parsing fails.
 */
function parseCodeFile(file: CodeFile): babelTypes.File | PostcssRoot | DomHandlerNode[] | null {
  console.log(`Parsing ${file.path} (${file.language})...`);
  try {
    switch (file.language) {
      case 'javascript': // Assuming JSX is used in JS files
        const parserOptions: ParserOptions = {
          sourceType: 'module',
          plugins: ['jsx'], // Only enable JSX
          errorRecovery: true, // Attempt to parse even with errors
        };
        return parse(file.content, parserOptions);
      case 'css': {
        // PostCSS parse options can be added if needed
        return postcss.parse(file.content, { from: file.path });
      }
      case 'html': {
        // Instantiate DomHandler
        const handler = new DomHandler((error, dom) => {
          if (error) {
            console.error(`HTML parsing error in ${file.path}:`, error);
          }
          // The 'dom' variable here holds the parsed structure (DomHandlerNode[])
        }, {
          withStartIndices: true, // Keep location info if needed
          withEndIndices: true,
        });

        // Instantiate Parser with the handler
        const parser = new Parser(handler, {
          // Parser options if needed (e.g., decodeEntities: true)
        });

        // Parse the content
        parser.write(file.content);
        parser.end();

        // Return the parsed DOM structure from the handler
         return handler.dom;
       }
       default:
         console.warn(`Unsupported language for parsing in CodeToUI: ${file.language}`);
         return null;
    }
  } catch (error) {
    console.error(`Error parsing file ${file.path}:`, error);
    return null;
  }
}

/**
 * Maps AST nodes or code structures to UI component representations.
 * @param astNode - The AST node or structured code element (e.g., Babel Node, PostCSS Node, domhandler Node).
 * @param filePath - The path of the source file for context.
 * @returns A VisualComponent or null if the node doesn't map to a component.
 */
function mapNodeToComponent(astNode: any, filePath: string): VisualComponent | null {
  // --- Handle PostCSS Nodes (e.g., Rules) ---
  // TODO: Implement mapping for CSS rules if needed
  // Example:
  // if (astNode instanceof PostcssRoot) { // Or postcss.Rule, etc.
  //    // Analyze the rule, maybe create a style component or apply to existing?
  //    console.log('Found CSS Rule:', astNode.selector);
  //    // This mapping is complex - how does CSS map to visual components?
  //    // Maybe it modifies props of existing components found via HTML?
  //    return null; // Placeholder
  // }

  // --- Handle domhandler Nodes (HTML Elements) ---
   if (astNode instanceof DomHandlerElement && astNode.type === 'tag') { // Use instanceof check
     // Now we know astNode is a DomHandlerElement
     // Basic mapping for HTML tags
     const component: VisualComponent = {
       id: uuidv4(),
       type: astNode.name, // Use astNode.name
       props: astNode.attribs || {}, // Use astNode.attribs
       children: [], // Children handled by traversal function
     };
     return component;
   }

   // --- Handle Babel JSXElement Nodes ---
   if (babelTypes.isJSXElement(astNode)) {
       const openingElement = astNode.openingElement;
       let componentType = 'unknown'; // Default type

        // Determine component type from JSX identifier (e.g., <Button>, <div>, <Namespace.Component>)
        const getJSXElementName = (nameNode: babelTypes.JSXIdentifier | babelTypes.JSXMemberExpression | babelTypes.JSXNamespacedName): string => {
            if (babelTypes.isJSXIdentifier(nameNode)) {
                return nameNode.name;
            } else if (babelTypes.isJSXMemberExpression(nameNode)) {
                // Recursively build name for member expressions (e.g., Namespace.Component)
                return `${getJSXElementName(nameNode.object)}.${nameNode.property.name}`;
            } else if (babelTypes.isJSXNamespacedName(nameNode)) {
                 // Handle namespaced names (e.g., <namespace:component>)
                 return `${nameNode.namespace.name}:${nameNode.name.name}`;
            }
            return 'unknown'; // Fallback
        };
        componentType = getJSXElementName(openingElement.name);

       // Extract props from attributes
       const props: ComponentProps = {};
       openingElement.attributes.forEach(attr => {
           if (babelTypes.isJSXAttribute(attr) && babelTypes.isJSXIdentifier(attr.name)) {
               const propName = attr.name.name;
               let propValue: any = true; // Default for boolean attributes like 'disabled'

               if (attr.value) {
                   if (babelTypes.isStringLiteral(attr.value)) {
                       propValue = attr.value.value;
                   } else if (babelTypes.isJSXExpressionContainer(attr.value)) {
                       // TODO: Evaluate or represent expressions - VERY COMPLEX
                       // For now, store a placeholder string representation
                       if (babelTypes.isStringLiteral(attr.value.expression)) {
                           propValue = attr.value.expression.value; // Simple case: {"string"}
                       } else if (babelTypes.isNumericLiteral(attr.value.expression)) {
                           propValue = attr.value.expression.value; // Simple case: {123}
                       } else if (babelTypes.isBooleanLiteral(attr.value.expression)) {
                           propValue = attr.value.expression.value; // Simple case: {true}
                       } else if (babelTypes.isNullLiteral(attr.value.expression)) {
                           propValue = null; // Simple case: {null}
                       } else {
                           // Placeholder for complex expressions, objects, functions etc.
                           propValue = `{/* Expression: ${attr.value.expression.type} */}`;
                       }
                   }
                   // TODO: Handle JSXElement or JSXFragment as prop values if needed
               }
               props[propName] = propValue;
           }
           // TODO: Handle JSXSpreadAttribute if needed
       });

       // TODO: CRITICAL - Implement stable ID generation based on code structure/location
       const component: VisualComponent = {
           id: uuidv4(), // Placeholder: NOT STABLE
           type: componentType,
           props: props,
           children: [], // Children are handled by the traversal process
       };
       return component;
   }


  // If node type is not handled for mapping, return null
  // console.warn('mapNodeToComponent: Unhandled node type', astNode?.type || typeof astNode, filePath);
  return null;
}


// --- Language-Specific Processors ---

/** Processes a Babel AST (File) to extract components from JSX. */
function processBabelAst(ast: babelTypes.File, filePath: string): VisualComponent[] {
    const components: VisualComponent[] = [];
    const componentMap = new Map<string, VisualComponent>(); // Map ID to component for hierarchy building
    const parentStack: (VisualComponent | null)[] = [null]; // Stack to keep track of current parent

    // Use babel traverse to walk the AST
    traverse(ast, {
        enter(path: NodePath) { // Use NodePath type
            // Map the current node to a component if it's a JSX element
            const component = mapNodeToComponent(path.node, filePath);

            if (component) {
                components.push(component);
                componentMap.set(component.id, component);

                // Link to parent from the stack
                const currentParent = parentStack[parentStack.length - 1];
                if (currentParent) {
                    currentParent.children.push(component);
                }

                // If this component can have children, push it onto the parent stack
                if (babelTypes.isJSXElement(path.node)) {
                    parentStack.push(component);
                }
            } else if (babelTypes.isJSXText(path.node)) {
                 // Handle text content within JSX
                 const textContent = path.node.value.trim();
                 const currentParent = parentStack[parentStack.length - 1];
                 if (textContent && currentParent) {
                     // Add text as a simple string child (needs refinement based on design)
                     // Or potentially add to parent's props.children if it's empty?
                     if (!currentParent.props.children) {
                         currentParent.props.children = textContent;
                     } else if (Array.isArray(currentParent.children)) {
                         // Avoid adding text if real children exist? Or intersperse? Complex.
                         console.warn("Handling JSXText alongside JSXElement children needs refinement.");
                     }
                 }
            }
        },
        exit(path: NodePath) { // Use NodePath type
            // If we are exiting a JSX element that we pushed onto the stack, pop it
            const component = mapNodeToComponent(path.node, filePath); // Check if the exiting node was a component
             if (component && babelTypes.isJSXElement(path.node)) {
                 // Ensure the component on top of the stack matches the exiting one before popping
                 if (parentStack[parentStack.length - 1]?.id === component.id) {
                     parentStack.pop();
                 } else {
                      // This might indicate an issue with traversal logic or AST structure
                      console.warn(`Parent stack mismatch on exit for component ${component.id}`);
                 }
             }
        }
    });

    // Filter for root-level components (those whose parent wasn't found or is null)
    const rootComponents = components.filter(comp => {
        const parentId = parentStack.find(p => p?.children.includes(comp))?.id; // Find parent in final stack (should be null for roots)
        // A simpler check might be sufficient if parent linking is robust:
        return !components.some(parentComp => parentComp.children.includes(comp));
    });

    console.log(`Processed Babel AST for ${filePath}, found ${components.length} total components, ${rootComponents.length} roots.`);
    return rootComponents; // Return only the identified root components
}


/** Processes a PostCSS AST (Root) to extract components/styles. */
function processPostcssAst(ast: PostcssRoot, filePath: string): VisualComponent[] {
  console.warn(`CSS processing not yet implemented for ${filePath}`);
  // TODO: Walk rules, declarations, etc.
  // Map CSS rules to potential component styles or definitions
  return [];
}

/** Processes an HTML DOM (domhandler nodes) to extract components. */
function processHtmlDom(nodes: DomHandlerNode[], filePath: string): VisualComponent[] {
  // console.warn(`HTML processing not yet implemented for ${filePath}`); // Keep for now
  const components: VisualComponent[] = [];
  const componentMap = new Map<string, VisualComponent>(); // For linking children

  function traverseDom(currentNodes: DomHandlerNode[], parentComponent: VisualComponent | null) {
      currentNodes.forEach(node => {
          const component = mapNodeToComponent(node, filePath); // Use mapNodeToComponent
          if (component) {
              components.push(component); // Add to overall flat list
              componentMap.set(component.id, component); // Map ID to component

              // Link to parent if parent exists
              if (parentComponent) {
                  parentComponent.children.push(component);
              }

              // Recurse for children if they exist
              if (node.type === 'tag' && (node as DomHandlerElement).children?.length > 0) {
                  traverseDom((node as DomHandlerElement).children, component); // Pass current component as parent
              }
          } else if (node instanceof DomHandlerText && node.type === 'text') { // Use instanceof check for Text nodes
              // Optionally handle text nodes
              const textContent = node.data.trim();
              if (textContent && parentComponent) {
                  // Example: Add non-empty text as a simple string child? Needs design decision.
                  // parentComponent.children.push(textContent as any); // Hacky, avoid 'any'
                  // Or add to props? parentComponent.props.textContent = textContent;
              }
          }
          // TODO: Handle comment nodes ('comment'), etc. if needed
      });
  }

  traverseDom(nodes, null); // Start traversal at the root

  // Filter for root-level components (those whose parent wasn't found in this pass)
  // This basic flat list + parent linking during traversal *should* build the hierarchy.
  // We need to return only the roots.
  const rootComponents = components.filter(comp => {
      // Check if any *other* component in the list includes this one as a child
      return !components.some(parentComp => parentComp.children.includes(comp));
  });

  // return components; // Return flat list for now - CHANGED TO RETURN ROOTS
  return rootComponents;
}


/**
 * Transforms a collection of code files into a tree of UI component instances.
 *
 * @param codeFiles - An array of code files conforming to the CodeFile type.
 * @returns An array of root-level VisualComponent representing the UI.
 */
export function transformCodeToUI(
  codeFiles: CodeFile[]
): VisualComponent[] {
  console.log('Starting Code-to-UI transformation...');
  let allComponents: VisualComponent[] = []; // Use let as it will be concatenated

  for (const file of codeFiles) {
    const ast = parseCodeFile(file);
    if (!ast) {
      console.warn(`Skipping file due to parsing error: ${file.path}`);
      continue;
    }

    console.log(`Processing AST for ${file.path}...`);
    let fileComponents: VisualComponent[] = [];

    // Process the AST based on the language
    switch (file.language) {
        case 'javascript':
             // Check if ast is a Babel File (object with type 'File')
             if (ast && typeof ast === 'object' && !Array.isArray(ast) && ast.type === 'File') {
                 fileComponents = processBabelAst(ast as babelTypes.File, file.path);
             } else if (ast) {
                 console.warn(`Expected Babel AST File for ${file.path} but received: ${Array.isArray(ast) ? 'array' : typeof ast}`);
              }
              break;
         case 'css':
             // Check if ast is a PostCSS Root (which is an object with type 'root')
             // Refined type guard
             if (ast && typeof ast === 'object' && !Array.isArray(ast) && 'type' in ast) {
                 // Now we know ast is an object with a 'type' property
                 if (ast.type === 'root') {
                    fileComponents = processPostcssAst(ast as PostcssRoot, file.path);
                 } else {
                    console.warn(`Expected PostCSS Root (type 'root') for ${file.path} but received type: ${ast.type}`);
                 }
             } else if (ast) {
                 console.warn(`Expected PostCSS Root object for ${file.path} but received: ${Array.isArray(ast) ? 'array' : typeof ast}`);
              }
              break;
         case 'html':
             // Check if ast is an array (expected from DomHandler)
             if (Array.isArray(ast)) {
                 fileComponents = processHtmlDom(ast as DomHandlerNode[], file.path); // Cast for clarity
             } else if (ast) {
                 console.warn(`Expected DomHandlerNode[] for ${file.path} but received: ${typeof ast}`);
            }
            break;
        default:
             // Should be caught by parseCodeFile, but good to have a fallback
             // Log the actual language if it reaches here (e.g., 'javascript')
             console.warn(`Skipping processing for unsupported language: ${file.language}`);
    }

    allComponents = allComponents.concat(fileComponents); // Add components from this file
  }

  // TODO: Structure the flat list `allComponents` into a proper hierarchy. // Partially addressed in processHtmlDom
  // Remaining challenges:
  // 1. Correlating CSS information (from processPostcssAst) with HTML components.
  // 2. More robust hierarchy building if the simple parent linking isn't sufficient.
  const componentHierarchy: VisualComponent[] = allComponents; // Still potentially a mix of roots and children if CSS processing adds components

  console.log('Code-to-UI transformation finished.');
  // TODO: Filter componentHierarchy to return only true root elements if CSS processing adds non-roots.
  return componentHierarchy;
}

// TODO: Add helper functions for AST traversal (process* functions exist)
// TODO: Implement component registry or mapping logic (partially done in mapNodeToComponent)
// TODO: Define robust error handling strategies (basic console logs added)
// TODO: Implement hierarchy building from the flat list. // Partially done in processHtmlDom
// TODO: Implement CSS processing and correlation.
