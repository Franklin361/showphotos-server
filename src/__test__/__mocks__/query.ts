import { fake_user, fake_post, fake_update_post, fake_comment } from './data'

const { email, name, password } = fake_user;
const { description, url_image } = fake_post;

export const QUERY_CREATE_USER = {
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

export const QUERY_LOGIN = {
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

export const QUERY_DELETE_USER = {
    query: `mutation DeleteUser {
      deleteUser{
        message
      }
    }`
};

export const QUERY_CREATE_POST = {
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
      variables:{
        description,
        url_image
      }
    }
};

export const QUERY_UPDATE_LIKES_POST = {
    query: `mutation UpdateLikeDislikePostImage($variables: LikeDislikePostInput!) {
      updateLikeDislikePostImage(variables: $variables) {
        id,
        dislike,
        likes
      }
    }`,
    variables: {
      variables:{
        id: "",
        likes: true,
        dislike: false
      }
    }
};

export const QUERY_UPDATE_POST = {
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
      variables:{
        id: "",
        description: fake_update_post.description,
        url_image: fake_update_post.url_image
      }
    }
};


export const QUERY_DELETE_POST = {
    query: `mutation DeletePostImage($deletePostImageId: String!) {
      deletePostImage(id: $deletePostImageId) {
        message
      }
    }`,
    variables: {
      deletePostImageId: ""
    }
};

export const QUERY_GET_POST_BY_USER = {
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

export const QUERY_GET_POST_BY_ID = {
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

export const QUERY_GET_FAVORITES_BY_USER = {
    query: `query GetFavoritesByUser {
      getFavoritesByUser {
        description,
        id
      }
    }`
};

export const QUERY_GET_SORT = {
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

export const QUERY_GET_BY_DESC = {
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

export const QUERY_CREATE_COMMENT = {
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
      variables:{
        description: fake_comment.description,
        id_post: ""
      }
    }
};
