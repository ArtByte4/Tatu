import { getFollowersQuery } from "../models/followerModel.js"


export const getFollowers = async (req, res) => {
    const followes = await getFollowersQuery();
    try{
        res.json({follow: followes})  
    }
    catch (err){
        res.json({error: err})
    }
}

