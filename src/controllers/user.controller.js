import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser= asyncHandler ( async (req,res)=>{
    res.status(200).json({
     user:"Rahultaakhr",
     age:19,
     email:"rahultaakhr@gmail.com"
    })
})
export { registerUser}