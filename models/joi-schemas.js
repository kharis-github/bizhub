// Definisi2 schema Joi, untuk keperluan validasi data dari form2 user

const BaseJoi = require('joi');
// Sanitize HTML - komponen untuk mencegah user mengupload data yang berbentuk HTML
const sanitizeHtml = require('sanitize-html');

// Extension kepada Joi untuk memungkinkan sanitization terhadap pengiriman data yang mengandung HTML dari user forms
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} tidak boleh mengandung elemen HTML, karena dapat menyebabkan permasalahan!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

// Business Model
const businessJoiSchema = Joi.object({
    name: Joi.string()
        .required()
        .escapeHTML(),
    category: Joi.string()
        .required()
        .escapeHTML(),
    description: Joi.string()
        .escapeHTML(),
    provinsi: Joi.string()
        .required(),
    kabupaten: Joi.string()
        .allow(null, ''),
    kecamatan: Joi.string()
        .allow(null, ''),
    address: Joi.string()
        .allow(null, '')
        .escapeHTML(),
    postal_code: Joi.number()
        .allow(null, ''),
    phone: Joi.number()
        .allow(null, ''),
    website: Joi.string()
        .regex(new RegExp(/\bwww.\S+/))
        .allow(null, '')
        .escapeHTML(), // www.spaghettinoodles.com
    deleteImages: Joi.array()
});

// Review Model
const reviewJoiSchema = Joi.object({
    rating: Joi.number().required(),
    review: Joi.string().required()
})

module.exports = { businessJoiSchema, reviewJoiSchema }