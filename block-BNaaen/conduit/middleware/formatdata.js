function userJSON(user, token) {
  return {
    username: user.username,
    email: user.email,
    bio: user.bio,
    avatar: user.avatar,
    token: token,
  };
}

function userProfile(user, id = null) {
  return {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: id ? user.followingList.includes(id) : false,
  };
}

function articleformat(article, id = null) {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    taglist: article.taglist,
    createAt: article.createAt,
    updatedAt: article.createAt,
    favorited: id ? article.favoriteList.includes(id) : false,
    favoritedCount: article.favoritedCount,
    author: userProfile(article.author, id),
  };
}

function commentformat(comment, id = null) {
  return {
    id: comment._id,
    createAt: comment.createAt,
    updatedAt: comment.createAt,
    body: comment.body,
    author: userProfile(comment.author, id),
  };
}

function formatArticle(articles, id = null) {
  return articles.map((eachArticle) => {
    articleformat(eachArticle, id);
  });
}

function formatcomments(comments, id = null) {
  return comments.map((comment) => {
    commentformat(comment, id);
  });
}

function randomNumber(num = 123456) {
  return Math.floor(Math.random() * num);
}

module.exports = {
  userJSON,
  userProfile,
  articleformat,
  commentformat,
  formatArticle,
  formatcomments,
  randomNumber,
};
