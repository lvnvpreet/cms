// Import dependencies (e.g., ORM, types)
// import { SiteAttributes } from './site.model'; // Example relationship import
// import { UserAttributes } from './user.model'; // Example: User who initiated deployment

// Define interfaces/types for the Deployment model
interface DeploymentAttributes {
  id: number; // Or string/UUID
  siteId: number; // Foreign key to Site model
  initiatorId?: number; // Optional: User who triggered the deployment
  timestamp: Date;
  status: 'pending' | 'building' | 'deploying' | 'success' | 'failed' | 'cancelled';
  environment: 'production' | 'staging' | 'preview'; // Example environments
  versionTag?: string; // e.g., Git commit hash, semantic version
  buildConfig?: Record<string, any>; // Configuration used for this build/deployment
  logs?: string; // Store build/deployment logs (consider storing large logs elsewhere)
  deployedUrl?: string; // The URL where this specific deployment is accessible (e.g., preview URL)
  rollbackTargetId?: number; // Optional: ID of the deployment to rollback to if this one fails or is rolled back
  performanceMetrics?: Record<string, any>; // Post-deployment performance checks
  durationSeconds?: number; // How long the deployment took
  createdAt: Date;
  // No updatedAt usually, deployments are typically immutable records once finished
}

// Define the Deployment schema/structure (adapt based on chosen ORM/DB)
const deploymentSchemaDefinition = {
  id: { type: 'SERIAL', primaryKey: true },
  siteId: { type: 'INTEGER', allowNull: false /*, references: { model: 'Sites', key: 'id' } */ },
  initiatorId: { type: 'INTEGER', allowNull: true /*, references: { model: 'Users', key: 'id' } */ },
  timestamp: { type: 'TIMESTAMPTZ', defaultValue: 'NOW()', allowNull: false },
  status: { type: 'VARCHAR(50)', allowNull: false },
  environment: { type: 'VARCHAR(50)', allowNull: false },
  versionTag: { type: 'VARCHAR(255)', allowNull: true },
  buildConfig: { type: 'JSONB', allowNull: true },
  logs: { type: 'TEXT', allowNull: true }, // Storing large logs here might not be ideal
  deployedUrl: { type: 'VARCHAR(255)', allowNull: true },
  rollbackTargetId: { type: 'INTEGER', allowNull: true /*, references: { model: 'Deployments', key: 'id' } */ },
  performanceMetrics: { type: 'JSONB', allowNull: true },
  durationSeconds: { type: 'INTEGER', allowNull: true },
  createdAt: { type: 'TIMESTAMPTZ', defaultValue: 'NOW()', allowNull: false },
  // Add indexes on siteId, timestamp, status, environment
};

// --- Model Definition (Example structure) ---
class Deployment /* extends SomeBaseModel */ {
  id!: number;
  siteId!: number;
  timestamp!: Date;
  status!: 'pending' | 'building' | 'deploying' | 'success' | 'failed' | 'cancelled';
  environment!: 'production' | 'staging' | 'preview';
  logs?: string;
  durationSeconds?: number;
  // ... other properties

  constructor(attributes: Partial<DeploymentAttributes>) {
    Object.assign(this, attributes);
  }

  // --- Model Methods ---
  // Methods might involve updating status or appending logs
  async updateStatus(newStatus: DeploymentAttributes['status'], logMessage?: string): Promise<void> {
    this.status = newStatus;
    if (logMessage) {
      // Append to logs (handle potential size issues)
      this.logs = (this.logs ? this.logs + '\n' : '') + `[${new Date().toISOString()}] ${logMessage}`;
    }
    if (newStatus === 'success' || newStatus === 'failed' || newStatus === 'cancelled') {
      // Calculate duration if starting from pending/building/deploying
      const startTime = this.timestamp; // Or a dedicated startTime field if needed
      this.durationSeconds = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    }
    console.log(`Deployment ${this.id} status updated to ${newStatus}`);
    // Update in DB
  }
}

// --- Static Functions / Repository Methods ---
const DeploymentRepository = {
  async findById(id: number): Promise<Deployment | null> {
    console.log('DB query needed for Deployment.findById:', id);
    return null; // Placeholder
  },

  async findBySite(siteId: number, limit: number = 10): Promise<Deployment[]> {
    console.log(`DB query needed for Deployment.findBySite: siteId=${siteId}, limit=${limit}`);
    // Order by timestamp DESC
    return []; // Placeholder
  },

  async findLatestSuccessful(siteId: number, environment: string): Promise<Deployment | null> {
    console.log(`DB query needed for Deployment.findLatestSuccessful: siteId=${siteId}, env=${environment}`);
    // Query for status='success', environment=environment, order by timestamp DESC, limit 1
    return null; // Placeholder
  },

  async create(deploymentData: Omit<DeploymentAttributes, 'id' | 'createdAt' | 'timestamp' | 'status' | 'durationSeconds' | 'logs'> & { status: 'pending' }): Promise<Deployment> {
    // Deployment usually starts in 'pending' state
    console.log('DB insert needed for Deployment.create:', deploymentData);
    return new Deployment({
      ...deploymentData,
      id: Math.floor(Math.random() * 1000), // Fake ID
      timestamp: new Date(),
      createdAt: new Date(),
      status: 'pending',
    });
  },
  // Add update (primarily for status, logs, duration, deployedUrl), maybe delete (carefully)
};

// --- Validation Rules ---
const deploymentValidationSchema = {
  siteId: { required: true, type: 'integer' },
  status: { required: true, allowedValues: ['pending', 'building', 'deploying', 'success', 'failed', 'cancelled'] },
  environment: { required: true, allowedValues: ['production', 'staging', 'preview'] },
  // Add validation for deployedUrl format etc.
};

// --- Relationships ---
// Deployment belongsTo Site
// Deployment belongsTo User (initiator, optional)
// Deployment might reference another Deployment (rollbackTargetId)

// --- Hooks / Middleware ---
// Example: Trigger notifications on status changes (success/failure)
// Deployment.afterUpdate(async (deployment, options) => {
//   if (options.fields.includes('status')) {
//     const previousStatus = deployment.previous('status');
//     if (deployment.status === 'success' && previousStatus !== 'success') {
//       sendDeploymentSuccessNotification(deployment);
//     } else if (deployment.status === 'failed' && previousStatus !== 'failed') {
//       sendDeploymentFailureNotification(deployment);
//     }
//   }
// });

// --- Export the Model ---
export { Deployment, DeploymentRepository, type DeploymentAttributes, deploymentSchemaDefinition, deploymentValidationSchema };

// Note: Adapt implementation based on the chosen ORM/DB stack.
// The actual deployment process (build, upload, infrastructure changes) happens
// in separate services/workers, which then update the Deployment record status.
