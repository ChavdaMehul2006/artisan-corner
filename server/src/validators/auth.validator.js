const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().trim().email('Please provide a valid email address (e.g. name@example.com)'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional().nullable().or(z.literal(''))
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    phone: z.string().optional()
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
};
