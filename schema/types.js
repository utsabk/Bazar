'use strict';
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const userSchema = require('../models/user');
const statusSchema = require('../models/productStatus');
const categorySchema = require('../models/category');
const productSchema = require('../models/product');

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

const productType = new GraphQLObjectType({
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
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    phone: { type: GraphQLString },
    dp: { type: GraphQLString },
    products: {
      type: new GraphQLList(productType),
      resolve: async (parent, args) => {
        try {
          return await productSchema.find({ 
            Owner: parent.id
           });
        } catch (e) {
          return new Error(e.message);
        }
      },
    },
    token: { type: GraphQLString },
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

module.exports = {
  geoJSONType,
  categoryType,
  productStatusType,
  productType,
  ownerType,
  InputLocationType,
  InputWithTitle,
};
