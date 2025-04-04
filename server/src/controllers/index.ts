// server/src/controllers/index.ts

/**
 * Central export point for all controllers.
 * This file imports and re-exports all controller modules,
 * making it convenient to import controllers in route files.
 */

// Import controllers as they are created
import * as authController from './auth.controller';
import * as userController from './user.controller';
import * as siteController from './site.controller';
import * as templateController from './template.controller';
import * as deployController from './deploy.controller';
import * as componentController from './component.controller';
import * as analyticsController from './analytics.controller';
import * as mediaController from './media.controller';

// Re-export controllers
export {
  authController,
  userController,
  siteController,
  templateController,
  deployController,
  componentController,
  analyticsController,
  mediaController,
};

// Placeholder export removed as we now have actual exports
