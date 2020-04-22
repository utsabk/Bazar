'use strict';
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLSchema,
} = require('graphql');
const { GraphQLUpload } = require('graphql-upload');

const { createWriteStream } = require('fs');

const productSchema = require('../models/product');
const categorySchema = require('../models/category');
const statusSchema = require('../models/productStatus');
const userSchema = require('../models/user');
const resize = require('../utils/resize');

const geoJSONType = new GraphQLObjectType({
  name: 'geoJSON',
  fields: () => ({
    type: { type: GraphQLString },
    coordinates: { type: new GraphQLList(GraphQLFloat) },
  }),
});

const categoryType = new GraphQLObjectType({
  name: 'category',
  description: "product's category",
  fields: () => ({
    id: { type: GraphQLID },
    Title: { type: GraphQLString },
  }),
});

const productStatusType = new GraphQLObjectType({
  name: 'productstatustype',
  description: "product's availability",
  fields: () => ({
    id: { type: GraphQLID },
    Title: { type: GraphQLString },
  }),
});

const product = new GraphQLObjectType({
  name: 'product',
  description: 'product details',
  fields: () => ({
    id: { type: GraphQLID },
    Name: { type: GraphQLString },
    Description: { type: GraphQLString },
    Price: { type: GraphQLFloat },
    Status: {
      type: productStatusType,
      resolve: async (parent, args) => {
        try {
          console.log('product parent', parent);
          return await statusSchema.findById(parent.Status);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
    Category: {
      type: categoryType,
      resolve: async (parent, args) => {
        try {
          console.log('category parent', parent);
          return await categorySchema.findById(parent.Category);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
    Image: { type: GraphQLString },
    Owner: {
      type: new GraphQLNonNull(ownerType),
      resolve: async (parent, args) => {
        try {
          console.log('owner parent', parent);
          return await userSchema.findById(parent.Owner);
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
    Location: { type: geoJSONType },
  }),
});

const ownerType = new GraphQLObjectType({
  name: 'ownerType',
  description: 'Owner of the product',
  fields: () => ({
    id: { type: GraphQLID },
    Name: { type: GraphQLString },
    Email: { type: GraphQLString },
    Password: { type: GraphQLString },
    Phone: { type: GraphQLString },
    DP: { type: GraphQLString },
    Products: {
      type: new GraphQLList(product),
      require: async (parent, args) => {
        try {
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
  }),
});

const InputLocationType = new GraphQLInputObjectType({
  name: 'inputlocationtpye',
  fields: () => ({
    type: { type: GraphQLString, defaultValue: 'Point' },
    coordinates: { type: new GraphQLNonNull(new GraphQLList(GraphQLFloat)) },
  }),
});

const InputWithTitle = new GraphQLInputObjectType({
  name: 'inputwithtitle',
  fields: () => ({
    _id: { type: GraphQLID },
    Title: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Main Query',
  fields: {
    products: {
      type: new GraphQLNonNull(new GraphQLList(product)),
      descriptions: 'Get all the products',
      resolve: async (parent, args) => {
        try {
          return await productSchema.find();
        } catch (err) {
          return new Error(err.message);
        }
      },
    },
    categories: {
      type: new GraphQLList(categoryType),
      description: 'Get all the category',
      resolve: async (parent, args) => {
        try {
          return await categorySchema.find();
        } catch (err) {
          return new Error(err.message);
        }
      },
    },
    productStatus: {
      type: new GraphQLList(productStatusType),
      description: 'Get all the product status',
      resolve: async (parent, args) => {
        try {
          return await statusSchema.find();
        } catch (err) {
          return new Error(err.message);
        }
      },
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutation query',
  fields: {
    addProduct: {
      type: product,
      description: 'Add product',
      args: {
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Price: { type: GraphQLFloat },
        Status: { type: new GraphQLNonNull(GraphQLID) },
        Category: { type: new GraphQLNonNull(GraphQLID) },
        Image: {
          description: 'Image file',
          type: GraphQLUpload,
        },
        Owner: { type: GraphQLID },
        Location: { type: InputLocationType },
      },
      resolve: async (parent, args) => {
        console.log('addProduct args:--', args);
        try {

          const { filename, mimetype, createReadStream } = await args.Image;
          const file = await new Promise(async (resolve, reject) => {
            const createdFile = await createReadStream()
              .pipe(resize(300))
              .pipe(createWriteStream(__dirname + `/../uploads/${filename}`))
              .on('finish', () => resolve(createdFile))
              .on('error', () => reject(false));
          });

           const newProduct = new productSchema({ ...args,Image:'uploads/' +filename, });
           console.log('newProduct',newProduct)
           return await newProduct.save();


        } catch (err) {
          console.log("I'm inside error");
          throw new Error(err);
        }
      },
    },

    uploadImage: {
      description: 'Uploads an image.',
      type: GraphQLUpload,
      args: {
        image: {
          description: 'Image file.',
          type: GraphQLUpload,
        },
      },
      async resolve(parent, args) {
        console.log('uploadImage args',args)
        try {
          const { filename, mimetype, createReadStream } = await args.image;
          const file = await new Promise(async (resolve, reject) => {
            const createdFile = await createReadStream()
              .pipe(resize(300))
              .pipe(createWriteStream(__dirname + `/../uploads/${filename}`))
              .on('finish', () => resolve(createdFile))
              .on('error', () => reject(false));
          });
        } catch (err) {
          throw new Error(err);
        }
      },
    },

    addOwner: {
      type: ownerType,
      description: 'Add owner',
      args: {
        Name: { type: new GraphQLNonNull(GraphQLString) },
        Email: { type: new GraphQLNonNull(GraphQLString) },
        Password: { type: new GraphQLNonNull(GraphQLString) },
        Phone: { type: new GraphQLNonNull(GraphQLString) },
        DP: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        console.log('AddOwner args:--', args);
        try {
          const newOwner = new userSchema({ ...args });
          return await newOwner.save();
        } catch (err) {
          throw new Error(err);
        }
      },
    },

    addCategory: {
      type: categoryType,
      description: 'Add category',
      args: {
        Title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        console.log('addCategory args:--', args);
        try {
          const newCategory = new categorySchema({ ...args });
          return await newCategory.save();
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    addStatus: {
      type: productStatusType,
      description: 'Add status',
      args: {
        Title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        console.log('addStatus args:--', args);
        try {
          const newStatus = new statusSchema({ ...args });
          return await newStatus.save();
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
