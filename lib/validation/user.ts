import * as z from 'zod';

const UserValidation = z.object({
    profile_photo : z.string().url().nonempty({message:"it should not be empty"}),
    name:z.string().min(3, {message: "Minimum 3 Char"}).max(30),
    username:z.string().min(3, {message: "Minimum 3 Char"}).max(30),
    bio:z.string().min(3, {message: "Minimum 3 Char"}).max(1000),
})

export default UserValidation;