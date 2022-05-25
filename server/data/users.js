import bcrypt from "bcryptjs"


const Users=[
        {
            name:"alem",
            email:"andy30@gmail.com",
            password:bcrypt.hashSync("123456",10),
            isAdmin:true
        },
        {
            name:"andy",
            email:"and30@gmail.com",
            password:bcrypt.hashSync("123456",10),
        }
    ]
    export default Users