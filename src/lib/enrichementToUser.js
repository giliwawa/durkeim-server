 let userTransformer = (enrichement) => {
  let user = {};

  user.user_info = {
    email : enrichement.person.email,
    first_name: enrichement.person.name.givenName,
    last_name : enrichement.person.name.familyName,
    occupation: "",
    company : enrichement.company.name,
    bio : enrichement.person.bio || "",
    social:[
      {
        twitter : enrichement.person.twitter.handle || ""
      },
      {
        facebook : enrichement.person.facebook.handle || ""
      }
    ],
    profile_img: enrichement.person.avatar || ""
  }

  return user;
}


export default userTransformer
