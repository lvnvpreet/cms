import { VisualComponent } from '../../../types'; // Use the correct type name
// Potentially import types for code representation (e.g., AST nodes)

/**
 * Represents a change operation.
 * Represents a specific change detected between UI and code states.
 */
interface ChangeOperationBase {
  target: 'ui' | 'code';
  // Optional: Add context like parentId if needed for applying changes
}

interface AddOperation extends ChangeOperationBase {
  type: 'add';
  payload: {
    component: VisualComponent; // The component that was added (UI)
    parentId: string | null; // Where it was added in the UI tree
    // Code-specific add details TBD (e.g., code snippet, insertion point)
  };
}

interface UpdateOperation extends ChangeOperationBase {
  type: 'update';
  payload: {
    componentId: string; // ID of the component updated (UI)
    changes: Partial<VisualComponent['props']>; // Changed properties (UI)
    // Code-specific update details TBD (e.g., code location, new value)
  };
}

interface DeleteOperation extends ChangeOperationBase {
  type: 'delete';
  payload: {
    componentId: string; // ID of the component deleted (UI)
    // Code-specific delete details TBD (e.g., code location)
  };
}

interface MoveOperation extends ChangeOperationBase {
  type: 'move';
  payload: {
    componentId: string; // ID of the component moved (UI)
    newParentId: string | null;
    newIndex?: number; // Optional: new position among siblings
    // Code-specific move details TBD
  };
}

// Union type for all possible operations
type ChangeOperation = AddOperation | UpdateOperation | DeleteOperation | MoveOperation;

/** Structure information for a component within its tree */
interface ComponentStructure {
  parentId: string | null;
  index: number; // Index among its siblings
  component: VisualComponent; // Reference to the component itself
}

/**
 * Manages the detection and reconciliation of differences between
 * the UI representation and the code representation.
 */
export class DiffManager {
  private lastSyncedUIState: VisualComponent[] | null = null;
  private lastSyncedCodeState: string | null = null; // Or a more structured representation like an AST

  constructor() {
    // Initialization logic, potentially subscribing to events from EventBus
    console.log('DiffManager initialized');
  }

  /**
   * Compares the current UI state and code state to identify differences.
   * @param currentUIState - The current state of the UI components.
   * @param currentCodeState - The current state of the code (e.g., file content or AST).
   * @returns An array of detected change operations.
   */
  compareUIAndCode(
    currentUIState: VisualComponent[],
    currentCodeState: string // Or AST
  ): ChangeOperation[] {
    console.log('Comparing UI and Code states...');
    const detectedChanges: ChangeOperation[] = [];

    // --- UI Comparison ---
    // Build structure maps that include parent and index information
    const currentUIStructure = this.buildStructureMap(currentUIState);
    const lastUIStructure = this.buildStructureMap(this.lastSyncedUIState || []);

    // 1. Check for additions and updates/moves
    for (const [id, currentStruct] of currentUIStructure.entries()) {
      const lastStruct = lastUIStructure.get(id);

      if (!lastStruct) {
        // Added component
        detectedChanges.push({
          type: 'add',
          target: 'ui',
          payload: {
            component: currentStruct.component,
            parentId: currentStruct.parentId, // Use parentId from structure map
            // TODO: Add index information if needed for precise insertion
          },
        });
      } else {
        // Component exists in both - check for updates and moves

        // a) Check for property updates
        const propChanges = this.diffProps(lastStruct.component.props, currentStruct.component.props);
        if (Object.keys(propChanges).length > 0) {
          detectedChanges.push({
            type: 'update',
            target: 'ui',
            payload: {
              componentId: id,
              changes: propChanges,
            },
          });
        }

        // b) Check for structural moves (parent change or index change)
        if (lastStruct.parentId !== currentStruct.parentId || lastStruct.index !== currentStruct.index) {
           console.log(`Move detected for ${id}: Parent (${lastStruct.parentId} -> ${currentStruct.parentId}), Index (${lastStruct.index} -> ${currentStruct.index})`);
           detectedChanges.push({
             type: 'move',
             target: 'ui',
             payload: {
               componentId: id,
               newParentId: currentStruct.parentId,
               newIndex: currentStruct.index,
             },
           });
        }
      }
    }

    // 2. Check for deletions
    for (const [id] of lastUIStructure.entries()) { // Iterate over old structure keys
      if (!currentUIStructure.has(id)) { // Check if ID is missing in new structure
        detectedChanges.push({
          type: 'delete',
          target: 'ui',
          payload: { componentId: id },
        });
      }
    }

    // --- Code Comparison (Placeholder) ---
    if (this.lastSyncedCodeState !== null && currentCodeState !== this.lastSyncedCodeState) {
      // Simplistic detection of code change - treat as a generic update for now
      // TODO: Implement proper code diffing (e.g., AST diff) to generate specific operations
      console.warn('Code difference detected, treating as generic update (implementation needed)');
      // This is still problematic as we don't know *what* changed in the code.
      // A real implementation would parse the code and compare structures.
      // For now, we can't generate a meaningful 'update' payload without more info.
      // Let's skip adding a code change operation until we have better diffing.
      // detectedChanges.push({
      //   type: 'update',
      //   target: 'code',
      //   payload: { componentId: 'unknown', changes: {} } // Placeholder - needs real data
      // });
    }


    console.log(`Detected ${detectedChanges.length} potential changes.`);
    return detectedChanges;
  }

  /**
   * Helper to flatten the component tree into a Map for easier lookup.
   * @param components - The root components of the tree.
   * @returns A Map where keys are component IDs and values are VisualComponent objects.
   */
  private flattenComponentTree(components: VisualComponent[]): Map<string, VisualComponent> {
    const map = new Map<string, VisualComponent>();
    const stack = [...components];
    while (stack.length > 0) {
      const comp = stack.pop();
      if (comp) {
        map.set(comp.id, comp);
        if (comp.children && comp.children.length > 0) {
          stack.push(...comp.children);
        }
      }
    }
    return map;
  }

   /**
    * Builds a map containing structural information (parent, index) for each component.
    * @param components - The root components of the tree.
    * @returns A Map where keys are component IDs and values are ComponentStructure objects.
    */
   private buildStructureMap(components: VisualComponent[]): Map<string, ComponentStructure> {
     const structureMap = new Map<string, ComponentStructure>();

     function traverse(nodes: VisualComponent[], parentId: string | null) {
       nodes.forEach((node, index) => {
         if (!node) return; // Skip if node is null/undefined

         structureMap.set(node.id, {
           parentId: parentId,
           index: index,
           component: node,
         });

         if (node.children && node.children.length > 0) {
           traverse(node.children, node.id); // Recurse with current node ID as parent
         }
       });
     }

     traverse(components, null); // Start traversal from root nodes
     return structureMap;
   }


  /**
   * Helper to diff two props objects (simple shallow comparison).
   * @param oldProps - The previous properties.
   * @param newProps - The current properties.
   * @returns An object containing only the changed properties.
   */
  private diffProps(oldProps: VisualComponent['props'], newProps: VisualComponent['props']): Partial<VisualComponent['props']> {
    const changes: Partial<VisualComponent['props']> = {};
    const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

    for (const key of allKeys) {
      // Basic check: different value or key added/removed
      // TODO: Implement deeper comparison for objects/arrays if needed
      if (oldProps[key] !== newProps[key]) {
        // We only care about the *new* value for the update operation
        changes[key] = newProps[key];
      }
    }
    // Remove internal editor props from changes if necessary
    delete changes['data-component-id'];

    return changes;
  }


  /**
   * Generates UI transformation operations based on detected code changes.
   * @param codeChanges - Changes detected in the code.
   * @returns An array of UI operations.
   */
  generateUIOperations(codeChanges: ChangeOperation[]): ChangeOperation[] {
    console.log('Generating UI operations from code changes...');
    // TODO: Translate code changes (e.g., AST diff) into UI updates
    const uiOperations: ChangeOperation[] = codeChanges
      .filter(change => change.target === 'code') // Example filter
      .map(change => ({ ...change, target: 'ui' })); // Simplistic transformation

    return uiOperations;
  }

  /**
   * Generates code transformation operations based on detected UI changes.
   * @param uiChanges - Changes detected in the UI.
   * @returns An array of code operations.
   */
  generateCodeOperations(uiChanges: ChangeOperation[]): ChangeOperation[] {
    console.log('Generating code operations from UI changes...');
    // TODO: Translate UI changes (e.g., component tree diff) into code modifications
     const codeOperations: ChangeOperation[] = uiChanges
      .filter(change => change.target === 'ui') // Example filter
      .map(change => ({ ...change, target: 'code' })); // Simplistic transformation

    return codeOperations;
  }

  /**
   * Resolves conflicts when changes occur simultaneously in both UI and code.
   * @param uiChanges - Changes originating from the UI.
   * @param codeChanges - Changes originating from the code.
   * @param strategy - The conflict resolution strategy ('preferUI' or 'preferCode').
   * @returns An array of resolved change operations.
   */
  resolveConflicts(
    uiChanges: ChangeOperation[],
    codeChanges: ChangeOperation[],
    strategy: 'preferUI' | 'preferCode' = 'preferUI' // Default to preferUI
  ): ChangeOperation[] {
    console.log(`Resolving conflicts with strategy: ${strategy}...`);

    const resolvedChanges: ChangeOperation[] = [];
    const conflictingComponentIds = new Set<string>();

    // Helper to get component ID from a change operation
    const getComponentId = (change: ChangeOperation): string | undefined => {
        if (change.type === 'add') return change.payload.component.id;
        if (change.type === 'update' || change.type === 'delete' || change.type === 'move') return change.payload.componentId;
        return undefined;
    };

    // Identify potential conflicts by component ID
    const uiChangeTargets = new Map<string, ChangeOperation[]>();
    uiChanges.forEach(change => {
        const id = getComponentId(change);
        if (id) {
            const existing = uiChangeTargets.get(id) || [];
            existing.push(change);
            uiChangeTargets.set(id, existing);
        }
    });

    const codeChangeTargets = new Map<string, ChangeOperation[]>();
    codeChanges.forEach(change => {
        // TODO: Improve codeComponentId extraction based on actual code diffing results
        // Placeholder: Assume code change payload might have a componentId hint like `code:${componentId}` or similar
        let id: string | undefined;
        if ('componentId' in change.payload && typeof change.payload.componentId === 'string') {
             // Basic attempt to extract ID if payload has it directly or prefixed
             if (change.payload.componentId.startsWith('code:')) {
                 id = change.payload.componentId.substring(5);
             } else {
                 id = change.payload.componentId; // Assume it's the direct ID
             }
        }

        if (id) {
            const existing = codeChangeTargets.get(id) || [];
            existing.push(change);
            codeChangeTargets.set(id, existing);
            // If this component ID was also changed in the UI, mark it as conflicting
            if (uiChangeTargets.has(id)) {
                conflictingComponentIds.add(id);
            }
        } else {
             // If code change doesn't map to a component ID, treat it as non-conflicting for now
             // This needs improvement with better code diffing.
             resolvedChanges.push(change);
        }
    });

    // Process UI changes
    uiChanges.forEach(change => {
        const id = getComponentId(change);
        if (id && conflictingComponentIds.has(id)) {
            // This component has conflicting changes
            if (strategy === 'preferUI') {
                console.log(`Conflict on ${id}: Preferring UI change:`, change);
                resolvedChanges.push(change);
            } else {
                console.log(`Conflict on ${id}: Discarding UI change due to 'preferCode' strategy:`, change);
            }
        } else {
            // No conflict for this UI change, add it
            resolvedChanges.push(change);
        }
    });

    // Process code changes
    codeChanges.forEach(change => {
        // Extract ID again (logic might differ based on code diff results later)
        let id: string | undefined;
         if ('componentId' in change.payload && typeof change.payload.componentId === 'string') {
             if (change.payload.componentId.startsWith('code:')) {
                 id = change.payload.componentId.substring(5);
             } else {
                 id = change.payload.componentId;
             }
         }

        if (id && conflictingComponentIds.has(id)) {
            // This component has conflicting changes
            if (strategy === 'preferCode') {
                console.log(`Conflict on ${id}: Preferring Code change:`, change);
                resolvedChanges.push(change);
            } else {
                 console.log(`Conflict on ${id}: Discarding Code change due to 'preferUI' strategy:`, change);
            }
        } else if (!id) {
            // Code change without a clear component ID mapping - add it if not already added
            // This check prevents adding it twice if it was added during the initial pass
            if (!resolvedChanges.includes(change)) {
                 resolvedChanges.push(change);
            }
        }
        // If id exists but is not in conflictingComponentIds, it means only code changed it,
        // so it would have been added during the uiChanges loop if strategy was preferUI,
        // or needs to be added now if strategy is preferCode.
        else if (id && !conflictingComponentIds.has(id)) {
             // Add non-conflicting code changes (already handled if strategy is preferUI via the initial push)
             if (strategy === 'preferCode' && !resolvedChanges.some(c => getComponentId(c) === id && c.target === 'code')) {
                 resolvedChanges.push(change);
             } else if (strategy === 'preferUI' && !resolvedChanges.some(c => getComponentId(c) === id)) {
                 // This case should ideally not happen if logic is correct, but as fallback:
                 resolvedChanges.push(change);
             }
        }
    });

    console.log(`Resolved ${resolvedChanges.length} changes.`);
    return resolvedChanges;
  }

   /**
   * Applies the resolved changes to update the system state.
   * This might involve dispatching events or calling other services.
   * @param changes - The final list of changes to apply.
   * @param currentUIState - The current UI state to potentially update.
   * @param currentCodeState - The current code state to potentially update.
   */
  applyChanges(
      changes: ChangeOperation[],
      currentUIState: VisualComponent[],
      currentCodeState: string // Or AST
    ): { updatedUIState: VisualComponent[]; updatedCodeState: string } {
    console.log(`Applying ${changes.length} resolved changes...`);
    // TODO: Implement logic to apply changes. This might involve:
    // - Calling UI update functions
    // - Calling code modification functions (e.g., using AST manipulation libraries)
    // - Emitting events via EventBus

    // Placeholder: Just log the changes for now
    changes.forEach(change => console.log('Applying change:', change));

    // Update the synced states after applying changes
    // In a real scenario, the updates would happen elsewhere based on these changes
    this.lastSyncedUIState = [...currentUIState]; // Simulate update
    this.lastSyncedCodeState = currentCodeState; // Simulate update

     // Return potentially modified states (in reality, modifications happen via events/callbacks)
     return { updatedUIState: this.lastSyncedUIState, updatedCodeState: this.lastSyncedCodeState };
  }

  /**
   * Updates the baseline states after a successful synchronization.
   * @param syncedUIState - The UI state after synchronization.
   * @param syncedCodeState - The code state after synchronization.
   */
  updateBaseline(syncedUIState: VisualComponent[], syncedCodeState: string) {
    console.log('Updating baseline states.');
    this.lastSyncedUIState = JSON.parse(JSON.stringify(syncedUIState)); // Deep copy
    this.lastSyncedCodeState = syncedCodeState;
  }

  // TODO: Add methods or integration points for undo/redo functionality.
  // This might involve storing sequences of operations or snapshots.
}

// Example Usage (Conceptual - would be integrated into the SyncEngine)
// const diffManager = new DiffManager();
//
// // On UI change:
// const uiChanges = diffManager.compareUIAndCode(newUIState, currentCodeState);
// const codeOps = diffManager.generateCodeOperations(uiChanges.filter(c => c.target === 'ui'));
// // Apply codeOps... update baseline
//
// // On Code change:
// const codeChanges = diffManager.compareUIAndCode(currentUIState, newCodeState);
// const uiOps = diffManager.generateUIOperations(codeChanges.filter(c => c.target === 'code'));
// // Apply uiOps... update baseline
//
// // Simultaneous changes:
// const allChanges = diffManager.compareUIAndCode(newUIState, newCodeState);
// const uiChangesDetected = allChanges.filter(c => c.target === 'ui');
// const codeChangesDetected = allChanges.filter(c => c.target === 'code');
// const resolvedOps = diffManager.resolveConflicts(uiChangesDetected, codeChangesDetected);
// // Apply resolvedOps... update baseline
