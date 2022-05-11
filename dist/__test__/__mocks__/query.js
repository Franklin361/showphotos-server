"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUERY_CREATE_COMMENT = exports.QUERY_GET_BY_DESC = exports.QUERY_GET_SORT = exports.QUERY_GET_FAVORITES_BY_USER = exports.QUERY_GET_POST_BY_ID = exports.QUERY_GET_POST_BY_USER = exports.QUERY_DELETE_POST = exports.QUERY_UPDATE_POST = exports.QUERY_UPDATE_LIKES_POST = exports.QUERY_CREATE_POST = exports.QUERY_DELETE_USER = exports.QUERY_LOGIN = exports.QUERY_CREATE_USER = void 0;
const data_1 = require("./data");
const { email, name, password } = data_1.fake_user;
const { description, url_image } = data_1.fake_post;
exports.QUERY_CREATE_USER = {
    query: `mutation CreateUser($variables: UserInput!) {
    createUser(variables: $variables) {
      token,
      message,
      user {
        id,
        email,
        name
      }
    }
  }`,
    variables: {
        variables: {
            email,
            name,
            password,
        },
    },
};
exports.QUERY_LOGIN = {
    query: `mutation Login($variables: UserLoginInput!) {
      login(variables: $variables) {
        message,
        token,
        user {
        email,
        id,
        name
        }
      }
      }`,
    variables: {
        variables: {
            email,
            password,
        },
    },
};
exports.QUERY_DELETE_USER = {
    query: `mutation DeleteUser {
      deleteUser{
        message
      }
    }`
};
exports.QUERY_CREATE_POST = {
    query: `mutation CreatePostImage($variables: PostInput!) {
      createPostImage(variables: $variables) {
        message,
        post {
          description,
          id,
          url_image,
          user {
            id
          },
          likes,
          dislike,
          createdAt
        }
      }
    }`,
    variables: {
        variables: {
            description,
            url_image
        }
    }
};
exports.QUERY_UPDATE_LIKES_POST = {
    query: `mutation UpdateLikeDislikePostImage($variables: LikeDislikePostInput!) {
      updateLikeDislikePostImage(variables: $variables) {
        id,
        dislike,
        likes
      }
    }`,
    variables: {
        variables: {
            id: "",
            likes: true,
            dislike: false
        }
    }
};
exports.QUERY_UPDATE_POST = {
    query: `mutation UpdatePostImage($variables: PutPostInput!) {
      updatePostImage(variables: $variables) {
         message,
        post {
          description,
          id,
          url_image,
          user {
            id
          },
          likes,
          dislike,
          createdAt
        }
      }
    }`,
    variables: {
        variables: {
            id: "",
            description: data_1.fake_update_post.description,
            url_image: data_1.fake_update_post.url_image
        }
    }
};
exports.QUERY_DELETE_POST = {
    query: `mutation DeletePostImage($deletePostImageId: String!) {
      deletePostImage(id: $deletePostImageId) {
        message
      }
    }`,
    variables: {
        deletePostImageId: ""
    }
};
exports.QUERY_GET_POST_BY_USER = {
    query: `query GetPostByUser {
      getPostByUser {
        user {
          id
        },
        description,
        url_image,
        id
      }
    }`
};
exports.QUERY_GET_POST_BY_ID = {
    query: `query GetPostById($getPostByIdId: String!) {
      getPostById(id: $getPostByIdId) {
        user {
          id
        },
        description,
        url_image,
        id
      }
    }`,
    variables: {
        getPostByIdId: ""
    }
};
exports.QUERY_GET_FAVORITES_BY_USER = {
    query: `query GetFavoritesByUser {
      getFavoritesByUser {
        description,
        id
      }
    }`
};
exports.QUERY_GET_SORT = {
    query: `query GetPostSort($typeSort: String!) {
      getPostSort(type_sort: $typeSort) {
        dislike,
        likes,
        createdAt
      }
    }`,
    variables: {
        typeSort: ""
    }
};
exports.QUERY_GET_BY_DESC = {
    query: `query GetPostByDesc($description: String!) {
      getPostByDesc(description: $description) {
        description,
        id
      }
    }`,
    variables: {
        description: ""
    }
};
exports.QUERY_CREATE_COMMENT = {
    query: `mutation CreateComment($variables: CommentInput!) {
      createComment(variables: $variables) {
        message,
        comment {
          description,
          id,
          post {
            id
          },
          user {
            id
          }
        }
      }
    }`,
    variables: {
        variables: {
            description: data_1.fake_comment.description,
            id_post: ""
        }
    }
};
//# sourceMappingURL=query.js.map