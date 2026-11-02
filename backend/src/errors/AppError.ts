// src/errors/AppError.ts
// Base custom error class. All domain errors extend this.

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 – invalid input
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

// 404 – resource not found
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found.`, 404);
  }
}

// 415 – unsupported media type
export class UnsupportedFileError extends AppError {
  constructor() {
    super("Only PDF files are supported.", 415);
  }
}

// 502 – upstream AI error
export class AIServiceError extends AppError {
  constructor(detail?: string) {
    super(`AI service error${detail ? ": " + detail : "."}`, 502);
  }
}
