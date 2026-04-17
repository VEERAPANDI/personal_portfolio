const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
    icon: { type: String }, // URL or icon name
    category: { type: String } // Frontend, Backend, Tools
}, { timestamps: true });

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // Legacy field, kept for backward compatibility
    tags: [{ type: String }],
    link: { type: String },
    githubLink: { type: String },
    // Featured Image with optimization (no SEO settings for projects)
    featuredImage: {
        optimized_image_url: { type: String, default: '' },
        image_context_text: { type: String, default: '' },
        original_url: { type: String, default: '' },
        unsplash_id: { type: String, default: '' },
        photographer: { type: String, default: '' },
        photographer_url: { type: String, default: '' }
    }
}, { timestamps: true });

const personalProjectSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    githubLink: { type: String, required: true, unique: true },
    language: { type: String },
    stars: { type: Number, default: 0 },
    homepage: { type: String }, // optional live link
    featuredImage: {
        optimized_image_url: { type: String, default: '' },
        image_context_text: { type: String, default: '' },
        original_url: { type: String, default: '' },
        unsplash_id: { type: String, default: '' },
        photographer: { type: String, default: '' },
        photographer_url: { type: String, default: '' }
    }
}, { timestamps: true });

const experienceSchema = mongoose.Schema({
    company: { type: String, required: true },
    companyWebsite: { type: String },
    workingYear: { type: String }, // e.g., "Jan 2021 - Present"
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null means current
    description: { type: String },
    location: { type: String }
}, { timestamps: true });

const messageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    visits: { type: Number, default: 0 },
    author: { type: String, default: 'Admin' },
    isPublished: { type: Boolean, default: true },
    // Featured Image with SEO & RAG optimization
    featuredImage: {
        optimized_image_url: { type: String, default: '' },
        image_context_text: { type: String, default: '' },
        original_url: { type: String, default: '' },
        unsplash_id: { type: String, default: '' },
        photographer: { type: String, default: '' },
        photographer_url: { type: String, default: '' }
    },
    // SEO Configuration
    seo: {
        metaTitle: { type: String, default: '' },
        metaDescription: { type: String, default: '' },
        metaKeywords: { type: String, default: '' },
        ogImage: { type: String, default: '' },
        canonicalUrl: { type: String, default: '' },
        robotsMeta: { type: String, default: 'index, follow' }
    },
    // RAG (Retrieval Augmented Generation) Configuration
    rag: {
        isEnabled: { type: Boolean, default: true },
        priority: { type: Number, default: 5, min: 1, max: 10 },
        category: { type: String, default: 'general' },
        contextWindow: { type: Number, default: 2000 },
        embeddingModel: { type: String, default: 'text-embedding-3-small' }
    }
}, { timestamps: true });

const newsletterSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
    unsubscribedAt: { type: Date }
}, { timestamps: true });

const contactSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    repliedAt: { type: Date }
}, { timestamps: true });

const resumeDownloadSchema = mongoose.Schema({
    ipAddress: { type: String },
    userAgent: { type: String },
    source: { type: String, enum: ['hero', 'footer', 'agent'], required: true }
}, { timestamps: true });

/**
 * Generic upsert function that creates or updates a document safely.
 * Handles schema evolution and nested object updates.
 * 
 * @param {Model} Model - Mongoose model to operate on
 * @param {Object} data - The data to upsert
 * @param {string} uniqueField - The field to use as unique identifier (e.g., 'slug', 'name', 'email')
 * @param {Object} options - Additional options (session, etc.)
 * @returns {Promise<{document: Object, isNew: boolean}>} - The document and whether it was created
 * 
 * @example
 * // Upsert a blog by slug
 * const { document, isNew } = await upsertDocument(Blog, blogData, 'slug');
 * 
 * // Upsert a skill by name
 * const { document, isNew } = await upsertDocument(Skill, skillData, 'name');
 */
async function upsertDocument(Model, data, uniqueField = 'slug', options = {}) {
    const { session = null, logger = console } = options;
    
    try {
        // Validate required parameters
        if (!Model || !data || !data[uniqueField]) {
            throw new Error(`Missing required parameters: Model, data, or uniqueField '${uniqueField}'`);
        }
        
        // Build the query filter using the unique field
        const filter = { [uniqueField]: data[uniqueField] };
        
        // Prepare the update object using $set for partial updates
        // This preserves existing fields not provided in the update
        const update = { $set: {} };
        
        // Iterate through data and build $set object
        // Handle nested objects by using dot notation for partial updates
        Object.keys(data).forEach(key => {
            if (key === uniqueField) return; // Skip the unique identifier
            
            const value = data[key];
            
            if (value !== undefined && value !== null) {
                if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                    // For nested objects, use dot notation to update only provided fields
                    // This prevents overwriting the entire nested object
                    Object.keys(value).forEach(nestedKey => {
                        if (value[nestedKey] !== undefined && value[nestedKey] !== null) {
                            update.$set[`${key}.${nestedKey}`] = value[nestedKey];
                        }
                    });
                } else {
                    // For primitive values and arrays, set directly
                    update.$set[key] = value;
                }
            }
        });
        
        // Configure findOneAndUpdate options
        const findOptions = {
            upsert: true,              // Create if doesn't exist
            new: true,                 // Return the updated document
            setDefaultsOnInsert: true, // Apply schema defaults on insert
            runValidators: true,       // Run schema validators on update
            ...(session && { session }) // Include session if provided (for transactions)
        };
        
        // Execute the upsert operation
        const document = await Model.findOneAndUpdate(filter, update, findOptions);
        
        // Determine if document was created or updated
        // We can check by comparing timestamps or using a flag
        const isNew = document.createdAt && document.createdAt.getTime() === document.updatedAt.getTime();
        
        // Log the operation
        if (isNew) {
            logger.log(`[Upsert] Created new ${Model.modelName} document with ${uniqueField}: ${data[uniqueField]}`);
        } else {
            logger.log(`[Upsert] Updated existing ${Model.modelName} document with ${uniqueField}: ${data[uniqueField]}`);
        }
        
        return { document, isNew };
        
    } catch (error) {
        logger.error(`[Upsert] Error upserting ${Model.modelName}:`, error.message);
        throw error;
    }
}

/**
 * Convenience function specifically for Blog upserts
 * Uses 'slug' as the unique identifier
 * 
 * @param {Object} data - Blog data to upsert
 * @param {Object} options - Additional options
 * @returns {Promise<{document: Object, isNew: boolean}>}
 * 
 * @example
 * const result = await upsertBlog({
 *     slug: 'unsplash-seo',
 *     title: 'SEO Guide',
 *     featuredImage: {
 *         optimized_image_url: '...',
 *         image_context_text: 'mountain sunset'
 *     }
 * });
 */
async function upsertBlog(data, options = {}) {
    const Blog = mongoose.model('Blog');
    return upsertDocument(Blog, data, 'slug', options);
}

/**
 * Convenience function specifically for Skill upserts
 * Uses 'name' as the unique identifier
 * 
 * @param {Object} data - Skill data to upsert
 * @param {Object} options - Additional options
 * @returns {Promise<{document: Object, isNew: boolean}>}
 */
async function upsertSkill(data, options = {}) {
    const Skill = mongoose.model('Skill');
    return upsertDocument(Skill, data, 'name', options);
}

/**
 * Convenience function specifically for Project upserts
 * Uses 'title' as the unique identifier
 * 
 * @param {Object} data - Project data to upsert
 * @param {Object} options - Additional options
 * @returns {Promise<{document: Object, isNew: boolean}>}
 */
async function upsertProject(data, options = {}) {
    const Project = mongoose.model('Project');
    return upsertDocument(Project, data, 'title', options);
}

/**
 * Convenience function specifically for Experience upserts
 * Uses combination of 'company' and 'role' as unique identifier
 * 
 * @param {Object} data - Experience data to upsert
 * @param {Object} options - Additional options
 * @returns {Promise<{document: Object, isNew: boolean}>}
 */
async function upsertExperience(data, options = {}) {
    const Experience = mongoose.model('Experience');
    // For experience, we use a compound unique identifier
    if (!data.company || !data.role) {
        throw new Error('Experience upsert requires both company and role fields');
    }
    
    const filter = { company: data.company, role: data.role };
    const update = { $set: {} };
    
    // Build update object excluding company and role
    Object.keys(data).forEach(key => {
        if (key !== 'company' && key !== 'role' && data[key] !== undefined) {
            update.$set[key] = data[key];
        }
    });
    
    const findOptions = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
        ...(options.session && { session: options.session })
    };
    
    const document = await Experience.findOneAndUpdate(filter, update, findOptions);
    const isNew = document.createdAt && document.createdAt.getTime() === document.updatedAt.getTime();
    
    const logger = options.logger || console;
    if (isNew) {
        logger.log(`[Upsert] Created new Experience: ${data.company} - ${data.role}`);
    } else {
        logger.log(`[Upsert] Updated existing Experience: ${data.company} - ${data.role}`);
    }
    
    return { document, isNew };
}

module.exports = {
    Skill: mongoose.model('Skill', skillSchema),
    Project: mongoose.model('Project', projectSchema),
    Experience: mongoose.model('Experience', experienceSchema),
    Blog: mongoose.model('Blog', blogSchema),
    Message: mongoose.model('Message', messageSchema),
    Newsletter: mongoose.model('Newsletter', newsletterSchema),
    Contact: mongoose.model('Contact', contactSchema),
    ResumeDownload: mongoose.model('ResumeDownload', resumeDownloadSchema),
    PersonalProject: mongoose.model('PersonalProject', personalProjectSchema),
    // Export upsert utilities
    upsertDocument,
    upsertBlog,
    upsertSkill,
    upsertProject,
    upsertExperience
};
