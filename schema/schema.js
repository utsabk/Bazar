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
          throw new Error(err.message);
        }
      },
    },
    products: {
      type: new GraphQLNonNull(new GraphQLList(productType)),
      description: 'Get all the products',
      args: {
        categoryId: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        try {
          if (args.categoryId) {
            return await productSchema.find({
              Category: { _id: args.categoryId },
            });
          } else if (args.userId) {
            return await productSchema.find({
              Owner: args.userId,
            });
          } else {
            return await productSchema.find();
          }
        } catch (err) {
          throw new Error(err.message);
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
          return await userSchema.findById(args.id);
        } catch (err) {
          throw new Error(err.message);
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
          throw new Error(err.message);
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
          throw new Error(err.message);
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
          throw new Error(err.message);
        }
      },
    },

    chats: {
      type: new GraphQLList(chatType),
      description: 'Get all the messages authentication required',
      args: {
        senderID: { type: GraphQLID },
        sendToID: { type: GraphQLID },
      },
      resolve: async (parent, args, { req, res }) => {
        try {
          await authController.checkAuth(req, res);
          if (args.senderID && args.sendToID) {
            return await Chat.find().and([
              { $or: [{ sender: args.senderID }, { sender: args.sendToID }] },
              { $or: [{ sendTo: args.sendToID }, { sendTo: args.senderID }] },
            ]);

            // return await Chat.find({sender:args.senderID, sendTo: args.sendToID});
          } else {
            return await Chat.find();
          }
        } catch (err) {
          console.log('Error fetching data from database:-', err);
          throw new Error(err.message);
        }
      },
    },

    search:{
      type: new GraphQLList(productType),
      description: 'Get the matching product based on search syntax',
      args:{
        text:{ type: GraphQLString },
      },
      resolve: async(parent, args, {req, res})=>{
        try{

          let query = [
            { 'Name': { $regex: new RegExp(args.text, "i") } },
            { 'Description': { $regex: new RegExp(args.text, "i") } },
            ]
        const result = await productSchema.find({ $or: query }) ;
        return result;
        }catch(err){
          throw new Error(err);
        }
      }
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
      resolve: async (parent, args, { req, res }) => {
        console.log('addProduct args:--', args);
        try {
          await authController.checkAuth(req, res);
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
          return await newProduct.save();
        } catch (err) {
          throw new Error(err);
        }
      },
    },

    uploadImage: {
      description: 'Uploads an image.',
      type: GraphQLUpload,
      args: {
        id: { type: GraphQLID },
        image: {
          description: 'Image file.',
          type: GraphQLUpload,
        },
      },
      async resolve(parent, args, { req, res }) {
        try {
          await authController.checkAuth(req, res);
          const { filename, mimetype, createReadStream } = await args.image;
          const file = await new Promise(async (resolve, reject) => {
            const createdFile = await createReadStream()
              .pipe(resize(300))
              .pipe(
                createWriteStream(__dirname + `/../public/profile/${filename}`)
              )
              .on('finish', () => resolve(createdFile))
              .on('error', () => reject(false));
          });
          return await userSchema.findByIdAndUpdate(
            args.id,
            { dp: 'profile/' + filename },
            { new: true }
          );
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
        try {
          const hash = await bcrypt.hash(args.password, saltRound);
          const newArgs = { ...args, password: hash };
          console.log('New args:', newArgs);

          const newUser = new userSchema(newArgs);
          const result = await newUser.save();

          if (result !== null) {
            req.body = args;
            req.body.username = args.email;
            const response = await authController.auth(req, res);
            return {
              id: response.user._id,
              ...response.user,
              token: response.token,
            };
          } else {
            throw new Error('insert fail');
          }
        } catch (err) {
          throw new Error(err.message);
        }
      },
    },
    modifyProduct: {
      type: productType,
      description: 'Modify a product, authentication required',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        Name: { type: GraphQLString },
        Description: { type: GraphQLString },
        Price: { type: GraphQLFloat },
        Status: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args, { req, res }) => {
        try {
         await authController.checkAuth(req, res);
          return await productSchema.findByIdAndUpdate(
            args.id,
            {
              Name: args.Name,
              Description: args.Description,
              Price: args.Price,
              Status: args.Status,
            },
            { new: true }
          );
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    deleteProduct: {
      type: productType,
      description: 'Delete a product, authentication required',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args, { req, res }) => {
        try {
         await authController.checkAuth(req, res);
          return await productSchema.findByIdAndDelete(args.id);
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
