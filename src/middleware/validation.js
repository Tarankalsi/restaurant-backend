const Joi = require('joi');

// Validation schemas
const reservationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be exactly 10 digits'
    }),
  
  date: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.base': 'Date must be a valid date',
      'date.min': 'Reservation date must be today or a future date',
      'any.required': 'Date is required'
    }),
  
  time: Joi.string()
    .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
    .required()
    .messages({
      'string.empty': 'Time is required',
      'string.pattern.base': 'Time must be in HH:MM AM/PM format (e.g., 7:30 PM)'
    }),
  
  guests: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      'number.base': 'Number of guests must be a number',
      'number.integer': 'Number of guests must be a whole number',
      'number.min': 'There must be at least 1 guest',
      'number.max': 'Maximum 20 guests allowed per reservation'
    })
});

const checkAvailabilitySchema = Joi.object({
  date: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.base': 'Date must be a valid date',
      'date.min': 'Date must be today or a future date',
      'any.required': 'Date is required'
    }),
  
  time: Joi.string()
    .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
    .required()
    .messages({
      'string.empty': 'Time is required',
      'string.pattern.base': 'Time must be in HH:MM AM/PM format (e.g., 7:30 PM)'
    })
});

const updateReservationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits'
    }),
  
  date: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.base': 'Date must be a valid date',
      'date.min': 'Reservation date must be today or a future date'
    }),
  
  time: Joi.string()
    .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
    .optional()
    .messages({
      'string.pattern.base': 'Time must be in HH:MM AM/PM format (e.g., 7:30 PM)'
    }),
  
  guests: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .optional()
    .messages({
      'number.base': 'Number of guests must be a number',
      'number.integer': 'Number of guests must be a whole number',
      'number.min': 'There must be at least 1 guest',
      'number.max': 'Maximum 20 guests allowed per reservation'
    })
});

const statusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled')
    .required()
    .messages({
      'string.empty': 'Status is required',
      'any.only': 'Status must be one of: pending, confirmed, cancelled'
    })
});

const dateParamSchema = Joi.object({
  date: Joi.date()
    .required()
    .messages({
      'date.base': 'Date must be a valid date format (YYYY-MM-DD)',
      'any.required': 'Date parameter is required'
    })
});

const statusParamSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled')
    .required()
    .messages({
      'string.empty': 'Status parameter is required',
      'any.only': 'Status must be one of: pending, confirmed, cancelled'
    })
});

const idParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Reservation ID is required',
      'string.pattern.base': 'Invalid reservation ID format'
    })
});

// Validation middleware function
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessages
      });
    }
    
    // Replace the request data with validated data
    req[property] = value;
    next();
  };
};

// Export validation functions
module.exports = {
  validateReservation: validate(reservationSchema, 'body'),
  validateCheckAvailability: validate(checkAvailabilitySchema, 'body'),
  validateUpdateReservation: validate(updateReservationSchema, 'body'),
  validateStatusUpdate: validate(statusUpdateSchema, 'body'),
  validateDateParam: validate(dateParamSchema, 'params'),
  validateStatusParam: validate(statusParamSchema, 'params'),
  validateIdParam: validate(idParamSchema, 'params'),
  
  // Schemas for testing or other uses
  reservationSchema,
  checkAvailabilitySchema,
  updateReservationSchema,
  statusUpdateSchema,
  dateParamSchema,
  statusParamSchema,
  idParamSchema
}; 