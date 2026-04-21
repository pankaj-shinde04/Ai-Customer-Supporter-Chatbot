import { connect } from "mongoose";

const mongo_Url = process.env.MONGODB_URI 
if (!mongo_Url) {
  throw new Error("mongodb url is not found");
}
const cache = global.mongoose;
if (!cache) {
   global.mongoose = { conn: null, promise: null };
}

const connectDb = async () =>{
 if(cache.conn){
    return cache.conn;
 }
 
 if(!cache.promise){
   cache.promise = connect(mongo_Url!).then((c)=>c.connection)

 }

    try {
       cache.conn = await cache.promise 
    } catch (error) {
        console.log(error);
        
    }

    return cache.conn;
}

export default connectDb;