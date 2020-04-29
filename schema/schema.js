'use strict';

const { GraphQLUpload } = require('graphql-upload');
const { createWriteStream } = require('fs');
const bcrypt = require('bcrypt');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLSchema,
} = require('graphql');

const {
  geoJSONType,
  categoryType,
  productStatusType,
  productType,
  ownerType,
  chatType,
  InputLocationType,
} = require('./types');

const saltRound = 12;

const authController = require('../controllers/authController');
const productSchema = require('../models/product');
const categorySchema = require('../models/category');
const statusSchema = require('../models/productStatus');
const userSchema = require('../models/user');
const Chat = require('../models/chat');
const resize = require('../utils/resize');

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Main Query',
  fields: {
    login: {
      type: ownerType,
      description: 'Authentication with username & password',
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, { req, res }) => {
        req.body = args;
        req.body.username = args.username;
        try {
          const response = await authController.auth(req, res);
          console.log('ar', response);
          return {
            id: response.user._id,
            ...response.user,
            token: response.token,
          };
        } catch (err) {
          throw new Error(err);
        }
      },
    },

    product: {
      type: productType,
      description: 'Get a product by ID',
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        try {
          return await productSchema.findById(args.id);
        } catch (err) {
          return new Error(err.message);
        }
      },
    },
    products: {
      type: new GraphQLNonNull(new GraphQLList(productType)),
      description: 'Get all the products',
      args: {
        categoryId: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        try {
          if (args.categoryId) {
            return await productSchema.find({
              Category: {
                _id: args.categoryId,
              },
            });
          } else {
            return await productSchema.find();
          }
        } catch (err) {
          return new Error(err.message);
        }
      },
    },
    owner: {
      type: ownerType,
      description: 'Get the user with token',
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          console.log('ownerById args ', args);
          return await userSchema.findById(args.id);
        } catch (err) {
          return new Error(err.message);
        }
      },
    },
    owners: {
      type: new GraphQLNonNull(new GraphQLList(ownerType)),
      description: 'Get all the owners/user',
      resolve: async (parent, args) => {
        try {
          return await userSchema.find();
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

    chats: {
      type: new GraphQLList(chatType),
      description: 'Get all the messages',
      resolve: async (parent, args) => {
        try {
          return await Chat.find();
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
    product: {
      type: productType,
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
              .pipe(
                createWriteStream(__dirname + `/../public/uploads/${filename}`)
              )
              .on('finish', () => resolve(createdFile))
              .on('error', () => reject(false));
          });

          const newProduct = new productSchema({
            ...args,
            Image: 'uploads/' + filename,
          });
          console.log('newProduct', newProduct);
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
        console.log('uploadImage args', args);
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
    registerUser: {
      type: ownerType,
      description: 'Register a user',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLString },
      },
      resolve: async (parent, args, { req, res }) => {
        console.log('Register args:', args);
        try {
          const hash = await bcrypt.hash(args.password, saltRound);
          const newArgs = { ...args, password: hash };
          console.log('New args:', newArgs);

          const newUser = new userSchema(newArgs);
          const result = await newUser.save();

          if (result !== null) {
            console.log('Im inside if clause');
            req.body = args;
            req.body.username = args.email;
            console.log('req.body', req.body);
            const response = await authController.auth(req, res);
            console.log('ar', response);
            return {
              id: response.user._id,
              ...response.user,
              token: response.token,
            };
          } else {
            throw new Error('insert fail');
          }
        } catch (err) {
          new Error(err.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
