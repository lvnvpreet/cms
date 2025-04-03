// client/src/components/editor/SyncEngine/index.ts
import { eventBus } from './EventBus'; // Import the singleton instance
import { DiffManager } from './DiffManager';
import { transformCodeToUI } from './CodeToUI'; // Import the function
import { transformUIToCode } from './UIToCode'; // Import the function
import { CodeFile, VisualComponent, GeneratedCode } from '@/types'; // Use VisualComponent instead of ComponentInstance
import { v4 as uuidv4 } from 'uuid'; // Import uuid for synthetic root

// Configuration interface for SyncEngine
interface SyncEngineConfig {
  syncMode: 'manual' | 'automatic';
  conflictResolution: 'preferUI' | 'preferCode' | 'manual'; // Example strategies
  // Add other configuration options as needed
}

/**
 * Manages the synchronization between the UI representation and the code representation.
 * Orchestrates communication, handles state, and manages conflict resolution.
 */
class SyncEngine {
  private config: SyncEngineConfig;
  // private eventBus: EventBus; // Use the imported singleton directly
  private diffManager: DiffManager;
  // private codeToUI: CodeToUIConverter; // Remove class member
  // private uiToCode: UIToCodeConverter; // Remove class member
  private isSyncing: boolean = false; // To prevent concurrent sync loops

  constructor(initialConfig: Partial<SyncEngineConfig> = {}) {
    this.config = {
      syncMode: 'automatic', // Default sync mode
      conflictResolution: 'preferUI', // Default conflict resolution
      ...initialConfig,
    };

    // this.eventBus = new EventBus(); // Remove instantiation, use singleton
    this.diffManager = new DiffManager();
    // Instantiate converters - they might need configuration or dependencies
    // this.codeToUI = new CodeToUIConverter(/* dependencies? */); // Remove instantiation
    // this.uiToCode = new UIToCodeConverter(/* dependencies? */); // Remove instantiation

    this.setupEventListeners();
    this.log('SyncEngine initialized', this.config);
  }

  /**
   * Sets up listeners for relevant events from the EventBus.
   */
  private setupEventListeners() {
    // Example: Listen for UI changes if in automatic mode
    if (this.config.syncMode === 'automatic') {
      // Use the imported eventBus singleton and string event names
      eventBus.subscribe('ui:change', (payload: any) => { // Using string event name, added 'any' type for payload temporarily
        this.log('UI Change detected', payload);
        // TODO: Validate payload structure before accessing componentTree
        if (payload && payload.componentTree) {
          this.triggerSyncFromUI(payload.componentTree);
        } else {
          this.logWarn('Received ui:change event with invalid payload structure', payload);
        }
      });

      eventBus.subscribe('code:change', (payload: any) => { // Using string event name, added 'any' type for payload temporarily
        this.log('Code Change detected', payload);
        // TODO: Validate payload structure before accessing code
        if (payload && typeof payload.code === 'string') {
          this.triggerSyncFromCode(payload.code);
        } else {
          this.logWarn('Received code:change event with invalid payload structure', payload);
        }
      });
    }
    // Add listeners for other events like manual sync triggers, config changes etc.
  }

  /**
   * Updates the SyncEngine configuration.
   * @param newConfig Partial configuration object.
   */
  public setConfig(newConfig: Partial<SyncEngineConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.log('SyncEngine configuration updated', this.config);
    // Potentially re-setup listeners or adjust behavior based on new config
    // For example, switch between automatic/manual listeners
  }

  /**
   * Manually triggers synchronization from the UI representation to the code.
   * @param uiRepresentation The current state of the UI components.
   */
  public triggerSyncFromUI(uiRepresentation: VisualComponent[]) { // Use VisualComponent[]
    if (this.isSyncing) {
      this.log('Sync already in progress, skipping UI to Code sync.');
      return;
    }
    this.isSyncing = true;
    this.log('Triggering Sync: UI -> Code');
    try {
      // 1. Convert UI representation to code
      // Create a synthetic root node as transformUIToCode expects a single root VisualComponent
      // TODO: Verify if uiRepresentation is always the children of a single root
      const syntheticRoot: VisualComponent = {
        id: uuidv4(),
        type: 'div', // Or another appropriate root element like 'body' or 'main'
        props: { 'data-synthetic-root': 'true' }, // Mark as synthetic
        children: uiRepresentation as VisualComponent[], // Assume ComponentInstance is compatible or needs mapping
      };
      const generatedCodeResult: GeneratedCode = transformUIToCode(syntheticRoot);
      const generatedHtml = generatedCodeResult.html; // Extract HTML part
      // TODO: Handle generated CSS and JS (e.g., update separate files or merge)
      this.log('Generated Code (HTML):', generatedHtml); // For debugging
      this.log('Generated Code (CSS):', generatedCodeResult.css);
      this.log('Generated Code (JS):', generatedCodeResult.javascript);


      // 2. Get current code (Placeholder removed - DiffManager uses its internal baseline)
      // const currentCode = this.getCurrentCodeContent();

      // 3. Calculate diff using the unified method
      // Pass the new UI state (uiRepresentation) and the newly generated code (generatedHtml)
      // DiffManager compares the new UI state against its internal baseline code state.
      // NOTE: This comparison is limited as `generatedHtml` isn't the independent "current code state".
      const detectedChanges = this.diffManager.compareUIAndCode(uiRepresentation, generatedHtml); // Still using generatedHtml as placeholder for current code
      this.log('Detected Changes (UI vs Baseline):', detectedChanges);

      // Separate changes (Code changes will be empty/placeholders here)
      const uiChanges = detectedChanges.filter(c => c.target === 'ui');
      const codeChanges = detectedChanges.filter(c => c.target === 'code'); // Likely empty

      // 4. Resolve Conflicts (will mostly just pass through UI changes here)
      if (this.config.conflictResolution === 'manual') {
          // TODO: Emit an event indicating manual resolution is needed
          this.logWarn('Manual conflict resolution required, but not implemented. Aborting sync.');
          // Optionally emit the detected changes for a potential UI
          eventBus.publish('sync:conflict', { source: 'ui', uiChanges, codeChanges });
          return; // Stop processing
      }
      const resolvedChanges = this.diffManager.resolveConflicts(uiChanges, codeChanges, this.config.conflictResolution);
      this.log('Resolved Changes (UI -> Code):', resolvedChanges);

      // TODO: Apply resolved changes incrementally instead of emitting full state.
      // For now, we proceed with emitting the fully generated code, assuming conflicts were resolved.

      // 5. Emit event that code *should* be updated based on the sync outcome
      // We still send the full generated code for now.
      eventBus.publish('code:updated', { code: generatedHtml }); // Use singleton and string event name

      // 6. Update baseline AFTER successful processing
      this.diffManager.updateBaseline(uiRepresentation, generatedHtml); // Update baseline with the states used/generated in this sync cycle

    } catch (error) {
      this.logError('Error during UI -> Code sync', error);
      eventBus.publish('sync:error', { source: 'ui', error }); // Use singleton and string event name
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Manually triggers synchronization from the code representation to the UI.
   * @param code The current code content.
   */
  public triggerSyncFromCode(code: string) {
    if (this.isSyncing) {
      this.log('Sync already in progress, skipping Code to UI sync.');
      return;
    }
    this.isSyncing = true;
    this.log('Triggering Sync: Code -> UI');
    try {
      // 1. Parse code and convert to UI representation
      // Create a placeholder CodeFile - requires path and language context ideally
      // TODO: Get actual file path and language from the event or editor state
      const codeFile: CodeFile = {
          path: 'unknown.tsx', // Placeholder path
          language: 'typescript', // Placeholder language (adjust if needed)
          content: code
      };
      const uiRepresentation = transformCodeToUI([codeFile]); // Call the imported function
      this.log('Generated UI Representation:', uiRepresentation); // For debugging

      // 2. Get current UI state (Placeholder removed - DiffManager uses its internal baseline)
      // const currentUI = this.getCurrentUIState();

      // 3. Calculate diff using the unified method
      // Pass the newly generated UI state (uiRepresentation) and the triggering code (code)
      // DiffManager compares the new code state against its internal baseline UI state.
      // NOTE: This comparison is limited as `uiRepresentation` isn't the independent "current UI state".
      const detectedChanges = this.diffManager.compareUIAndCode(uiRepresentation, code); // Using generated UI and triggering code
      this.log('Detected Changes (Code vs Baseline):', detectedChanges);

      // Separate changes
      const uiChanges = detectedChanges.filter(c => c.target === 'ui'); // Changes detected in UI relative to baseline
      const codeChanges = detectedChanges.filter(c => c.target === 'code'); // Placeholder changes detected in code

      // 4. Resolve Conflicts
       if (this.config.conflictResolution === 'manual') {
          // TODO: Emit an event indicating manual resolution is needed
          this.logWarn('Manual conflict resolution required, but not implemented. Aborting sync.');
          eventBus.publish('sync:conflict', { source: 'code', uiChanges, codeChanges });
          return; // Stop processing
      }
      const resolvedChanges = this.diffManager.resolveConflicts(uiChanges, codeChanges, this.config.conflictResolution);
      this.log('Resolved Changes (Code -> UI):', resolvedChanges);

       // TODO: Apply resolved changes incrementally instead of emitting full state.
       // For now, we proceed with emitting the fully generated UI, assuming conflicts were resolved.

      // 5. Emit event that UI *should* be updated based on the sync outcome
      // We still send the full generated UI representation for now.
      eventBus.publish('ui:updated', { componentTree: uiRepresentation }); // Use singleton and string event name

      // 6. Update baseline AFTER successful processing
      this.diffManager.updateBaseline(uiRepresentation, code); // Update baseline with the states used/generated in this sync cycle

    } catch (error) {
      this.logError('Error during Code -> UI sync', error);
      eventBus.publish('sync:error', { source: 'code', error }); // Use singleton and string event name
    } finally {
      this.isSyncing = false;
    }
  }

  // --- Placeholder methods for integration (REMOVED) ---

  // private getCurrentCodeContent(): string { ... }
  // private applyCodeChanges(newCode: string) { ... }
  // private getCurrentUIState(): VisualComponent[] { ... }
  // private applyUIChanges(newUIState: VisualComponent[]) { ... }

  // --- Logging ---

  private log(message: string, ...optionalParams: any[]) {
    console.log(`[SyncEngine] ${message}`, ...optionalParams);
    // TODO: Implement more sophisticated logging (e.g., levels, different outputs)
  }

  private logWarn(message: string, ...optionalParams: any[]) {
    console.warn(`[SyncEngine] WARNING: ${message}`, ...optionalParams);
  }

  private logError(message: string, error: any) {
    console.error(`[SyncEngine] ERROR: ${message}`, error);
    // TODO: Implement error reporting mechanism
  }
}

// Export a singleton instance of the SyncEngine
// This instance will be used throughout the application to manage sync
export const syncEngine = new SyncEngine({
  // Provide initial configuration if needed, e.g., from settings
  // syncMode: 'manual',
});

// Also export the core classes and types if they need to be accessed directly
export * from './DiffManager';
// export * from './CodeToUI'; // Don't export everything if only using the function internally
// export * from './UIToCode'; // Don't export everything if only using the function internally
// export * from './EventBus'; // Don't re-export eventBus components from here
export type { SyncEngineConfig }; // Export the config type
// Export specific types/functions if needed by consumers
export { transformCodeToUI, transformUIToCode }; // Export the functions if needed externally
