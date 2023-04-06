const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    extractUserData(payload) {
        const user = {
            username: payload.username,
            password: payload.password
        };

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async create(payload) {
        const user = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            { $set: { username: user.username, password: user.password } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }

    async findByUName(uname) {
        const user = await this.User.findOne({ username: uname });
        return user;
    }

    // async findUser(filter) {
    //     const user = this.extractUserData(filter);
    //     const cursor = this.find({
    //         username: user.username,
    //         password: user.password
    //     });
    //     return await cursor.toArray();
    // }
}

module.exports = UserService;