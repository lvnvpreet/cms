import { Request, Response, NextFunction } from 'express';
// import { Schema, ValidationResult, ValidationError } from 'joi'; // Example dependency (Joi)
// import { validationResult, body, query, param } from 'express-validator'; // Example dependency (express-validator)

/**
 * Validation Middleware
 *
 * Validates incoming request data against predefined schemas or rules.
 * Covers:
 * - Request body validation
 * - Query parameter validation
 * - URL parameter validation
 * - Data type checking, required fields, custom rules
 * - Formats validation errors consistently.
 */

/**
 * Formats validation errors (example using express-validator style).
 */
const formatValidationErrors = (errors: any[]): Record<string, string[]> => {
  const formattedErrors: Record<string, string[]> = {};
  errors.forEach(err => {
    const field = err.param || err.path || 'general'; // Adjust based on library
    if (!formattedErrors[field]) {
      formattedErrors[field] = [];
    }
    formattedErrors[field].push(err.msg || 'Invalid value'); // Adjust based on library
  });
  return formattedErrors;
};

/**
 * Generic validation middleware factory using a schema (e.g., Joi).
 * Replace with your chosen validation library's approach.
 */
// export const validateWithSchema = (schema: Schema, property: 'body' | 'query' | 'params') => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     console.log(`Validation Middleware: Validating request ${property}`);
//     const { error, value } = schema.validate(req[property], { abortEarly: false });

//     if (error) {
//       console.error(`Validation Error (${property}):`, error.details);
//       const formattedErrors = formatValidationErrors(error.details); // Adapt formatting
//       return res.status(400).json({ message: 'Validation failed', errors: formattedErrors });
//     }

//     req[property] = value; // Use validated/sanitized value
//     next();
//   };
// };

/**
 * Example validation middleware using express-validator.
 * Define specific validation chains in your routes or controllers.
 */
// export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
//   console.log('Validation Middleware: Handling validation results');
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.error('Validation Errors:', errors.array());
//     const formattedErrors = formatValidationErrors(errors.array());
//     return res.status(400).json({ message: 'Validation failed', errors: formattedErrors });
//   }
//   next();
// };

// Placeholder middleware if no specific validation is applied yet
export const placeholderValidation = (req: Request, res: Response, next: NextFunction) => {
  console.log('Validation Middleware: Placeholder - No validation rules applied.');
  // In a real app, you'd likely use specific validation chains per route
  // Example using express-validator (would be defined near the route):
  // [
  //   body('email').isEmail().normalizeEmail(),
  //   body('password').isLength({ min: 5 }),
  //   handleValidationErrors // Apply this middleware after the chains
  // ]
  next();
};
