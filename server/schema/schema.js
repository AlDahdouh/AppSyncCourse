const graphql = require("graphql");
const _ = require("lodash");
const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");

// const usersData = [
//   { id: "1", name: "Bond", age: 36, profession: "Teacher" },
//   { id: "13", name: "Anna", age: 26, profession: "Baker" },
//   { id: "221", name: "Bella", age: 16, profession: "Mechanic" },
//   { id: "19", name: "Gina", age: 26, profession: "Painter" },
//   { id: "150", name: "Georgina", age: 36 },
// ];

// const hobbyData = [
//   {
//     id: "1",
//     title: "running",
//     description: "This is a description ...",
//     userId: "1",
//   },
//   {
//     id: "2",
//     title: "walking",
//     description: "This is a description ...",
//     userId: "13",
//   },
//   {
//     id: "3",
//     title: "swimming",
//     description: "This is a description ...",
//     userId: "13",
//   },
//   {
//     id: "4",
//     title: "talking",
//     description: "This is a description ...",
//     userId: "19",
//   },
//   {
//     id: "5",
//     title: "drawing",
//     description: "This is a description ...",
//     userId: "221",
//   },
// ];

// const postData = [
//   { id: "1", comment: "running", userId: "1" },
//   { id: "2", comment: "walking", userId: "1" },
//   { id: "3", comment: "swimming", userId: "19" },
//   { id: "4", comment: "talking", userId: "221" },
//   { id: "5", comment: "drawing", userId: "1" },
// ];

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  description: "Documentation for user",
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
    profession: { type: graphql.GraphQLString },
    posts: {
      type: new graphql.GraphQLList(PostType),
      async resolve(parent, args) {
        return await Post.find({ userId: parent.id });
      },
    },
    hobbies: {
      type: new graphql.GraphQLList(HobbyType),
      async resolve(parent, args) {
        return await Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new graphql.GraphQLObjectType({
  name: "hobby",
  description: "A hobby type",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    title: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
    user: {
      type: UserType,
      async resolve(parent, args) {
        return await User.findById(parent.userId);
      },
    },
  }),
});

const PostType = new graphql.GraphQLObjectType({
  name: "Post",
  description: "A Post type",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    comment: { type: graphql.GraphQLString },
    user: {
      type: UserType,
      async resolve(parent, args) {
        return await User.findById(parent.userId);
      },
    },
  }),
});

const RootQuery = new graphql.GraphQLObjectType({
  name: "RootQueryType",
  description: "This is the root query",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: graphql.GraphQLString } },
      async resolve(parent, args) {
        return await User.findById(args.id);
      },
    },
    users: {
      type: new graphql.GraphQLList(UserType),
      async resolve(parent, args) {
        return await User.find({});
      },
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: graphql.GraphQLID } },
      async resolve(parent, args) {
        return await Hobby.findById(args.id);
      },
    },
    hobbies: {
      type: new graphql.GraphQLList(HobbyType),
      async resolve(parent, args) {
        return await Hobby.find({});
      },
    },
    post: {
      type: PostType,
      args: { id: { type: graphql.GraphQLID } },

      async resolve(parent, args) {
        return await Post.findById(args.id);
      },
    },
    posts: {
      type: new graphql.GraphQLList(PostType),
      async resolve(parent, args) {
        return await Post.find({});
      },
    },
  },
});

// Mutations
const Mutation = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        age: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        profession: { type: graphql.GraphQLString },
      },
      async resolve(parent, args) {
        let user = new User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });
        await user.save();
        return user;
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
        name: { type: graphql.GraphQLString },
        age: { type: graphql.GraphQLInt },
        profession: { type: graphql.GraphQLString },
      },
      async resolve(parent, args) {
        return await User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true }
        );
      },
    },
    createPost: {
      type: PostType,
      args: {
        comment: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        userId: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
      },
      async resolve(parent, args) {
        const user = await User.findById(args.userId);
        let post = new Post({
          comment: args.comment,
          userId: user._id,
        });
        await post.save();
        return post;
      },
    },
    createHobby: {
      name: "Create hobby mucation",
      type: HobbyType,
      args: {
        title: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        description: { type: graphql.GraphQLString },
        userId: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
      },
      async resolve(parent, args) {
        const user = await User.findById(args.userId);
        let hobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: user._id,
        });
        await hobby.save();
        return hobby;
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
